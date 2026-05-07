import { Card, Rate } from 'antd';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating: number;
}

function TestimonialCard({ quote, name, role, rating }: TestimonialCardProps) {
  return (
    <Card
      bordered
      className="landing-card flex-1"
      style={{ borderColor: 'var(--border-light)', borderRadius: 16 }}
      bodyStyle={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      <Rate disabled defaultValue={rating} style={{ color: 'var(--accent-dark)', fontSize: 18 }} />
      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)', margin: 0 }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="h-px w-full" style={{ backgroundColor: 'var(--border-light)' }} />
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{name}</span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{role}</span>
        </div>
      </div>
    </Card>
  );
}

const testimonials: TestimonialCardProps[] = [
  {
    quote: 'Trải nghiệm spa tuyệt vời nhất mà tôi từng có. Massage tinh dầu thật sự tuyệt diệu. Tôi cảm thấy hoàn toàn được tái tạo sau đó.',
    name: 'Nguyễn Minh Anh',
    role: 'Khách hàng thân thiết',
    rating: 5,
  },
  {
    quote: 'Tôi đã đến đây 2 năm và chất lượng không bao giờ giảm. Đá nóng trị liệu là dịch vụ yêu thích của tôi — thư giãn tuyệt đối mỗi lần.',
    name: 'Trần Thị Hương',
    role: 'Thành viên VIP',
    rating: 5,
  },
  {
    quote: 'Ngay từ khi bước vào, tôi đã cảm thấy được chào đón. Liệu trình chăm sóc da mặt đã thay đổi hoàn toàn làn da của tôi. Nhân viên vô cùng chuyên nghiệp và tận tâm.',
    name: 'Lê Văn Đức',
    role: 'Khách lần đầu',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section
      className="flex flex-col items-center gap-14 px-[120px] py-[100px]"
      style={{ backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span className="text-[13px] font-semibold tracking-[4px]" style={{ color: 'var(--accent-deep)' }}>
          CẢM NHẬN KHÁCH HÀNG
        </span>
        <h2 className="text-[40px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Khách Hàng Nói Gì
        </h2>
        <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          Những trải nghiệm thực tế từ khách hàng thân yêu của chúng tôi
        </p>
      </div>
      <div className="flex gap-6 w-full">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
