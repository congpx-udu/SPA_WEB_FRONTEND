// Modal tạo phiếu DV mới — chọn khách hàng (search by phone/name) + note. Dùng find-or-create để hỗ trợ walk-in.
import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Spin, Switch, message } from 'antd';
import * as customersApi from '@/services/Customers/api';

type Props = {
	open: boolean;
	onCancel: () => void;
	onCreated: (orderId: string) => void | Promise<void>;
	create: (payload: SvcOrderMgmt.ICreatePayload) => Promise<SvcOrderMgmt.IServiceOrder>;
};

export default function CreateOrderModal({ open, onCancel, onCreated, create }: Props) {
	const [form] = Form.useForm();
	const [walkin, setWalkin] = useState(false);
	const [options, setOptions] = useState<CustomerMgmt.ICustomer[]>([]);
	const [searching, setSearching] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!open) {
			form.resetFields();
			setOptions([]);
			setWalkin(false);
		}
	}, [open, form]);

	const handleSearch = async (text: string) => {
		const q = text.trim();
		if (!q) {
			setOptions([]);
			return;
		}
		setSearching(true);
		try {
			const res = await customersApi.getCustomers({ search: q, isActive: true, limit: 20 });
			setOptions((res.data as any).data ?? []);
		} finally {
			setSearching(false);
		}
	};

	const onOk = async () => {
		const values = await form.validateFields();
		setSubmitting(true);
		try {
			let customerId: string = values.customerId;
			if (walkin) {
				const phone = (values.phone as string).trim();
				const fullName = (values.fullName as string).trim();
				const res = await customersApi.findOrCreateCustomer({
					phone,
					fullName,
					source: 'WALK_IN',
				});
				customerId = res.data.id;
				if (res.data.wasCreated) message.info('Đã tạo khách hàng mới (walk-in)');
			}
			const order = await create({ customerId, note: values.note?.trim() || undefined });
			await onCreated(order.id);
		} catch (e: any) {
			if (!e?.errorFields) {
				// error đã hiện qua model.create
			}
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Modal
			visible={open}
			title='Tạo phiếu dịch vụ mới'
			okText='Tạo phiếu'
			cancelText='Huỷ'
			onCancel={onCancel}
			onOk={onOk}
			confirmLoading={submitting}
			destroyOnClose
		>
			<Form form={form} layout='vertical'>
				<Form.Item label='Khách hàng walk-in?'>
					<Switch checked={walkin} onChange={setWalkin} />
					<span style={{ marginLeft: 8, color: '#6B7280', fontSize: 12 }}>
						Bật để nhập thông tin nhanh, hệ thống tự tạo khách hàng mới nếu SĐT chưa có.
					</span>
				</Form.Item>

				{!walkin ? (
					<Form.Item
						name='customerId'
						label='Khách hàng'
						rules={[{ required: true, message: 'Chọn khách hàng' }]}
					>
						<Select
							showSearch
							placeholder='Tìm theo tên hoặc SĐT...'
							filterOption={false}
							onSearch={handleSearch}
							notFoundContent={searching ? <Spin size='small' /> : 'Không tìm thấy'}
							options={options.map((c) => ({
								value: c.id,
								label: `${c.fullName} — ${c.phone}`,
							}))}
						/>
					</Form.Item>
				) : (
					<>
						<Form.Item
							name='fullName'
							label='Họ tên'
							rules={[{ required: true, message: 'Nhập họ tên' }]}
						>
							<Input maxLength={100} placeholder='Nguyễn Văn A' />
						</Form.Item>
						<Form.Item
							name='phone'
							label='Số điện thoại'
							rules={[
								{ required: true, message: 'Nhập SĐT' },
								{ pattern: /^[0-9+\- ]{8,15}$/, message: 'SĐT không hợp lệ' },
							]}
						>
							<Input maxLength={15} placeholder='0901234567' />
						</Form.Item>
					</>
				)}

				<Form.Item name='note' label='Ghi chú phiếu'>
					<Input.TextArea rows={3} maxLength={500} placeholder='Tuỳ chọn' showCount />
				</Form.Item>
			</Form>
		</Modal>
	);
}
