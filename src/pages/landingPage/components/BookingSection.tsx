import { Form, Input, Select, Button } from 'antd';
import { CheckCircleOutlined, ArrowRightOutlined } from '@ant-design/icons';
import MyDatePicker from '@/components/MyDatePicker';
import { useModel } from 'umi';

const { TextArea } = Input;

export function BookingSection() {
  const [form] = Form.useForm();
  const { loading, bookingServiceOptions, perks, submitBooking } = useModel('landingPage.booking');

  const onFinish = async (values: any) => {
    const success = await submitBooking(values);
    if (success) form.resetFields();
  };

  return (
    <section
      className="flex gap-[72px] px-[120px] py-[100px]"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Left Column */}
      <div className="flex-1 flex flex-col gap-6">
        <span
          className="text-[13px] font-semibold tracking-[4px]"
          style={{ color: 'var(--accent-deep)' }}
        >
          BOOK NOW
        </span>
        <h2
          className="text-[40px] font-semibold leading-[1.2]"
          style={{ color: 'var(--text-primary)' }}
        >
          Reserve Your
          <br />
          Relaxation
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Take the first step towards ultimate relaxation. Book your appointment online and let us
          take care of the rest. Choose your preferred service, date, and therapist.
        </p>
        <div className="flex flex-col gap-4">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-3">
              <CheckCircleOutlined style={{ color: 'var(--accent-deep)', fontSize: 20 }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {perk}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column - Form */}
      <div
        className="flex-1 rounded-3xl p-10"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 8px 30px #f4c2c215',
        }}
      >
        <h3
          className="text-[22px] font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Book Appointment
        </h3>

        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <div className="flex gap-4">
            <Form.Item name="firstName" label="First Name" style={{ flex: 1 }}>
              <Input placeholder="Your first name" className="landing-input" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" style={{ flex: 1 }}>
              <Input placeholder="Your last name" className="landing-input" />
            </Form.Item>
          </div>

          <Form.Item name="email" label="Email Address">
            <Input placeholder="your@email.com" className="landing-input" />
          </Form.Item>

          <Form.Item name="phone" label="Phone Number">
            <Input placeholder="+84 xxx xxx xxxx" className="landing-input" />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item name="service" label="Service" style={{ flex: 1 }}>
              <Select placeholder="Select service" className="landing-select">
                {bookingServiceOptions.map((s) => (
                  <Select.Option key={s} value={s}>
                    {s}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="date" label="Preferred Date" style={{ flex: 1 }}>
              <MyDatePicker placeholder="Select date" format="DD/MM/YYYY" />
            </Form.Item>
          </div>

          <Form.Item name="notes" label="Special Requests (Optional)">
            <TextArea
              rows={3}
              placeholder="Any allergies, preferences, or special requests..."
              className="landing-input"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="landing-btn-primary"
            >
              Book Appointment <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default BookingSection;
