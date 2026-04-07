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
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {name}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {role}
          </span>
        </div>
      </div>
    </Card>
  );
}

const testimonials: TestimonialCardProps[] = [
  {
    quote:
      'The best spa experience I\'ve ever had. The aromatherapy massage was absolutely divine. I felt completely renewed afterwards.',
    name: 'Nguyễn Minh Anh',
    role: 'Regular Client',
    rating: 5,
  },
  {
    quote:
      'I\'ve been coming here for 2 years and the quality never drops. The hot stone therapy is my favorite — pure relaxation every single time.',
    name: 'Trần Thị Hương',
    role: 'VIP Member',
    rating: 5,
  },
  {
    quote:
      'From the moment I walked in, I felt welcomed. The facial treatment transformed my skin. The staff is incredibly professional and caring.',
    name: 'Lê Văn Đức',
    role: 'First-time Visitor',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section
      className="flex flex-col items-center gap-14 px-[120px] py-[100px]"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="text-[13px] font-semibold tracking-[4px]"
          style={{ color: 'var(--accent-deep)' }}
        >
          TESTIMONIALS
        </span>
        <h2 className="text-[40px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          What Our Clients Say
        </h2>
        <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          Real experiences from our valued guests
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
