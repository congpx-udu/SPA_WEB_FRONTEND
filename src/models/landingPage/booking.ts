import { useState } from 'react';
import { message } from 'antd';

export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  notes?: string;
}

export const bookingServiceOptions = [
  'Massage Trị Liệu',
  'Chăm Sóc Da Mặt',
  'Tẩy Tế Bào Chết',
  'Liệu Pháp Tinh Dầu',
  'Đá Nóng Trị Liệu',
];

export const perks = [
  'Miễn phí tư vấn cho khách lần đầu',
  'Đổi lịch linh hoạt trước 24 giờ',
  'Giảm 10% cho thành viên trên mọi liệu trình',
];

export default () => {
  const [loading, setLoading] = useState(false);

  const submitBooking = async (values: BookingFormData) => {
    setLoading(true);
    try {
      console.log('Booking submitted:', values);
      message.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận.');
      return true;
    } catch (error) {
      message.error('Đặt lịch thất bại, vui lòng thử lại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, bookingServiceOptions, perks, submitBooking };
};
