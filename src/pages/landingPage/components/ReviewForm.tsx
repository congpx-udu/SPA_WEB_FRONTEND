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
        <span className="text-[13px] font-semibold tracking-[4px]" style={{ color: 'var(--accent-deep)' }}>
          GỬI ĐÁNH GIÁ
        </span>
        <h2 className="text-[40px] font-semibold" style={{ color: 'var(--text-primary)' }}>
          Chia Sẻ Trải Nghiệm
        </h2>
        <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          Phản hồi của bạn giúp chúng tôi cải thiện và giúp mọi người biết đến Luna Spa
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
              label="Họ và tên *"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Nhập họ và tên" className="landing-input" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Số điện thoại *"
              rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="+84 xxx xxx xxxx" className="landing-input" />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label="Địa chỉ email *"
            rules={[{ required: true, type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="email@example.com" className="landing-input" />
          </Form.Item>

          <Form.Item
            name="service"
            label="Dịch vụ đã sử dụng *"
            rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}
          >
            <Select placeholder="Chọn dịch vụ" className="landing-select">
              {serviceOptions.map((s) => (
                <Select.Option key={s} value={s}>{s}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="rating"
            label="Đánh giá của bạn *"
            rules={[{ required: true, message: 'Vui lòng đánh giá' }]}
          >
            <Rate style={{ color: 'var(--accent-deep)', fontSize: 28 }} />
          </Form.Item>

          <Form.Item
            name="feedback"
            label="Nhận xét của bạn *"
            rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
          >
            <TextArea rows={4} placeholder="Hãy chia sẻ trải nghiệm của bạn..." className="landing-input" />
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
              Gửi đánh giá
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default ReviewForm;
