// Modal xem hồ sơ nhân viên — chi tiết readonly (ID, liên hệ, công việc, lương, trạng thái).
import { Modal, Tag, Descriptions, Avatar } from 'antd';
import moment from 'moment';
import { User } from 'lucide-react';

type Props = {
	open: boolean;
	staff: Employees.IEmployee | null;
	onCancel: () => void;
};

const ROLE_LABEL: Record<Auth.TStaffRole, { label: string; color: string }> = {
	ADMIN: { label: 'Quản trị', color: '#7C3AED' },
	OPERATOR: { label: 'Vận hành', color: '#2563EB' },
	STAFF: { label: 'Nhân viên', color: '#059669' },
};

const WORK_STATUS_LABEL: Record<Auth.TWorkStatus, { label: string; color: string }> = {
	ACTIVE: { label: 'Đang làm', color: '#059669' },
	ON_LEAVE: { label: 'Tạm nghỉ', color: '#D97706' },
	RESIGNED: { label: 'Đã nghỉ', color: '#9CA3AF' },
};

const ACCOUNT_STATUS_LABEL: Record<Auth.TAccountStatus, { label: string; color: string }> = {
	ACTIVE: { label: 'Hoạt động', color: '#059669' },
	LOCKED: { label: 'Đã khoá', color: '#DC2626' },
	DELETED: { label: 'Đã xoá', color: '#6B7280' },
};

const initials = (name: string) =>
	name
		.split(' ')
		.filter(Boolean)
		.slice(-2)
		.map((w) => w[0]?.toUpperCase())
		.join('') || '?';

export default function StaffProfileModal({ open, staff, onCancel }: Props) {
	const role = staff ? ROLE_LABEL[staff.role] : null;
	const work = staff ? WORK_STATUS_LABEL[staff.workStatus] : null;
	const acc = staff ? ACCOUNT_STATUS_LABEL[staff.accountStatus] : null;

	return (
		<Modal
			visible={open}
			onCancel={onCancel}
			footer={null}
			width={720}
			centered
			destroyOnClose
			title='Hồ sơ nhân viên'
		>
			{staff && (
				<>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 16,
							padding: 16,
							background: '#F9FAFB',
							borderRadius: 12,
							marginBottom: 16,
						}}
					>
						<Avatar
							size={72}
							style={{
								background: 'linear-gradient(135deg, #c47070 0%, #f9a8a8 100%)',
								fontSize: 26,
								fontWeight: 600,
							}}
							icon={!staff.fullName ? <User /> : undefined}
						>
							{initials(staff.fullName)}
						</Avatar>
						<div style={{ flex: 1 }}>
							<div style={{ fontSize: 20, fontWeight: 600, color: '#111827' }}>{staff.fullName}</div>
							<div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>
								{staff.email} · {staff.phone}
							</div>
							<div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
								{role && <Tag color={role.color}>{role.label}</Tag>}
								{work && <Tag color={work.color}>{work.label}</Tag>}
								{acc && <Tag color={acc.color}>{acc.label}</Tag>}
							</div>
						</div>
					</div>

					<Descriptions
						title='Thông tin công việc'
						column={2}
						size='small'
						bordered
						labelStyle={{ width: 160, color: '#6B7280' }}
					>
						<Descriptions.Item label='Mã NV'>
							<code>{staff.id}</code>
						</Descriptions.Item>
						<Descriptions.Item label='Vai trò'>
							{role && <Tag color={role.color}>{role.label}</Tag>}
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái làm việc'>
							{work && <Tag color={work.color}>{work.label}</Tag>}
						</Descriptions.Item>
						<Descriptions.Item label='Trạng thái tài khoản'>
							{acc && <Tag color={acc.color}>{acc.label}</Tag>}
						</Descriptions.Item>
						<Descriptions.Item label='Lương cơ bản'>
							<strong style={{ color: '#DC2626' }}>
								{staff.baseSalary?.toLocaleString('vi-VN')} ₫
							</strong>
						</Descriptions.Item>
						<Descriptions.Item label='Ngày bắt đầu'>
							{staff.startedAt ? moment(staff.startedAt).format('DD/MM/YYYY') : '—'}
						</Descriptions.Item>
						<Descriptions.Item label='Khoá lúc' span={2}>
							{staff.lockedAt ? moment(staff.lockedAt).format('DD/MM/YYYY HH:mm') : '—'}
						</Descriptions.Item>
						<Descriptions.Item label='Tạo lúc'>
							{staff.createdAt ? moment(staff.createdAt).format('DD/MM/YYYY HH:mm') : '—'}
						</Descriptions.Item>
						<Descriptions.Item label='Cập nhật lúc'>
							{staff.updatedAt ? moment(staff.updatedAt).format('DD/MM/YYYY HH:mm') : '—'}
						</Descriptions.Item>
					</Descriptions>
				</>
			)}
		</Modal>
	);
}
