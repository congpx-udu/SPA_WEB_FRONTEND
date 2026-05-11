import React from 'react';
import { Row, Col } from 'antd';
import {
	RiseOutlined,
	CalendarOutlined,
	UserAddOutlined,
	AppstoreOutlined,
	ArrowUpOutlined,
} from '@ant-design/icons';
import { KPI_CARDS } from '@/services/admin/Dashboard/constant';
import CountUp from '../CountUp';
import './style.less';

const iconMap: Record<string, React.ReactNode> = {
	RiseOutlined: <RiseOutlined />,
	CalendarOutlined: <CalendarOutlined />,
	UserAddOutlined: <UserAddOutlined />,
	AppstoreOutlined: <AppstoreOutlined />,
};

const KpiCards: React.FC = () => {
	return (
		<Row gutter={[20, 20]} className='kpi-row'>
			{KPI_CARDS.map((card) => (
				<Col xs={24} sm={12} lg={6} key={card.key}>
					<div className='kpi-card'>
						<div className='kpi-top'>
							<div className='kpi-icon' style={{ backgroundColor: card.bgColor }}>
								<span style={{ color: card.color, fontSize: 20 }}>{iconMap[card.icon]}</span>
							</div>
							<div
								className='kpi-trend'
								style={{
									color: card.trendUp ? '#059669' : '#DC2626',
									backgroundColor: card.trendUp ? '#ECFDF5' : '#FEF2F2',
								}}
							>
								{card.trendUp ? (
									<ArrowUpOutlined style={{ fontSize: 10 }} />
								) : (
									<span style={{ fontSize: 11 }}>~</span>
								)}
								<span>{card.trend}</span>
							</div>
						</div>
						<span className='kpi-value'>
							<CountUp value={card.value} duration={1500} />
						</span>
						<span className='kpi-label'>{card.label}</span>
					</div>
				</Col>
			))}
		</Row>
	);
};

export default KpiCards;
