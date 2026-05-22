// Modal điều chỉnh tồn kho — nhập thêm / xuất bớt. Tạm thời chưa có audit
// trail vì BE chưa expose /stock-receipts; chỉ gọi PATCH /materials/:id với
// stockQuantity = stockQuantity ± delta.
import { useEffect } from 'react';
import { Modal, Form, InputNumber, Radio, Input, Alert } from 'antd';

type Props = {
	open: boolean;
	material: MaterialMgmt.IMaterial | null;
	loading?: boolean;
	onCancel: () => void;
	onSubmit: (id: string, payload: { stockQuantity: number }) => Promise<void>;
};

export default function StockAdjustModal({ open, material, loading, onCancel, onSubmit }: Props) {
	const [form] = Form.useForm();
	const watchDirection = Form.useWatch('direction', form);
	const watchAmount = Form.useWatch('amount', form) ?? 0;

	useEffect(() => {
		if (open) {
			form.resetFields();
			form.setFieldsValue({ direction: 'IN', amount: 0 });
		}
	}, [open, form]);

	if (!material) return null;

	const current = material.stockQuantity;
	const delta = watchDirection === 'OUT' ? -watchAmount : watchAmount;
	const next = current + delta;

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const amount = Number(values.amount);
			if (amount <= 0) return;
			const sign = values.direction === 'OUT' ? -1 : 1;
			const newStock = current + sign * amount;
			if (newStock < 0) {
				const { message } = await import('antd');
				message.error('Tồn kho sau điều chỉnh không được âm');
				return;
			}
			await onSubmit(material.id, { stockQuantity: newStock });
		} catch (err: any) {
			if (err?.errorFields) return;
			const msg = err?.response?.data?.message;
			if (msg) {
				const { message } = await import('antd');
				message.error(Array.isArray(msg) ? msg.join(', ') : msg);
			}
		}
	};

	return (
		<Modal
			title={`Điều chỉnh tồn kho — ${material.name}`}
			visible={open}
			centered
			onCancel={onCancel}
			onOk={handleOk}
			confirmLoading={loading}
			okText='Xác nhận'
			cancelText='Huỷ'
			width={480}
			okButtonProps={{ style: { background: '#c47070', borderColor: '#c47070' } }}
		>
			<Alert
				type='info'
				showIcon
				style={{ marginBottom: 16, fontSize: 12 }}
				message='Tạm thời chưa lưu lịch sử nhập/xuất. Số lượng được cập nhật trực tiếp vào tồn kho.'
			/>

			<div style={{ marginBottom: 12, fontSize: 13 }}>
				<span style={{ color: '#6B7280' }}>Tồn kho hiện tại: </span>
				<strong>{current}</strong> {material.unit}
			</div>

			<Form form={form} layout='vertical'>
				<Form.Item name='direction' label='Loại điều chỉnh'>
					<Radio.Group buttonStyle='solid'>
						<Radio.Button value='IN'>Nhập thêm</Radio.Button>
						<Radio.Button value='OUT'>Xuất bớt</Radio.Button>
					</Radio.Group>
				</Form.Item>

				<Form.Item
					name='amount'
					label='Số lượng'
					rules={[
						{ required: true, message: 'Nhập số lượng' },
						{
							validator: (_, v) =>
								v > 0 ? Promise.resolve() : Promise.reject(new Error('Phải > 0')),
						},
					]}
				>
					<InputNumber style={{ width: '100%' }} min={0} step={1} />
				</Form.Item>

				<Form.Item name='note' label='Ghi chú (không lưu, chỉ tham khảo)'>
					<Input.TextArea rows={2} placeholder='VD: Nhập từ NCC Hoa Sen 22/05/2026' />
				</Form.Item>

				<div
					style={{
						background: '#FAFBFD',
						borderRadius: 8,
						padding: '10px 14px',
						fontSize: 13,
					}}
				>
					<span style={{ color: '#6B7280' }}>Tồn kho sau điều chỉnh: </span>
					<strong style={{ color: next < 0 ? '#DC2626' : '#059669' }}>
						{next} {material.unit}
					</strong>
				</div>
			</Form>
		</Modal>
	);
}
