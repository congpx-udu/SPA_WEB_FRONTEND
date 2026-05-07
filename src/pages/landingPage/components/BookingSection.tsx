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
      id="booking"
      className="flex gap-[72px] px-[120px] py-[100px]"
      style={{ backgroundColor: 'var(--bg-secondary)', fontFamily: 'Inter, sans-serif' }}
    >
      <div className="flex-1 flex flex-col gap-6">
        <span className="text-[13px] font-semibold tracking-[4px]" style={{ color: 'var(--accent-deep)' }}>
          ĐẶT LỊCH
        </span>
        <h2 className="text-[40px] font-semibold leading-[1.2]" style={{ color: 'var(--text-primary)' }}>
          Đặt Lịch
          <br />
          Thư Giãn
        </h2>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Hãy bắt đầu hành trình thư giãn tuyệt đối. Đặt lịch hẹn trực tuyến và để chúng tôi
          lo liệu phần còn lại. Chọn dịch vụ, ngày giờ và chuyên viên trị liệu mà bạn yêu thích.
        </p>
        <div className="flex flex-col gap-4">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-3">
              <CheckCircleOutlined style={{ color: 'var(--accent-deep)', fontSize: 20 }} />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="flex-1 rounded-3xl p-10"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-light)',
          boxShadow: '0 8px 30px #f4c2c215',
        }}
      >
        <h3 className="text-[22px] font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
          Đặt Lịch Hẹn
        </h3>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
          <div className="flex gap-4">
            <Form.Item name="firstName" label="Họ" style={{ flex: 1 }}>
              <Input placeholder="Nhập họ" className="landing-input" />
            </Form.Item>
            <Form.Item name="lastName" label="Tên" style={{ flex: 1 }}>
              <Input placeholder="Nhập tên" className="landing-input" />
            </Form.Item>
          </div>
          <Form.Item name="email" label="Địa chỉ email">
            <Input placeholder="email@example.com" className="landing-input" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="+84 xxx xxx xxxx" className="landing-input" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="service" label="Dịch vụ" style={{ flex: 1 }}>
              <Select placeholder="Chọn dịch vụ" className="landing-select">
                {bookingServiceOptions.map((s) => (
                  <Select.Option key={s} value={s}>{s}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="date" label="Ngày mong muốn" style={{ flex: 1 }}>
              <MyDatePicker placeholder="Chọn ngày" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Yêu cầu đặc biệt (Tùy chọn)">
            <TextArea rows={3} placeholder="Dị ứng, sở thích hoặc yêu cầu đặc biệt..." className="landing-input" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" block loading={loading} className="landing-btn-primary">
              Đặt lịch hẹn <ArrowRightOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default BookingSection;
