import React from 'react';
import { Row, Col } from 'antd';
import DashboardHeader from './components/DashboardHeader';
import KpiCards from './components/KpiCards';
import RevenueChart from './components/RevenueChart';
import AppointmentStatusChart from './components/AppointmentStatusChart';
import RecentAppointments from './components/RecentAppointments';
import PopularServices from './components/PopularServices';
import './style.less';

const Dashboard: React.FC = () => {
	return (
		<div className='spa-dashboard'>
			<DashboardHeader />

			<KpiCards />

			<Row gutter={[20, 20]} className='charts-row'>
				<Col xs={24} lg={14}>
					<RevenueChart />
				</Col>
				<Col xs={24} lg={10}>
					<AppointmentStatusChart />
				</Col>
			</Row>

			<Row gutter={[20, 20]} className='bottom-row'>
				<Col xs={24} lg={15}>
					<RecentAppointments />
				</Col>
				<Col xs={24} lg={9}>
					<PopularServices />
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
