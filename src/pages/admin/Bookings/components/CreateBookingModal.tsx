// Modal tạo lịch hẹn (operator) — cần customer + service + slot.
// 2 mode chọn slot: gợi ý nhanh (top 8) hoặc xem toàn bộ grid FREE/BUSY.
import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Spin, Radio, Tooltip } from 'antd';
import moment from 'moment';
import * as customersApi from '@/services/Customers/api';
import * as servicesApi from '@/services/Services/api';
import * as bookingsApi from '@/services/Bookings/api';

type Props = {
	open: boolean;
	loading?: boolean;
	onCancel: () => void;
	onSubmit: (payload: BookingMgmt.ICreateOperatorPayload) => Promise<any>;
};

type SlotMode = 'suggested' | 'grid';

export default function CreateBookingModal({ open, loading, onCancel, onSubmit }: Props) {
	const [form] = Form.useForm();
	const [customers, setCustomers] = useState<CustomerMgmt.ICustomer[]>([]);
	const [services, setServices] = useState<SvcMgmt.IService[]>([]);
	const [availability, setAvailability] = useState<BookingMgmt.IAvailability | null>(null);
	const [grid, setGrid] = useState<BookingMgmt.IAvailabilityGrid | null>(null);
	const [fetchingSlots, setFetchingSlots] = useState(false);
	const [slotMode, setSlotMode] = useState<SlotMode>('suggested');

	useEffect(() => {
		if (!open) return;
		form.resetFields();
		setAvailability(null);
		setGrid(null);
		setSlotMode('suggested');
		(async () => {
			try {
				const [cRes, sRes] = await Promise.all([
					customersApi.getCustomers({ isActive: true, limit: 100 }),
					servicesApi.getServices({ isActive: true, limit: 100 }),
				]);
				setCustomers((cRes.data as any).data ?? []);
				setServices((sRes.data as any).data ?? []);
			} catch {}
		})();
	}, [open, form]);

	const serviceId = Form.useWatch('serviceId', form);
	const dateValue = Form.useWatch('date', form);

	useEffect(() => {
		if (!serviceId || !dateValue) {
			setAvailability(null);
			setGrid(null);
			return;
		}
		const d = moment.isMoment(dateValue) ? dateValue : moment(dateValue);
		const dateStr = d.format('YYYY-MM-DD');
		setFetchingSlots(true);
		const loader =
			slotMode === 'grid'
				? bookingsApi.getAvailabilityGrid(serviceId, dateStr).then((r) => {
						setGrid(r.data);
						setAvailability(null);
				  })
				: bookingsApi.getAvailability(serviceId, dateStr).then((r) => {
						setAvailability(r.data);
						setGrid(null);
				  });
		loader.catch(() => {
			setAvailability(null);
			setGrid(null);
		});
		Promise.resolve(loader).finally(() => setFetchingSlots(false));
		form.setFieldsValue({ slot: undefined });
	}, [serviceId, dateValue, slotMode, form]);

	const handleOk = async () => {
		const values = await form.validateFields();
		const d = moment.isMoment(values.date) ? values.date : moment(values.date);
		const [hh, mm] = String(values.slot).split(':');
		const scheduledStart = d
			.clone()
			.hour(Number(hh))
			.minute(Number(mm))
			.second(0)
			.millisecond(0)
			.toISOString();

		const r = await onSubmit({
			customerId: values.customerId,
			serviceId: values.serviceId,
			scheduledStart,
			note: values.note || undefined,
		});
		if (r) form.resetFields();
	};

	const renderSlotPicker = () => {
		if (fetchingSlots) {
			return (
				<div style={{ padding: 8 }}>
					<Spin size='small' /> <span style={{ marginLeft: 8 }}>Đang tải slot...</span>
				</div>
			);
		}
		if (!serviceId || !dateValue) {
			return <Select placeholder='Chọn dịch vụ + ngày trước' disabled />;
		}
		if (slotMode === 'suggested') {
			if (!availability || availability.suggestedSlots.length === 0) {
				return <Select placeholder='Không còn slot trống — chọn ngày khác' disabled />;
			}
			return (
				<Select
					placeholder='Chọn giờ'
					options={availability.suggestedSlots.map((t) => ({ value: t, label: t }))}
				/>
			);
		}
		// grid mode
		if (!grid || grid.slots.length === 0) {
			return <div style={{ color: '#9CA3AF', fontSize: 13 }}>Không có slot nào trong ngày.</div>;
		}
		const selectedSlot = form.getFieldValue('slot');
		return (
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(8, 1fr)',
					gap: 6,
					maxHeight: 220,
					overflowY: 'auto',
					padding: 4,
				}}
			>
				{grid.slots.map((s) => {
					const isFree = s.status === 'FREE';
					const isSelected = selectedSlot === s.time;
					return (
						<Tooltip key={s.time} title={isFree ? 'Trống' : 'Đã có lịch'}>
							<button
								type='button'
								disabled={!isFree}
								onClick={() => form.setFieldsValue({ slot: s.time })}
								style={{
									padding: '6px 4px',
									borderRadius: 6,
									border: isSelected ? '2px solid #c47070' : '1px solid #E5E7EB',
									background: isSelected ? '#FDF2F2' : isFree ? '#F0FDF4' : '#FEE2E2',
									color: isSelected ? '#9B1C1C' : isFree ? '#059669' : '#9CA3AF',
									fontSize: 12,
									fontWeight: 500,
									cursor: isFree ? 'pointer' : 'not-allowed',
									opacity: isFree ? 1 : 0.6,
								}}
							>
								{s.time}
							</button>
						</Tooltip>
					);
				})}
			</div>
		);
	};

	return (
		<Modal
			title='Tạo lịch hẹn'
			visible={open}
			centered
			width={680}
			onCancel={onCancel}
			onOk={handleOk}
			confirmLoading={loading}
			okText='Tạo lịch hẹn'
			cancelText='Huỷ'
			okButtonProps={{ style: { background: '#c47070', borderColor: '#c47070' } }}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='customerId'
					label='Khách hàng'
					rules={[{ required: true, message: 'Chọn khách hàng' }]}
				>
					<Select
						showSearch
						optionFilterProp='label'
						placeholder='Tìm theo tên hoặc SĐT'
						options={customers.map((c) => ({ value: c.id, label: `${c.fullName} — ${c.phone}` }))}
					/>
				</Form.Item>

				<Form.Item
					name='serviceId'
					label='Dịch vụ'
					rules={[{ required: true, message: 'Chọn dịch vụ' }]}
				>
					<Select
						showSearch
						optionFilterProp='label'
						placeholder='Chọn dịch vụ'
						options={services.map((s) => ({ value: s.id, label: s.name }))}
					/>
				</Form.Item>

				<Form.Item name='date' label='Ngày' rules={[{ required: true, message: 'Chọn ngày' }]}>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
				</Form.Item>

				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
					<span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary, #1F2937)' }}>
						Khung giờ {availability ? `(${availability.serviceName} · ${availability.staffName})` : ''}
						<span style={{ color: '#FF4D4F', marginLeft: 4 }}>*</span>
					</span>
					<Radio.Group
						size='small'
						value={slotMode}
						onChange={(e) => setSlotMode(e.target.value)}
					>
						<Radio.Button value='suggested'>Gợi ý (8)</Radio.Button>
						<Radio.Button value='grid'>Xem tất cả</Radio.Button>
					</Radio.Group>
				</div>
				<Form.Item name='slot' rules={[{ required: true, message: 'Chọn khung giờ' }]}>
					{renderSlotPicker()}
				</Form.Item>

				<Form.Item name='note' label='Ghi chú'>
					<Input.TextArea rows={2} maxLength={500} placeholder='VD: Khách yêu cầu phòng yên tĩnh' />
				</Form.Item>
			</Form>
		</Modal>
	);
}
