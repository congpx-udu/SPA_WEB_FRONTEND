// Modal tạo lịch hẹn (operator) — cần customer + service + slot.
import { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, DatePicker, Spin } from 'antd';
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

export default function CreateBookingModal({ open, loading, onCancel, onSubmit }: Props) {
	const [form] = Form.useForm();
	const [customers, setCustomers] = useState<CustomerMgmt.ICustomer[]>([]);
	const [services, setServices] = useState<SvcMgmt.IService[]>([]);
	const [availability, setAvailability] = useState<BookingMgmt.IAvailability | null>(null);
	const [fetchingSlots, setFetchingSlots] = useState(false);

	useEffect(() => {
		if (!open) return;
		form.resetFields();
		setAvailability(null);
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
			return;
		}
		const d = moment.isMoment(dateValue) ? dateValue : moment(dateValue);
		setFetchingSlots(true);
		bookingsApi
			.getAvailability(serviceId, d.format('YYYY-MM-DD'))
			.then((r) => setAvailability(r.data))
			.catch(() => setAvailability(null))
			.finally(() => setFetchingSlots(false));
		form.setFieldsValue({ slot: undefined });
	}, [serviceId, dateValue, form]);

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

	return (
		<Modal
			title='Tạo lịch hẹn'
			visible={open}
			centered
			width={620}
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

				<Form.Item
					name='slot'
					label={
						availability
							? `Khung giờ gợi ý (${availability.serviceName} · ${availability.staffName})`
							: 'Khung giờ'
					}
					rules={[{ required: true, message: 'Chọn khung giờ' }]}
				>
					{fetchingSlots ? (
						<div style={{ padding: 8 }}>
							<Spin size='small' /> <span style={{ marginLeft: 8 }}>Đang tải slot...</span>
						</div>
					) : availability && availability.suggestedSlots.length > 0 ? (
						<Select
							placeholder='Chọn giờ'
							options={availability.suggestedSlots.map((t) => ({ value: t, label: t }))}
						/>
					) : (
						<Select
							placeholder={
								serviceId && dateValue
									? 'Không còn slot trống — chọn ngày khác'
									: 'Chọn dịch vụ + ngày trước'
							}
							disabled
						/>
					)}
				</Form.Item>

				<Form.Item name='note' label='Ghi chú'>
					<Input.TextArea rows={2} maxLength={500} placeholder='VD: Khách yêu cầu phòng yên tĩnh' />
				</Form.Item>
			</Form>
		</Modal>
	);
}
