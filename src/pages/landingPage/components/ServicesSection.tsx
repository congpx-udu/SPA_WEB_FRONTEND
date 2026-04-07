import React from 'react';
import { Card } from 'antd';
import {
  SkinOutlined,
  StarOutlined,
  ExperimentOutlined,
  CustomerServiceOutlined,
  FireOutlined,
} from '@ant-design/icons';

const services = [
  {
    icon: <SkinOutlined />,
    name: 'Massage Therapy',
    description:
      'Deep tissue and Swedish techniques to release tension, ease muscle pain, and promote total body relaxation.',
    price: 89,
  },
  {
    icon: <StarOutlined />,
    name: 'Facial Treatment',
    description:
      'Revitalize your skin with our customized facials using premium organic products for a radiant, youthful glow.',
    price: 75,
  },
  {
    icon: <ExperimentOutlined />,
    name: 'Body Scrub',
    description:
      'Exfoliate and refresh your skin with our luxurious body scrubs, leaving you silky smooth and deeply nourished.',
    price: 65,
  },
  {
    icon: <CustomerServiceOutlined />,
    name: 'Aromatherapy',
    description:
      'Harmonize mind and body with essential oil blends carefully selected to calm, energize, or restore balance.',
    price: 70,
  },
  {
    icon: <FireOutlined />,
    name: 'Hot Stone Therapy',
    description:
      'Warm basalt stones placed on key points melt away stress and improve circulation for deep, soothing relief.',
    price: 95,
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="flex flex-col items-center gap-10"
      style={{ padding: '80px', backgroundColor: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[13px] tracking-widest font-semibold" style={{ color: 'var(--accent-deep)' }}>
          — Our Services
        </span>
        <h2 className="text-[40px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Our Services
        </h2>
        <p className="text-[16px] max-w-[600px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Indulge in our carefully crafted treatments, each designed to restore your natural balance and leave you
          feeling renewed.
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-col items-center gap-6 w-full max-w-[1100px]">
        {/* First row: 3 cards */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>
        {/* Second row: 2 cards centered */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-[730px]">
          {services.slice(3).map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  name: string;
  description: string;
  price: number;
}> = ({ icon, name, description, price }) => {
  return (
    <Card
      bordered
      className="landing-card"
      style={{
        borderColor: 'var(--border-light)',
        borderRadius: 12,
      }}
      bodyStyle={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Icon */}
      <div
        className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--accent-light)' }}
      >
        <span style={{ fontSize: 24, color: 'var(--accent-deep)' }}>{icon}</span>
      </div>

      {/* Name */}
      <h3 className="text-[22px] font-semibold" style={{ color: 'var(--text-primary)', margin: 0 }}>
        {name}
      </h3>

      {/* Description */}
      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
        {description}
      </p>

      {/* Price */}
      <span className="text-[14px] font-semibold" style={{ color: 'var(--accent)' }}>
        From ${price}
      </span>

      {/* Learn More */}
      <a
        href="#"
        className="text-[13px] font-medium transition-colors"
        style={{ color: 'var(--accent-dark)' }}
      >
        Learn More →
      </a>
    </Card>
  );
};

export default ServicesSection;
