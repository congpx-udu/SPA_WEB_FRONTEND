import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Form, Select, message } from 'antd';
import { getTickets, saveTickets } from '@/services/staff/ThuNgan/api';
import ThuNganHeader from './components/ThuNganHeader';
import KpiCards from './components/KpiCards';
import TicketTable from './components/TicketTable';
import QuickActionsPayment from './components/QuickActionsPayment';
import './styles.less';

const ThuNganDashboard: React.FC = () => {
	const [tickets, setTickets] = useState<ThuNgan.ITicket[]>([]);
	const [payModal, setPayModal] = useState(false);
	const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
	const [payForm] = Form.useForm();

	useEffect(() => {
		try {
			setTickets(getTickets());
		} catch (e) {
			message.error('Không tải được dữ liệu thu ngân');
		}
	}, []);

	useEffect(() => {
		if (tickets.length) saveTickets(tickets);
	}, [tickets]);

	const handleOpenPay = (key: string) => {
		setSelectedTicket(key);
		setPayModal(true);
	};

	const handlePay = (values: any) => {
		if (!selectedTicket) return;
		setTickets((prev) =>
			prev.map((t) => (t.key === selectedTicket ? { ...t, status: 'da_thanh_toan' as const } : t)),
		);
		setPayModal(false);
		setSelectedTicket(null);
		payForm.resetFields();
		try {
			message.success(`Thanh toán thành công (${values.method})`);
		} catch {
			message.error('Thanh toán thất bại');
		}
	};

	const ticket = tickets.find((t) => t.key === selectedTicket);

	return (
		<div className='thu-ngan-dashboard'>
			<ThuNganHeader />

			<KpiCards />

			<Row gutter={[20, 20]}>
				<Col xs={24} lg={15}>
					<TicketTable tickets={tickets} onPay={handleOpenPay} />
				</Col>
				<Col xs={24} lg={9}>
					<QuickActionsPayment />
				</Col>
			</Row>

			<Modal
				title='Thanh toán phiếu dịch vụ'
				visible={payModal}
				onCancel={() => {
					setPayModal(false);
					setSelectedTicket(null);
					payForm.resetFields();
				}}
				onOk={() => payForm.submit()}
				okText='Xác nhận thanh toán'
				cancelText='Hủy'
			>
				{ticket && (
					<div style={{ marginBottom: 16, padding: 12, background: '#F8F9FC', borderRadius: 10 }}>
						<div style={{ fontSize: 13, fontWeight: 600, color: '#2D2D2D' }}>
							{ticket.code} – {ticket.customer}
						</div>
						<div style={{ fontSize: 12, color: '#6B6B6B', marginTop: 4 }}>
							{ticket.service} · {ticket.total.toLocaleString('vi-VN')}đ
						</div>
					</div>
				)}
				<Form form={payForm} layout='vertical' onFinish={handlePay}>
					<Form.Item
						name='method'
						label='Phương thức thanh toán'
						rules={[{ required: true, message: 'Chọn phương thức' }]}
					>
						<Select placeholder='Chọn phương thức'>
							<Select.Option value='Tiền mặt'>Tiền mặt</Select.Option>
							<Select.Option value='Chuyển khoản'>Chuyển khoản</Select.Option>
							<Select.Option value='VNPay'>VNPay</Select.Option>
							<Select.Option value='Thẻ'>Thẻ tín dụng/ghi nợ</Select.Option>
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ThuNganDashboard;
