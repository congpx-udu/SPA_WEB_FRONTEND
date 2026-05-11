import React from 'react';
import { Input, Badge } from 'antd';
import { SearchOutlined, CalendarOutlined, BellOutlined } from '@ant-design/icons';
import './style.less';

const DashboardHeader: React.FC = () => {
	const today = new Date().toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});

	return (
		<div className='dashboard-header'>
			<div className='header-title'>
				<h2>Dashboard</h2>
				<span>Chúc mừng trở lại đây là tổng quan hôm nay.</span>
			</div>
			<div className='header-actions'>
				<Input
					prefix={<SearchOutlined style={{ color: '#9B9B9B' }} />}
					placeholder='Tìm kiếm...'
					className='header-search'
				/>
				<div className='header-pill'>
					<CalendarOutlined style={{ color: 'var(--accent-deep)' }} />
					<span>{today}</span>
				</div>
				<div className='header-pill icon-pill'>
					<Badge dot color='#EF4444' offset={[-2, 2]}>
						<BellOutlined style={{ fontSize: 16, color: '#4A4A4A' }} />
					</Badge>
				</div>
				<div className='header-admin'>
					<div className='admin-avatar'>A</div>
					<div className='admin-info'>
						<span className='admin-name'>Admin</span>
						<span className='admin-role'>Quản lý</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DashboardHeader;
