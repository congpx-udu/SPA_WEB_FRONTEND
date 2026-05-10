import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Table, Tag, Input, Badge } from 'antd';
import {
  RiseOutlined,
  CalendarOutlined,
  UserAddOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  SearchOutlined,
  BellOutlined,
} from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import {
  KPI_CARDS,
  MOCK_APPOINTMENTS,
  POPULAR_SERVICES,
  REVENUE_DATA,
  APPOINTMENT_STATUS,
  STATUS_CONFIG,
  formatPrice,
} from '@/services/admin/Dashboard/constant';
import './components/style.less';

const CountUp: React.FC<{ value: string; duration?: number }> = ({ value, duration = 1500 }) => {
  const numeric = parseInt(value.replace(/[^\d-]/g, ''), 10);
  const isNumber = !Number.isNaN(numeric);
  const [display, setDisplay] = useState(isNumber ? 0 : value);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isNumber) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(numeric * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(numeric);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [numeric, duration, isNumber]);

  if (!isNumber) return <>{value}</>;
  const hasCurrency = /đ$/i.test(value);
  const formatted = (display as number).toLocaleString('vi-VN');
  return <>{hasCurrency ? `${formatted}đ` : formatted}</>;
};

const iconMap: Record<string, React.ReactNode> = {
  RiseOutlined: <RiseOutlined />,
  CalendarOutlined: <CalendarOutlined />,
  UserAddOutlined: <UserAddOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
};

const Dashboard: React.FC = () => {
  const revenueChartOptions: ApexCharts.ApexOptions = {
    chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
    plotOptions: {
      bar: { borderRadius: 8, columnWidth: '50%' },
    },
    colors: ['#c47070'],
    fill: {
      type: 'gradient',
      gradient: { shade: 'light', type: 'vertical', shadeIntensity: 0.3, opacityFrom: 1, opacityTo: 0.85 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: REVENUE_DATA.map((d) => d.day),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#9B9B9B', fontSize: '12px' } },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => (val / 1000000).toFixed(0) + 'M',
        style: { colors: '#9B9B9B', fontSize: '12px' },
      },
    },
    grid: { borderColor: '#F0F0F0', strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (val: number) => formatPrice(val) },
    },
  };

  const donutOptions: ApexCharts.ApexOptions = {
    chart: { type: 'donut', fontFamily: 'Inter, sans-serif' },
    labels: APPOINTMENT_STATUS.map((s) => s.label),
    colors: APPOINTMENT_STATUS.map((s) => s.color),
    legend: { position: 'bottom', fontSize: '13px', markers: { width: 10, height: 10 } },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: { show: true, label: 'Tổng', fontSize: '14px', fontWeight: '600' },
          },
        },
      },
    },
    stroke: { width: 2 },
  };

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name: string, record: Dashboard.IAppointment) => (
        <div className="customer-cell">
          <div className="avatar-circle" style={{ background: record.avatarColor }}>
            {name.charAt(name.lastIndexOf(' ') + 1)}
          </div>
          <span className="customer-name">{name}</span>
        </div>
      ),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        const config = STATUS_CONFIG[status];
        return (
          <Tag
            className="status-tag"
            style={{ color: config.color, backgroundColor: config.bgColor, border: 'none' }}
          >
            {config.label}
          </Tag>
        );
      },
    },
  ];

  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="spa-dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h2>Dashboard</h2>
          <span>Chúc mừng trở lại đây là tổng quan hôm nay.</span>
        </div>
        <div className="header-actions">
          <Input
            prefix={<SearchOutlined style={{ color: '#9B9B9B' }} />}
            placeholder="Tìm kiếm..."
            className="header-search"
          />
          <div className="header-pill">
            <CalendarOutlined style={{ color: 'var(--accent-deep)' }} />
            <span>{today}</span>
          </div>
          <div className="header-pill icon-pill">
            <Badge dot color="#EF4444" offset={[-2, 2]}>
              <BellOutlined style={{ fontSize: 16, color: '#4A4A4A' }} />
            </Badge>
          </div>
          <div className="header-admin">
            <div className="admin-avatar">A</div>
            <div className="admin-info">
              <span className="admin-name">Admin</span>
              <span className="admin-role">Quản lý</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <Row gutter={[20, 20]} className="kpi-row">
        {KPI_CARDS.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.key}>
            <div className="kpi-card">
              <div className="kpi-top">
                <div className="kpi-icon" style={{ backgroundColor: card.bgColor }}>
                  <span style={{ color: card.color, fontSize: 20 }}>{iconMap[card.icon]}</span>
                </div>
                <div
                  className="kpi-trend"
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
              <span className="kpi-value">
                <CountUp value={card.value} duration={1500} />
              </span>
              <span className="kpi-label">{card.label}</span>
            </div>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row gutter={[20, 20]} className="charts-row">
        <Col xs={24} lg={14}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Doanh thu theo ngày</h3>
              <span className="chart-badge">Tuần này</span>
            </div>
            <ReactApexChart
              options={revenueChartOptions}
              series={[{ name: 'Doanh thu', data: REVENUE_DATA.map((d) => d.revenue) }]}
              type="bar"
              height={240}
            />
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div className="chart-card">
            <div className="chart-header">
              <h3>Lịch hẹn theo trạng thái</h3>
            </div>
            <ReactApexChart
              options={donutOptions}
              series={APPOINTMENT_STATUS.map((s) => s.value)}
              type="donut"
              height={270}
            />
          </div>
        </Col>
      </Row>

      {/* Bottom Row */}
      <Row gutter={[20, 20]} className="bottom-row">
        <Col xs={24} lg={15}>
          <div className="table-card">
            <div className="card-header">
              <div className="header-left">
                <h3>Lịch hẹn gần đây</h3>
                <span className="count-badge">{MOCK_APPOINTMENTS.length}</span>
              </div>
              <a className="view-all not-underline">
                Xem tất cả <ArrowRightOutlined />
              </a>
            </div>
            <Table
              dataSource={MOCK_APPOINTMENTS}
              columns={columns}
              rowKey="_id"
              pagination={false}
              size="middle"
              className="appointments-table"
            />
          </div>
        </Col>
        <Col xs={24} lg={9}>
          <div className="services-card">
            <div className="card-header">
              <h3>Dịch vụ phổ biến</h3>
              <span className="chart-badge">Tháng này</span>
            </div>
            <div className="services-list">
              {POPULAR_SERVICES.map((svc, idx) => (
                <div
                  key={svc._id}
                  className="service-item"
                  style={{
                    backgroundColor: idx === 0 ? '#FFF5F5' : undefined,
                    border: idx === 0 ? 'none' : '1px solid #F0F0F0',
                  }}
                >
                  <div className="svc-icon" style={{ backgroundColor: svc.bgColor }}>
                    <span>{svc.icon}</span>
                  </div>
                  <div className="svc-info">
                    <span className="svc-name">{svc.name}</span>
                    <span className="svc-meta">
                      {svc.bookings} lượt · {formatPrice(svc.price)}
                    </span>
                  </div>
                  <span className="svc-rank" style={{ color: svc.color }}>
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
