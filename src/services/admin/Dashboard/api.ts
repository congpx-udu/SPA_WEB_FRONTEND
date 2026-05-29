// Aggregator dashboard — đọc data thật từ /service-orders, /customers, /services, /materials
// và compute KPI / chart data client-side.
import * as ordersApi from '@/services/ServiceOrders/api';
import * as customersApi from '@/services/Customers/api';

const startOfDay = (d: Date) => {
	const r = new Date(d);
	r.setHours(0, 0, 0, 0);
	return r;
};

const endOfDay = (d: Date) => {
	const r = new Date(d);
	r.setHours(23, 59, 59, 999);
	return r;
};

const DAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export interface IDashboardData {
	revenueToday: number;
	revenueYesterday: number;
	ordersToday: number;
	ordersYesterday: number;
	completedToday: number;
	newCustomersToday: number;
	totalCustomers: number;
	revenue7days: Dashboard.IRevenueData[];
	statusBreakdown: Dashboard.IAppointmentStatus[];
	recentAppointments: Dashboard.IAppointment[];
	popularServices: Dashboard.IPopularService[];
}

const AVATAR_COLORS = ['#FDA4AF', '#93C5FD', '#A78BFA', '#FCD34D', '#86EFAC', '#F9A8D4', '#FCA5A5'];
const SVC_PALETTE = [
	{ icon: '💆', color: '#c47070', bgColor: '#FFF0F0' },
	{ icon: '✨', color: '#2563EB', bgColor: '#DBEAFE' },
	{ icon: '🔥', color: '#7C3AED', bgColor: '#EDE9FE' },
	{ icon: '💧', color: '#059669', bgColor: '#D1FAE5' },
	{ icon: '🧴', color: '#D97706', bgColor: '#FEF3C7' },
];

const statusToView = (s: SvcOrderMgmt.TStatus): Dashboard.IAppointment['status'] => {
	switch (s) {
		case 'COMPLETED':
		case 'INVOICED':
			return 'completed';
		case 'IN_PROGRESS':
			return 'confirmed';
		case 'CANCELLED':
			return 'cancelled';
		default:
			return 'pending';
	}
};

export async function getDashboard(): Promise<IDashboardData> {
	const now = new Date();
	const todayStart = startOfDay(now);
	const todayEnd = endOfDay(now);
	const yesterdayStart = startOfDay(new Date(now.getTime() - 86400000));
	const yesterdayEnd = endOfDay(new Date(now.getTime() - 86400000));
	const sevenDaysAgo = startOfDay(new Date(now.getTime() - 6 * 86400000));

	const [ordersRes, customersRes] = await Promise.all([
		ordersApi.getServiceOrders({ page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'desc' }),
		customersApi.getCustomers({ page: 1, limit: 1 }),
	]);

	const orders = ordersRes.items;
	const totalCustomers = (customersRes.data as any).meta?.total ?? 0;

	let revenueToday = 0;
	let revenueYesterday = 0;
	let ordersToday = 0;
	let ordersYesterday = 0;
	let completedToday = 0;
	const statusCount: Record<string, number> = {};
	const revenueByDay = new Map<string, number>();
	const serviceCount = new Map<string, { name: string; price: number; count: number }>();

	for (const o of orders) {
		const created = new Date(o.createdAt);
		if (created >= todayStart && created <= todayEnd) ordersToday++;
		if (created >= yesterdayStart && created <= yesterdayEnd) ordersYesterday++;

		statusCount[o.status] = (statusCount[o.status] || 0) + 1;

		const isRevenue = o.status === 'COMPLETED' || o.status === 'INVOICED';
		if (isRevenue) {
			const completedAt = o.completedAt ? new Date(o.completedAt) : created;
			if (completedAt >= todayStart && completedAt <= todayEnd) {
				revenueToday += o.totalAmount;
				completedToday++;
			}
			if (completedAt >= yesterdayStart && completedAt <= yesterdayEnd) {
				revenueYesterday += o.totalAmount;
			}
			if (completedAt >= sevenDaysAgo) {
				const key = startOfDay(completedAt).toISOString();
				revenueByDay.set(key, (revenueByDay.get(key) || 0) + o.totalAmount);
			}
		}

		for (const it of o.items) {
			const cur = serviceCount.get(it.serviceId) || { name: it.serviceName, price: it.unitPrice, count: 0 };
			cur.count += it.quantity;
			serviceCount.set(it.serviceId, cur);
		}
	}

	const revenue7days: Dashboard.IRevenueData[] = [];
	for (let i = 6; i >= 0; i--) {
		const d = startOfDay(new Date(now.getTime() - i * 86400000));
		revenue7days.push({
			day: DAY_LABELS[d.getDay()],
			revenue: revenueByDay.get(d.toISOString()) || 0,
		});
	}

	const statusBreakdown: Dashboard.IAppointmentStatus[] = [
		{ label: 'Hoàn thành', value: (statusCount.COMPLETED || 0) + (statusCount.INVOICED || 0), color: '#22C55E' },
		{ label: 'Đang thực hiện', value: statusCount.IN_PROGRESS || 0, color: '#2563EB' },
		{ label: 'Nháp', value: statusCount.DRAFT || 0, color: '#F59E0B' },
		{ label: 'Đã huỷ', value: statusCount.CANCELLED || 0, color: '#EF4444' },
	].filter((s) => s.value > 0);

	const recentAppointments: Dashboard.IAppointment[] = orders.slice(0, 6).map((o, idx) => ({
		_id: o.id,
		customerName: o.customer?.fullName ?? '—',
		serviceName: o.items[0]?.serviceName ?? '(chưa thêm dịch vụ)',
		time: new Date(o.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
		status: statusToView(o.status),
		avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
	}));

	const popularServices: Dashboard.IPopularService[] = Array.from(serviceCount.entries())
		.sort((a, b) => b[1].count - a[1].count)
		.slice(0, 5)
		.map(([id, v], idx) => ({
			_id: id,
			name: v.name,
			bookings: v.count,
			price: v.price,
			icon: SVC_PALETTE[idx % SVC_PALETTE.length].icon,
			color: SVC_PALETTE[idx % SVC_PALETTE.length].color,
			bgColor: SVC_PALETTE[idx % SVC_PALETTE.length].bgColor,
		}));

	const newCustomersToday = 0; // BE chưa expose filter created_at; sẽ wire khi BE bổ sung.

	return {
		revenueToday,
		revenueYesterday,
		ordersToday,
		ordersYesterday,
		completedToday,
		newCustomersToday,
		totalCustomers,
		revenue7days,
		statusBreakdown,
		recentAppointments,
		popularServices,
	};
}
