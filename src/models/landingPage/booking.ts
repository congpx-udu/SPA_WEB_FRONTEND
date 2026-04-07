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
  'Massage Therapy',
  'Facial Treatment',
  'Body Scrub',
  'Aromatherapy',
  'Hot Stone Therapy',
];

export const perks = [
  'Free consultation for first-time visitors',
  'Flexible rescheduling up to 24h before',
  '10% off for members on all treatments',
];

export default () => {
  const [loading, setLoading] = useState(false);

  const submitBooking = async (values: BookingFormData) => {
    setLoading(true);
    try {
      // TODO: gọi API đặt lịch
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

  return {
    loading,
    bookingServiceOptions,
    perks,
    submitBooking,
  };
};
