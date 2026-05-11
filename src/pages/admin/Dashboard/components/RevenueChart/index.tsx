import React from 'react';
import ColumnChart from '@/components/Chart/ColumnChart';
import { REVENUE_DATA, formatPrice } from '@/services/admin/Dashboard/constant';
import './style.less';

const RevenueChart: React.FC = () => {
	return (
		<div className='chart-card'>
			<div className='chart-header'>
				<h3>Doanh thu theo ngày</h3>
				<span className='chart-badge'>Tuần này</span>
			</div>
			<ColumnChart
				title=' '
				xAxis={REVENUE_DATA.map((d) => d.day)}
				yAxis={[REVENUE_DATA.map((d) => d.revenue)]}
				yLabel={['Doanh thu']}
				colors={['#c47070']}
				height={240}
				formatY={(val) => `${(val / 1000000).toFixed(1)}M`}
				otherOptions={{
					chart: { toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
					plotOptions: { bar: { borderRadius: 6, columnWidth: '60%' } },
					responsive: [
						{
							breakpoint: 1600,
							options: {
								plotOptions: { bar: { columnWidth: '65%' } },
							},
						},
						{
							breakpoint: 768,
							options: {
								plotOptions: { bar: { columnWidth: '75%' } },
							},
						},
					],
					fill: {
						type: 'gradient',
						gradient: {
							shade: 'light',
							type: 'vertical',
							shadeIntensity: 0.3,
							opacityFrom: 1,
							opacityTo: 0.85,
						},
					},
					xaxis: {
						categories: REVENUE_DATA.map((d) => d.day),
						axisBorder: { show: false },
						axisTicks: { show: false },
						labels: { style: { colors: '#9B9B9B', fontSize: '12px' } },
					},
					grid: { borderColor: '#F0F0F0', strokeDashArray: 4 },
					tooltip: { y: { formatter: (val: number) => formatPrice(val) } },
				}}
			/>
		</div>
	);
};

export default RevenueChart;
