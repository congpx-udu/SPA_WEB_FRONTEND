import React from 'react';
import { Table, Tag } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { MOCK_APPOINTMENTS, STATUS_CONFIG } from '@/services/admin/Dashboard/constant';
import './style.less';

const RecentAppointments: React.FC = () => {
	const columns = [
		{
			title: 'Khách hàng',
			dataIndex: 'customerName',
			key: 'customerName',
			render: (name: string, record: Dashboard.IAppointment) => (
				<div className='customer-cell'>
					<div className='avatar-circle' style={{ background: record.avatarColor }}>
						{name.charAt(name.lastIndexOf(' ') + 1)}
					</div>
					<span className='customer-name'>{name}</span>
				</div>
			),
		},
		{ title: 'Dịch vụ', dataIndex: 'serviceName', key: 'serviceName' },
		{ title: 'Thời gian', dataIndex: 'time', key: 'time' },
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center' as const,
			render: (status: string) => {
				const config = STATUS_CONFIG[status];
				return (
					<Tag
						className='status-tag'
						style={{ color: config.color, backgroundColor: config.bgColor, border: 'none' }}
					>
						{config.label}
					</Tag>
				);
			},
		},
	];

	return (
		<div className='table-card'>
			<div className='card-header'>
				<div className='header-left'>
					<h3>Lịch hẹn gần đây</h3>
					<span className='count-badge'>{MOCK_APPOINTMENTS.length}</span>
				</div>
				<a className='view-all not-underline'>
					Xem tất cả <ArrowRightOutlined />
				</a>
			</div>
			<Table
				dataSource={MOCK_APPOINTMENTS}
				columns={columns}
				rowKey='_id'
				pagination={false}
				size='middle'
				className='appointments-table'
			/>
		</div>
	);
};

export default RecentAppointments;
