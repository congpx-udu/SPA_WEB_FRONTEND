// Chi tiết booking + edit note.
import { useEffect } from 'react';
import { Modal, Tag, Form, Input, Button, Divider } from 'antd';
import moment from 'moment';
import { Save } from 'lucide-react';
import { BOOKING_STATUS_OPTIONS, BOOKING_SOURCE_LABEL } from '@/services/Bookings/constant';

type Props = {
	open: boolean;
	booking: BookingMgmt.IBooking | null;
	loading?: boolean;
	onCancel: () => void;
	onUpdate: (id: string, payload: BookingMgmt.IUpdatePayload) => Promise<any>;
	onAfterAction: () => void;
};

const fmtTime = (v?: string | null) => (v ? moment(v).format('DD/MM/YYYY HH:mm') : '—');

export default function BookingDetailModal({
	open,
	booking,
	loading,
	onCancel,
	onUpdate,
	onAfterAction,
}: Props) {
	const [form] = Form.useForm();

	useEffect(() => {
		if (open && booking) form.setFieldsValue({ note: booking.note });
	}, [open, booking, form]);

	if (!booking) return null;

	const statusOpt = BOOKING_STATUS_OPTIONS.find((s) => s.value === booking.status);
	const editable = ['CONFIRMED', 'CHECKED_IN'].includes(booking.status);

	const handleSave = async () => {
		const values = await form.validateFields();
		const r = await onUpdate(booking.id, { note: values.note ?? '' });
		if (r) onAfterAction();
	};

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<span style={{ fontWeight: 600 }}>{booking.bookingCode}</span>
					<Tag color={statusOpt?.color}>{statusOpt?.label}</Tag>
					<Tag color={booking.source === 'LANDING_PAGE' ? '#2563EB' : '#7C3AED'}>
						{BOOKING_SOURCE_LABEL[booking.source]}
					</Tag>
				</div>
			}
			visible={open}
			centered
			width={680}
			onCancel={onCancel}
			footer={
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<Button onClick={onCancel}>Đóng</Button>
					{editable && (
						<Button
							type='primary'
							icon={<Save size={14} />}
							onClick={handleSave}
							loading={loading}
							style={{ background: '#059669', borderColor: '#059669' }}
						>
							Lưu thay đổi
						</Button>
					)}
				</div>
			}
		>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 13 }}>
				<div>
					<div style={{ color: '#6B7280' }}>Khách hàng</div>
					<div style={{ fontWeight: 500 }}>{booking.customerSnapshot.fullName}</div>
					<div style={{ color: '#6B7280', fontSize: 12 }}>
						{booking.customerSnapshot.phone}
						{booking.customerSnapshot.email ? ` · ${booking.customerSnapshot.email}` : ''}
					</div>
				</div>
				<div>
					<div style={{ color: '#6B7280' }}>Dịch vụ</div>
					<div style={{ fontWeight: 500 }}>
						{booking.serviceSnapshot.name} ({booking.serviceSnapshot.code})
					</div>
					<div style={{ color: '#6B7280', fontSize: 12 }}>
						{booking.serviceSnapshot.price.toLocaleString('vi-VN')}đ ·{' '}
						{booking.serviceSnapshot.durationMinutes} phút
					</div>
				</div>
				<div>
					<div style={{ color: '#6B7280' }}>Chuyên viên</div>
					<div>{booking.staffSnapshot.fullName}</div>
				</div>
				<div>
					<div style={{ color: '#6B7280' }}>Khung giờ</div>
					<div>{fmtTime(booking.scheduledStart)}</div>
					<div style={{ color: '#6B7280', fontSize: 12 }}>
						đến {moment(booking.scheduledEnd).format('HH:mm')}
					</div>
				</div>
				{booking.serviceOrderId && (
					<div>
						<div style={{ color: '#6B7280' }}>Phiếu DV liên kết</div>
						<code>{booking.serviceOrderId}</code>
					</div>
				)}
				{booking.cancelledAt && (
					<div>
						<div style={{ color: '#6B7280' }}>Huỷ</div>
						<div style={{ color: '#DC2626' }}>{booking.cancelReason}</div>
						<div style={{ color: '#6B7280', fontSize: 12 }}>{fmtTime(booking.cancelledAt)}</div>
					</div>
				)}
			</div>

			<Divider style={{ margin: '14px 0' }} />

			<Form form={form} layout='vertical' disabled={!editable}>
				<Form.Item name='note' label='Ghi chú'>
					<Input.TextArea rows={3} maxLength={500} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
