import { Form, Input, Select, Rate, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useModel } from 'umi';

const { TextArea } = Input;

export function ReviewForm() {
  const [form] = Form.useForm();
  const { loading, serviceOptions, submitReview } = useModel('landingPage.review');

  const onFinish = async (values: any) => {
    const success = await submitReview(values);
    if (success) form.resetFields();
  };

  return (
    <section
      id="feedback"
      className="flex flex-col items-center gap-12 px-[120px] py-20"
      style={{ backgroundColor: 'var(--bg-primary)', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex flex-col items-center gap-3">
        <span
          className="text-[13px] font-semibold tracking-[4px]"
          style={{ color: 'var(--accent-deep)' }}
        >
          LEAVE A REVIEW
        </span>
        <h2 className="text-[40px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Share Your Experience
        </h2>
        <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          Your feedback helps us improve and helps others discover Luna Spa
        </p>
      </div>

      <div
        className="w-[680px] rounded-3xl p-10"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 4px 24px #f4c2c212',
        }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <div className="flex gap-4">
            <Form.Item
              name="fullName"
              label="Full Name *"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Enter your full name" className="landing-input" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number *"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="+84 xxx xxx xxxx" className="landing-input" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Email Address *"
            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="your.email@example.com" className="landing-input" />
          </Form.Item>

          <Form.Item
            name="service"
            label="Service Used *"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
          >
            <Select placeholder="Select a service" className="landing-select">
              {serviceOptions.map((s) => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="rating"
            label="Your Rating *"
            rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
          >
            <Rate style={{ color: 'var(--accent-deep)', fontSize: 28 }} />
          </Form.Item>

          <Form.Item
            name="feedback"
            label="Your Feedback *"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <TextArea rows={4} placeholder="Tell us about your experience..." className="landing-input" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              icon={<SendOutlined />}
              className="landing-btn-primary"
            >
              Submit Review
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default ReviewForm;
