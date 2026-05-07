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
    name: 'Massage Trị Liệu',
    description: 'Kỹ thuật massage sâu và kiểu Thụy Điển giúp giải tỏa căng thẳng, giảm đau cơ và thúc đẩy thư giãn toàn thân.',
    price: '500.000đ',
  },
  {
    icon: <StarOutlined />,
    name: 'Chăm Sóc Da Mặt',
    description: 'Tái tạo làn da với liệu trình chăm sóc da mặt tùy chỉnh, sử dụng sản phẩm hữu cơ cao cấp cho làn da rạng rỡ, tươi trẻ.',
    price: '400.000đ',
  },
  {
    icon: <ExperimentOutlined />,
    name: 'Tẩy Tế Bào Chết',
    description: 'Loại bỏ tế bào chết và làm mới làn da với liệu trình tẩy tế bào chết cao cấp, giúp da mềm mịn và được nuôi dưỡng sâu.',
    price: '350.000đ',
  },
  {
    icon: <CustomerServiceOutlined />,
    name: 'Liệu Pháp Tinh Dầu',
    description: 'Hài hòa tâm trí và cơ thể với các hỗn hợp tinh dầu được chọn lọc kỹ lưỡng giúp thư giãn, tăng năng lượng hoặc cân bằng cơ thể.',
    price: '380.000đ',
  },
  {
    icon: <FireOutlined />,
    name: 'Đá Nóng Trị Liệu',
    description: 'Đá bazan ấm đặt tại các huyệt đạo giúp xua tan căng thẳng, cải thiện tuần hoàn máu và mang lại cảm giác thư giãn sâu.',
    price: '550.000đ',
  },
];

export const ServicesSection: React.FC = () => {
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
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.name} {...service} />
          ))}
        </div>
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
  price: string;
}> = ({ icon, name, description, price }) => {
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
        {name}
      </h3>
      <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
        {description}
      </p>
      <span className="text-[14px] font-semibold" style={{ color: 'var(--accent)' }}>
        Từ {price}
      </span>
      <a href="#" className="text-[13px] font-medium transition-colors" style={{ color: 'var(--accent-dark)' }}>
        Tìm hiểu thêm →
      </a>
    </Card>
  );
};

export default ServicesSection;
