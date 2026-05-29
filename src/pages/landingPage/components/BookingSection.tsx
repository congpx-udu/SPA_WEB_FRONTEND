import { useEffect } from 'react';
import { Form, Input, Select, Button, Spin } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MyDatePicker from '@/components/MyDatePicker';
import { useModel } from 'umi';
import moment from 'moment';

const { TextArea } = Input;

export function BookingSection() {
	const [form] = Form.useForm();
	const {
		loading,
		perks,
		services,
		availability,
		loadingSlots,
		loadServices,
		loadAvailability,
		submitBooking,
	} = useModel('landingPage.booking');

	useEffect(() => {
		loadServices();
	}, [loadServices]);

	const serviceId = Form.useWatch('serviceId', form);
	const dateValue = Form.useWatch('date', form);

	useEffect(() => {
		if (!serviceId || !dateValue) return;
		const d = moment.isMoment(dateValue) ? dateValue : moment(dateValue);
		loadAvailability(serviceId, d.format('YYYY-MM-DD'));
		form.setFieldsValue({ slot: undefined });
	}, [serviceId, dateValue, loadAvailability, form]);

	const onFinish = async (values: any) => {
		const phone = String(values.phone || '').replace(/\D/g, '');
		if (phone.length !== 10) {
			form.setFields([{ name: 'phone', errors: ['Số điện thoại phải đủ 10 chữ số'] }]);
			return;
		}
		const d = moment.isMoment(values.date) ? values.date : moment(values.date);
		const [hh, mm] = String(values.slot).split(':');
		const scheduledStart = d
			.clone()
			.hour(Number(hh))
			.minute(Number(mm))
			.second(0)
			.millisecond(0)
			.toISOString();

		const fullName = [values.firstName, values.lastName].filter(Boolean).join(' ').trim();
		const ok = await submitBooking({
			serviceId: values.serviceId,
			scheduledStart,
			fullName,
			phone,
			email: values.email || undefined,
			note: values.notes || undefined,
		});
		if (ok) form.resetFields();
	};

	return (
		<section
			id='booking'
			className='flex gap-[72px] px-[120px] py-[100px]'
			style={{ backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, sans-serif' }}
		>
			<div className='flex-1 flex flex-col gap-6'>
				<span
					className='text-[13px] font-semibold tracking-[4px]'
					style={{ color: 'var(--accent-deep)' }}
				>
					ĐẶT LỊCH
				</span>
				<h2
					className='text-[40px] font-semibold leading-[1.2]'
					style={{ color: 'var(--text-primary)' }}
				>
					Đặt Lịch
					<br />
					Thư Giãn
				</h2>
				<p className='text-base leading-relaxed' style={{ color: 'var(--text-secondary)' }}>
					Hãy bắt đầu hành trình thư giãn tuyệt đối. Đặt lịch hẹn trực tuyến và để chúng tôi lo
					liệu phần còn lại. Chọn dịch vụ, ngày giờ và chuyên viên trị liệu mà bạn yêu thích.
				</p>
				<div className='flex flex-col gap-4'>
					{perks.map((perk) => (
						<div key={perk} className='flex items-center gap-3'>
							<CheckCircleOutlined style={{ color: 'var(--accent-deep)', fontSize: 20 }} />
							<span className='text-sm' style={{ color: 'var(--text-secondary)' }}>
								{perk}
							</span>
						</div>
					))}
				</div>
			</div>

			<div
				className='flex-1 rounded-3xl p-10'
				style={{
					backgroundColor: 'var(--bg-card)',
					border: '1px solid var(--border-light)',
					boxShadow: '0 8px 30px #f4c2c215',
				}}
			>
				<h3 className='text-[22px] font-semibold mb-6' style={{ color: 'var(--text-primary)' }}>
					Đặt Lịch Hẹn
				</h3>
				<Form form={form} layout='vertical' onFinish={onFinish} requiredMark={false}>
					<div className='flex gap-4'>
						<Form.Item
							name='firstName'
							label='Họ'
							style={{ flex: 1 }}
							rules={[{ required: true, message: 'Nhập họ' }]}
						>
							<Input placeholder='Nhập họ' className='landing-input' />
						</Form.Item>
						<Form.Item
							name='lastName'
							label='Tên'
							style={{ flex: 1 }}
							rules={[{ required: true, message: 'Nhập tên' }]}
						>
							<Input placeholder='Nhập tên' className='landing-input' />
						</Form.Item>
					</div>
					<Form.Item
						name='email'
						label='Địa chỉ email'
						rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
					>
						<Input placeholder='email@example.com' className='landing-input' />
					</Form.Item>
					<Form.Item
						name='phone'
						label='Số điện thoại'
						rules={[{ required: true, message: 'Nhập số điện thoại 10 chữ số' }]}
					>
						<Input placeholder='0xxxxxxxxx' className='landing-input' />
					</Form.Item>
					<div className='flex gap-4'>
						<Form.Item
							name='serviceId'
							label='Dịch vụ'
							style={{ flex: 1 }}
							rules={[{ required: true, message: 'Chọn dịch vụ' }]}
						>
							<Select
								placeholder='Chọn dịch vụ'
								className='landing-select'
								options={services.map((s) => ({ value: s.id, label: s.name }))}
								showSearch
								optionFilterProp='label'
							/>
						</Form.Item>
						<Form.Item
							name='date'
							label='Ngày mong muốn'
							style={{ flex: 1 }}
							rules={[{ required: true, message: 'Chọn ngày' }]}
						>
							<MyDatePicker placeholder='Chọn ngày' format='DD/MM/YYYY' />
						</Form.Item>
					</div>

					<Form.Item
						name='slot'
						label={
							availability
								? `Khung giờ gợi ý (${availability.serviceName} · ${availability.staffName})`
								: 'Khung giờ'
						}
						rules={[{ required: true, message: 'Chọn khung giờ' }]}
					>
						{loadingSlots ? (
							<div style={{ padding: 8 }}>
								<Spin size='small' /> <span style={{ marginLeft: 8 }}>Đang tải slot...</span>
							</div>
						) : availability && availability.suggestedSlots.length > 0 ? (
							<Select
								className='landing-select'
								placeholder='Chọn giờ'
								options={availability.suggestedSlots.map((t) => ({ value: t, label: t }))}
							/>
						) : (
							<Select
								className='landing-select'
								placeholder={
									serviceId && dateValue
										? 'Không còn slot trống — chọn ngày khác'
										: 'Chọn dịch vụ + ngày trước'
								}
								disabled
							/>
						)}
					</Form.Item>

					<Form.Item name='notes' label='Yêu cầu đặc biệt (Tùy chọn)'>
						<TextArea
							rows={3}
							placeholder='Dị ứng, sở thích hoặc yêu cầu đặc biệt...'
							className='landing-input'
							maxLength={500}
						/>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }}>
						<Button
							type='primary'
							htmlType='submit'
							block
							loading={loading}
							className='landing-btn-primary'
						>
							Đặt lịch hẹn <ArrowRightOutlined />
						</Button>
					</Form.Item>
				</Form>
			</div>
		</section>
	);
}

export default BookingSection;
