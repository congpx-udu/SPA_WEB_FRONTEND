import React from 'react';
import DonutChart from '@/components/Chart/DonutChart';
import { APPOINTMENT_STATUS } from '@/services/admin/Dashboard/constant';
import './style.less';

const AppointmentStatusChart: React.FC = () => {
	return (
		<div className='chart-card'>
			<div className='chart-header'>
				<h3>Lịch hẹn theo trạng thái</h3>
			</div>
			<DonutChart
				xAxis={APPOINTMENT_STATUS.map((s) => s.label)}
				yAxis={[APPOINTMENT_STATUS.map((s) => s.value)]}
				yLabel={APPOINTMENT_STATUS.map((s) => s.label)}
				colors={APPOINTMENT_STATUS.map((s) => s.color)}
				height={270}
				showTotal
				formatY={(val) => `${val}`}
				otherOptions={{
					chart: { fontFamily: 'Inter, sans-serif' },
					legend: { position: 'bottom', fontSize: '13px', markers: { width: 10, height: 10 } },
					dataLabels: { enabled: false },
					stroke: { width: 2 },
				}}
			/>
		</div>
	);
};

export default AppointmentStatusChart;
