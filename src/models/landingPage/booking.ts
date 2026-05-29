import { useCallback, useState } from 'react';
import { message } from 'antd';
import * as bookingsApi from '@/services/Bookings/api';
import * as servicesApi from '@/services/DichVu/api';

export const perks = [
	'Miễn phí tư vấn cho khách lần đầu',
	'Đổi lịch linh hoạt trước 24 giờ',
	'Giảm 10% cho thành viên trên mọi liệu trình',
];

export default () => {
	const [loading, setLoading] = useState(false);
	const [services, setServices] = useState<{ id: string; name: string }[]>([]);
	const [availability, setAvailability] = useState<{
		serviceName: string;
		staffName: string;
		suggestedSlots: string[];
	} | null>(null);
	const [loadingSlots, setLoadingSlots] = useState(false);

	const loadServices = useCallback(async () => {
		try {
			const items = await servicesApi.getLandingServices(100);
			setServices(items.map((s) => ({ id: (s as any)._id, name: s.name })));
		} catch {
			// silent — landing không cần báo lỗi
		}
	}, []);

	const loadAvailability = useCallback(async (serviceId: string, date: string) => {
		if (!serviceId || !date) {
			setAvailability(null);
			return;
		}
		setLoadingSlots(true);
		try {
			const res = await bookingsApi.getAvailability(serviceId, date);
			setAvailability({
				serviceName: res.data.serviceName,
				staffName: res.data.staffName,
				suggestedSlots: res.data.suggestedSlots ?? [],
			});
		} catch (e: any) {
			setAvailability(null);
			const msg = e?.response?.data?.message;
			if (msg) message.warning(Array.isArray(msg) ? msg.join(', ') : msg);
		} finally {
			setLoadingSlots(false);
		}
	}, []);

	const submitBooking = useCallback(
		async (payload: BookingMgmt.ICreatePublicPayload) => {
			setLoading(true);
			try {
				await bookingsApi.createPublic(payload);
				message.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận.');
				setAvailability(null);
				return true;
			} catch (e: any) {
				const msg = e?.response?.data?.message;
				message.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Đặt lịch thất bại, vui lòng thử lại');
				return false;
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	return {
		loading,
		perks,
		services,
		availability,
		loadingSlots,
		loadServices,
		loadAvailability,
		submitBooking,
	};
};
