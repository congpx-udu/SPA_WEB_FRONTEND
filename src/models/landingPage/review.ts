import { useState } from 'react';
import { message } from 'antd';

export interface ReviewFormData {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  rating: number;
  feedback: string;
}

export const serviceOptions = [
  'Massage Therapy',
  'Facial Treatment',
  'Body Scrub',
  'Aromatherapy',
  'Hot Stone Therapy',
  'Nail Care',
];

export default () => {
  const [loading, setLoading] = useState(false);

  const submitReview = async (values: ReviewFormData) => {
    setLoading(true);
    try {
      // TODO: gọi API submit review
      console.log('Review submitted:', values);
      message.success('Cảm ơn bạn đã gửi đánh giá!');
      return true;
    } catch (error) {
      message.error('Gửi đánh giá thất bại, vui lòng thử lại');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    serviceOptions,
    submitReview,
  };
};
