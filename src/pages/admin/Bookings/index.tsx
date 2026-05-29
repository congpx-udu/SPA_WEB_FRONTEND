// Quản lý lịch hẹn — ADMIN/OPERATOR.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Tag, Input, Select, DatePicker, Button, Dropdown, Menu, Tooltip, Modal } from 'antd';
import { useModel, history } from 'umi';
import {
	Plus,
	Search,
	MoreHorizontal,
	LogIn,
	XCircle,
	UserX,
	Eye,
} from 'lucide-react';
import moment from 'moment';
import PageHeader from '@/components/PageHeader';
import { BOOKING_STATUS_OPTIONS, BOOKING_SOURCE_LABEL } from '@/services/Bookings/constant';
import BookingDetailModal from './components/BookingDetailModal';
import CreateBookingModal from './components/CreateBookingModal';
import '@/pages/admin/Employees/styles.less';

const { RangePicker } = DatePicker;

export default function BookingsPage() {
	const {
		list,
		total,
		loading,
		submitting,
		detail,
		query,
		fetch,
		loadDetail,
		setDetail,
		createOperator,
		update,
		checkIn,
		cancel,
		noShow,
	} = useModel('bookings') as any;

	const [searchInput, setSearchInput] = useState('');
	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);
	const [createOpen, setCreateOpen] = useState(false);
	const [detailOpen, setDetailOpen] = useState(false);
	const [cancelTarget, setCancelTarget] = useState<BookingMgmt.IBooking | null>(null);
	const [cancelReason, setCancelReason] = useState('');
	const searchTimerRef = useRef<number | undefined>();

	useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
		searchTimerRef.current = window.setTimeout(() => {
			fetch({ search: searchInput.trim() || undefined, page: 1 });
		}, 300);
		return () => {
			if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchInput]);

	const openDetail = async (id: string) => {
		const b = await loadDetail(id);
		if (b) setDetailOpen(true);
	};

	const closeDetail = () => {
		setDetailOpen(false);
		setDetail(null);
	};

	const handleCheckIn = async (b: BookingMgmt.IBooking) => {
		const r = await checkIn(b.id);
		if (r?.data?.serviceOrder?.id) {
			Modal.confirm({
				title: 'Đã check-in & tạo phiếu DV',
				content: 'Mở phiếu dịch vụ vừa tạo?',
				okText: 'Mở phiếu DV',
				cancelText: 'Ở lại',
				onOk: () => history.push('/phieu-dich-vu'),
			});
			fetch();
		}
	};

	const submitCancel = async () => {
		if (!cancelTarget || !cancelReason.trim()) return;
		const r = await cancel(cancelTarget.id, cancelReason.trim());
		if (r) {
			setCancelTarget(null);
			setCancelReason('');
			fetch();
		}
	};

	const columns = useMemo(
		() => [
			{
				title: 'Mã lịch',
				dataIndex: 'bookingCode',
				width: 160,
				render: (v: string) => <code style={{ fontSize: 12, fontWeight: 600 }}>{v}</code>,
			},
			{
				title: 'Khách hàng',
				dataIndex: ['customerSnapshot', 'fullName'],
				width: 200,
				ellipsis: true,
				render: (_: any, r: BookingMgmt.IBooking) => (
					<div>
						<div style={{ fontWeight: 500 }}>{r.customerSnapshot.fullName}</div>
						<div style={{ color: '#6B7280', fontSize: 12 }}>{r.customerSnapshot.phone}</div>
					</div>
				),
			},
			{
				title: 'Dịch vụ',
				dataIndex: ['serviceSnapshot', 'name'],
				width: 200,
				ellipsis: true,
			},
			{
				title: 'Chuyên viên',
				dataIndex: ['staffSnapshot', 'fullName'],
				width: 140,
				ellipsis: true,
			},
			{
				title: 'Bắt đầu',
				dataIndex: 'scheduledStart',
				width: 150,
				render: (v: string) => moment(v).format('DD/MM/YYYY HH:mm'),
			},
			{
				title: 'Kết thúc',
				dataIndex: 'scheduledEnd',
				width: 90,
				render: (v: string) => moment(v).format('HH:mm'),
			},
			{
				title: 'Nguồn',
				dataIndex: 'source',
				width: 120,
				render: (v: BookingMgmt.TSource) => (
					<Tag color={v === 'LANDING_PAGE' ? '#2563EB' : '#7C3AED'}>{BOOKING_SOURCE_LABEL[v]}</Tag>
				),
			},
			{
				title: 'Trạng thái',
				dataIndex: 'status',
				width: 140,
				align: 'center' as const,
				render: (v: BookingMgmt.TStatus) => {
					const opt = BOOKING_STATUS_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label}</Tag>;
				},
			},
			{
				title: 'Thao tác',
				key: 'actions',
				width: 90,
				align: 'center' as const,
				render: (_: any, r: BookingMgmt.IBooking) => {
					const canCheckIn = r.status === 'CONFIRMED';
					const canCancel = ['CONFIRMED', 'CHECKED_IN', 'PENDING_OTP'].includes(r.status);
					const canNoShow = r.status === 'CONFIRMED';
					return (
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item key='view' icon={<Eye size={14} />} onClick={() => openDetail(r.id)}>
										Xem chi tiết
									</Menu.Item>
									{canCheckIn && (
										<Menu.Item
											key='checkin'
											icon={<LogIn size={14} />}
											onClick={() => handleCheckIn(r)}
										>
											Check-in & tạo phiếu DV
										</Menu.Item>
									)}
									{canNoShow && (
										<Menu.Item
											key='noshow'
											icon={<UserX size={14} />}
											onClick={async () => {
												const ok = await noShow(r.id);
												if (ok) fetch();
											}}
										>
											Khách không đến
										</Menu.Item>
									)}
									{canCancel && (
										<Menu.Item
											key='cancel'
											icon={<XCircle size={14} />}
											onClick={() => {
												setCancelTarget(r);
												setCancelReason('');
											}}
										>
											Huỷ lịch…
										</Menu.Item>
									)}
								</Menu>
							}
							trigger={['click']}
						>
							<Tooltip title='Tuỳ chọn'>
								<Button type='text' icon={<MoreHorizontal size={18} />} />
							</Tooltip>
						</Dropdown>
					);
				},
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	return (
		<div className='employees-page'>
			<PageHeader
				title='Lịch hẹn'
				subtitle='Quản lý lịch hẹn — khách tự đặt hoặc lễ tân đặt giúp'
				extras={
					<Button
						type='primary'
						icon={<Plus size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
						className='employees-page__add-btn'
						onClick={() => setCreateOpen(true)}
					>
						Tạo lịch hẹn
					</Button>
				}
			/>

			<div className='employees-page__toolbar'>
				<Input
					prefix={<Search size={14} color='#9B9B9B' />}
					placeholder='Tìm theo SĐT hoặc tên khách...'
					allowClear
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					style={{ width: 260, borderRadius: 10 }}
				/>
				<Select
					allowClear
					placeholder='Trạng thái'
					style={{ width: 180 }}
					options={BOOKING_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(v) => fetch({ status: v, page: 1 })}
				/>
				<RangePicker
					value={dateRange as any}
					format='DD/MM/YYYY'
					onChange={(range) => {
						setDateRange(range as any);
						fetch({
							fromDate: range?.[0]?.startOf('day').format('YYYY-MM-DD'),
							toDate: range?.[1]?.endOf('day').format('YYYY-MM-DD'),
							page: 1,
						});
					}}
				/>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={list}
				columns={columns as any}
				scroll={{ x: 1400 }}
				pagination={{
					current: query.page,
					pageSize: query.limit,
					total,
					showSizeChanger: true,
					onChange: (page, limit) => fetch({ page, limit }),
				}}
				className='employees-page__table'
			/>

			<CreateBookingModal
				open={createOpen}
				loading={submitting}
				onCancel={() => setCreateOpen(false)}
				onSubmit={async (payload) => {
					const r = await createOperator(payload);
					if (r) {
						setCreateOpen(false);
						fetch({ page: 1 });
					}
					return r;
				}}
			/>

			<BookingDetailModal
				open={detailOpen}
				booking={detail}
				loading={submitting}
				onCancel={closeDetail}
				onUpdate={update}
				onAfterAction={async () => {
					if (detail?.id) await loadDetail(detail.id);
					fetch();
				}}
			/>

			<Modal
				title='Huỷ lịch hẹn'
				visible={!!cancelTarget}
				centered
				onCancel={() => {
					setCancelTarget(null);
					setCancelReason('');
				}}
				onOk={submitCancel}
				okButtonProps={{ danger: true, disabled: !cancelReason.trim(), loading: submitting }}
				okText='Xác nhận huỷ'
				cancelText='Đóng'
			>
				{cancelTarget && (
					<>
						<div style={{ marginBottom: 12, padding: 10, background: '#FAFBFD', borderRadius: 8 }}>
							<strong>{cancelTarget.bookingCode}</strong> — {cancelTarget.customerSnapshot.fullName}
							<div style={{ color: '#6B7280', fontSize: 12 }}>
								{cancelTarget.serviceSnapshot.name} ·{' '}
								{moment(cancelTarget.scheduledStart).format('DD/MM/YYYY HH:mm')}
							</div>
						</div>
						<div style={{ marginBottom: 8 }}>Lý do huỷ (bắt buộc):</div>
						<Input.TextArea
							rows={3}
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							placeholder='VD: Khách báo huỷ lịch'
							maxLength={500}
						/>
					</>
				)}
			</Modal>
		</div>
	);
}
