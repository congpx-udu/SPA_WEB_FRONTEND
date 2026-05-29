// Hằng số UI cho Booking.

export const BOOKING_STATUS_OPTIONS: { value: BookingMgmt.TStatus; label: string; color: string }[] = [
	{ value: 'PENDING_OTP', label: 'Chờ OTP', color: '#9CA3AF' },
	{ value: 'CONFIRMED', label: 'Đã xác nhận', color: '#2563EB' },
	{ value: 'CHECKED_IN', label: 'Đã check-in', color: '#059669' },
	{ value: 'IN_PROGRESS', label: 'Đang phục vụ', color: '#D97706' },
	{ value: 'COMPLETED', label: 'Hoàn thành', color: '#10B981' },
	{ value: 'CANCELLED', label: 'Đã huỷ', color: '#DC2626' },
	{ value: 'NO_SHOW', label: 'Không đến', color: '#6B7280' },
];

export const BOOKING_SOURCE_LABEL: Record<BookingMgmt.TSource, string> = {
	LANDING_PAGE: 'Khách tự đặt',
	OPERATOR: 'Lễ tân đặt',
};

export const DEFAULT_PAGE_SIZE = 10;
