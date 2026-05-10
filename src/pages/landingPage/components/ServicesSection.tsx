import React, { useState } from 'react';
import { Card } from 'antd';
import {
  SkinOutlined,
  StarOutlined,
  ExperimentOutlined,
  CustomerServiceOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { MOCK_SERVICES, formatPrice } from '@/services/DichVu/constant';
import { ServiceDetailModal } from './ServiceDetailModal';

const iconMap: Record<string, React.ReactNode> = {
  'svc-001': <SkinOutlined />,
  'svc-002': <StarOutlined />,
  'svc-003': <ExperimentOutlined />,
  'svc-004': <CustomerServiceOutlined />,
  'svc-005': <FireOutlined />,
};

export const ServicesSection: React.FC = () => {
  const [selectedService, setSelectedService] = useState<DichVu.IRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenDetail = (service: DichVu.IRecord) => {
    setSelectedService(service);
    setModalVisible(true);
  };

  return (
    <section
      id="services"
      className="flex flex-col items-center gap-10"
      style={{ padding: '80px', backgroundColor: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-[13px] tracking-widest font-semibold" style={{ color: 'var(--accent-deep)' }}>
          — Dịch vụ của chúng tôi
        </span>
        <h2 className="text-[40px] font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Dịch Vụ
        </h2>
        <p className="text-[16px] max-w-[600px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Trải nghiệm các liệu trình được thiết kế tỉ mỉ, giúp khôi phục sự cân bằng
          tự nhiên và mang lại cảm giác tươi mới cho bạn.
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 w-full max-w-[1100px]">
        <div className="grid grid-cols-3 gap-6 w-full">
          {MOCK_SERVICES.slice(0, 3).map((service) => (
            <ServiceCard
              key={service._id}
              icon={iconMap[service._id]}
              service={service}
              onViewDetail={() => handleOpenDetail(service)}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6 w-full max-w-[730px]">
          {MOCK_SERVICES.slice(3).map((service) => (
            <ServiceCard
              key={service._id}
              icon={iconMap[service._id]}
              service={service}
              onViewDetail={() => handleOpenDetail(service)}
            />
          ))}
        </div>
      </div>

      <ServiceDetailModal
        visible={modalVisible}
        service={selectedService}
        onClose={() => setModalVisible(false)}
      />
    </section>
  );
};

const ServiceCard: React.FC<{
  icon: React.ReactNode;
  service: DichVu.IRecord;
  onViewDetail: () => void;
}> = ({ icon, service, onViewDetail }) => {
  return (
    <Card
      bordered
      className="landing-card"
      style={{ borderColor: 'var(--border-light)', borderRadius: 12 }}
      bodyStyle={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      <div
        className="w-[56px] h-[56px] rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: 'var(--accent-light)' }}
      >
        <span style={{ fontSize: 24, color: 'var(--accent-deep)' }}>{icon}</span>
      </div>
      <h3 className="text-[22px] font-semibold" style={{ color: 'var(--text-primary)', margin: 0 }}>
        {service.name}
      </h3>
      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
        {service.description.length > 100
          ? service.description.substring(0, 100) + '...'
          : service.description}
      </p>
      <span className="text-[14px] font-semibold" style={{ color: 'var(--accent)' }}>
        Từ {formatPrice(service.unitPrice)}
      </span>
      <a
        className="text-[13px] font-medium transition-colors cursor-pointer"
        style={{ color: 'var(--accent-dark)' }}
        onClick={(e) => {
          e.preventDefault();
          onViewDetail();
        }}
      >
        Tìm hiểu thêm →
      </a>
    </Card>
  );
};

export default ServicesSection;
