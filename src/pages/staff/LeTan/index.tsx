import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Modal, Form, Input, Select, message } from 'antd';
import {
	KPI_CARDS,
	SERVICE_OPTIONS,
	SPECIALIST_OPTIONS,
} from '@/services/staff/LeTan/constant';
import {
	getAppointments,
	saveAppointments,
	getWaitingList,
	saveWaitingList,
} from '@/services/staff/LeTan/api';
import LeTanHeader from './components/LeTanHeader';
import KpiCards from './components/KpiCards';
import AppointmentTable from './components/AppointmentTable';
import QuickActions from './components/QuickActions';
import './styles.less';

const LeTanDashboard: React.FC = () => {
	const [appointments, setAppointments] = useState<LeTan.IAppointment[]>([]);
	const [waitingList, setWaitingList] = useState<LeTan.IWaitingCustomer[]>([]);
	const [searchText, setSearchText] = useState('');
	const [modalVisible, setModalVisible] = useState(false);
	const [checkinModal, setCheckinModal] = useState(false);
	const [form] = Form.useForm();
	const [checkinForm] = Form.useForm();

	useEffect(() => {
		try {
			setAppointments(getAppointments());
			setWaitingList(getWaitingList());
		} catch (e) {
			message.error('Không tải được dữ liệu lễ tân');
		}
	}, []);

	useEffect(() => {
		if (appointments.length) saveAppointments(appointments);
	}, [appointments]);

	useEffect(() => {
		if (waitingList.length) saveWaitingList(waitingList);
	}, [waitingList]);

	const stats = useMemo(() => {
		const total = appointments.length;
		const waiting = appointments.filter((a) => a.status === 'cho_xac_nhan').length;
		const checkedIn = appointments.filter((a) => a.status === 'dang_thuc_hien' || a.status === 'hoan_thanh').length;
		const walkin = waitingList.filter((w) => w.type === 'walkin').length;
		return { total, waiting, checkedIn, walkin };
	}, [appointments, waitingList]);

	const kpiData: LeTan.IKpiCard[] = useMemo(
		() =>
			KPI_CARDS.map((card) => {
				switch (card.key) {
					case 'appointments':
						return { ...card, value: stats.total.toString(), trend: `+${Math.max(0, stats.total - 5)} hôm qua` };
					case 'waiting':
						return { ...card, value: stats.waiting.toString() };
					case 'checkin':
						return { ...card, value: stats.checkedIn.toString() };
					case 'walkin':
						return { ...card, value: stats.walkin.toString() };
					default:
						return card;
				}
			}),
		[stats],
	);

	const filteredAppointments = useMemo(() => {
		if (!searchText) return appointments;
		const s = searchText.toLowerCase();
		return appointments.filter(
			(a) =>
				a.customer.toLowerCase().includes(s) ||
				a.service.toLowerCase().includes(s) ||
				a.specialist.toLowerCase().includes(s),
		);
	}, [appointments, searchText]);

	const handleCreateAppointment = (values: any) => {
		const avatarColors = ['#FDA4AF', '#93C5FD', '#A78BFA', '#FCD34D', '#86EFAC', '#F9A8D4', '#67E8F9', '#FCA5A5'];
		const newAppt: LeTan.IAppointment = {
			key: Date.now().toString(),
			time: values.time,
			customer: values.customer,
			phone: values.phone || '',
			service: values.service,
			specialist: values.specialist,
			status: 'cho_xac_nhan',
			price: Number(values.price) || 0,
			avatarColor: avatarColors[Math.floor(Math.random() * avatarColors.length)],
		};
		setAppointments((prev) => [...prev, newAppt]);
		setModalVisible(false);
		form.resetFields();
		message.success('Đã tạo lịch hẹn mới');
	};

	const handleCheckin = (values: any) => {
		const newWaiting: LeTan.IWaitingCustomer = {
			key: Date.now().toString(),
			name: values.name,
			detail: `Khách vãng lai · ${values.service}`,
			type: 'walkin',
			time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
		};
		setWaitingList((prev) => [...prev, newWaiting]);
		setCheckinModal(false);
		checkinForm.resetFields();
		message.success('Đã check-in khách vãng lai');
	};

	const handleConfirm = (key: string) => {
		setAppointments((prev) => prev.map((a) => (a.key === key ? { ...a, status: 'da_xac_nhan' as const } : a)));
		message.success('Đã xác nhận lịch hẹn');
	};

	const handleStartService = (key: string) => {
		setAppointments((prev) => prev.map((a) => (a.key === key ? { ...a, status: 'dang_thuc_hien' as const } : a)));
		message.success('Đã bắt đầu dịch vụ');
	};

	return (
		<div className='le-tan-dashboard'>
			<LeTanHeader searchText={searchText} onSearchChange={setSearchText} />

			<KpiCards kpiData={kpiData} />

			<Row gutter={[20, 20]}>
				<Col xs={24} lg={15}>
					<AppointmentTable
						appointments={filteredAppointments}
						waitingCount={stats.waiting}
						onConfirm={handleConfirm}
						onStartService={handleStartService}
					/>
				</Col>
				<Col xs={24} lg={9}>
					<QuickActions
						waitingList={waitingList}
						onCreateAppointment={() => setModalVisible(true)}
						onCheckin={() => setCheckinModal(true)}
					/>
				</Col>
			</Row>

			<Modal
				title='Tạo lịch hẹn mới'
				visible={modalVisible}
				onCancel={() => {
					setModalVisible(false);
					form.resetFields();
				}}
				onOk={() => form.submit()}
				okText='Tạo lịch hẹn'
				cancelText='Hủy'
			>
				<Form form={form} layout='vertical' onFinish={handleCreateAppointment}>
					<Form.Item name='customer' label='Tên khách hàng' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input placeholder='Nhập tên khách hàng' />
					</Form.Item>
					<Form.Item name='phone' label='Số điện thoại'>
						<Input placeholder='Nhập SĐT' />
					</Form.Item>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item name='time' label='Giờ hẹn' rules={[{ required: true, message: 'Chọn giờ' }]}>
								<Select placeholder='Chọn giờ'>
									{['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((t) => (
										<Select.Option key={t} value={t}>
											{t}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='price' label='Giá (VNĐ)'>
								<Input type='number' placeholder='0' />
							</Form.Item>
						</Col>
					</Row>
					<Form.Item name='service' label='Dịch vụ' rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
						<Select placeholder='Chọn dịch vụ'>
							{SERVICE_OPTIONS.map((s) => (
								<Select.Option key={s} value={s}>
									{s}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name='specialist' label='Chuyên viên' rules={[{ required: true, message: 'Chọn chuyên viên' }]}>
						<Select placeholder='Chọn chuyên viên'>
							{SPECIALIST_OPTIONS.map((s) => (
								<Select.Option key={s} value={s}>
									{s}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title='Check-in khách vãng lai'
				visible={checkinModal}
				onCancel={() => {
					setCheckinModal(false);
					checkinForm.resetFields();
				}}
				onOk={() => checkinForm.submit()}
				okText='Check-in'
				cancelText='Hủy'
			>
				<Form form={checkinForm} layout='vertical' onFinish={handleCheckin}>
					<Form.Item name='name' label='Tên khách hàng' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
						<Input placeholder='Nhập tên khách' />
					</Form.Item>
					<Form.Item name='phone' label='Số điện thoại'>
						<Input placeholder='Nhập SĐT' />
					</Form.Item>
					<Form.Item name='service' label='Dịch vụ yêu cầu' rules={[{ required: true, message: 'Chọn dịch vụ' }]}>
						<Select placeholder='Chọn dịch vụ'>
							{SERVICE_OPTIONS.map((s) => (
								<Select.Option key={s} value={s}>
									{s}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default LeTanDashboard;
