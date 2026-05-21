// Quản lý nhân viên — ADMIN only. Khớp design Pencil:
//  - Header: title + search + filter role/trạng thái + button "Thêm nhân viên" (pink gradient)
//  - Table: tên, email, SĐT, role chip, trạng thái chip, ngày bắt đầu, actions
//  - Modal Tạo/Sửa + actions Lock/Unlock/Reset/Delete (Popconfirm)
import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Input, Select, Button, Tag, Dropdown, Menu, Popconfirm, Space } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { Plus, Search, MoreHorizontal, Lock, Unlock, KeyRound, Trash2, Pencil } from 'lucide-react';
import {
	ACCOUNT_STATUS_OPTIONS,
	ROLE_OPTIONS,
	WORK_STATUS_OPTIONS,
} from '@/services/Employees/constant';
import EmployeeFormModal from './components/EmployeeFormModal';
import './styles.less';

export default function EmployeesPage() {
	const { list, total, loading, query, fetch, create, update, lock, unlock, reset, remove } = useModel(
		'employees',
	) as any;

	const [searchInput, setSearchInput] = useState('');
	const searchTimerRef = useRef<number | undefined>();

	// Debounce 300ms: gõ là gọi luôn, không cần Enter.
	useEffect(() => {
		if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
		searchTimerRef.current = window.setTimeout(() => {
			fetch({ search: searchInput.trim() || undefined, page: 1 });
		}, 300);
		return () => {
			if (searchTimerRef.current) window.clearTimeout(searchTimerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchInput]);
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<Employees.IEmployee | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (payload: any) => {
		setSubmitting(true);
		try {
			if (editing) await update(editing.id, payload);
			else await create(payload);
			setModalOpen(false);
			setEditing(null);
		} finally {
			setSubmitting(false);
		}
	};

	const columns = useMemo(
		() => [
			{
				title: 'Họ tên',
				dataIndex: 'fullName',
				render: (v: string, r: Employees.IEmployee) => (
					<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
						<div
							style={{
								width: 32,
								height: 32,
								borderRadius: '50%',
								background: 'linear-gradient(135deg, #c47070, #e8a0a0)',
								color: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontWeight: 600,
								fontSize: 13,
							}}
						>
							{v?.[0]?.toUpperCase()}
						</div>
						<span style={{ fontWeight: 500 }}>{v}</span>
					</div>
				),
			},
			{ title: 'Email', dataIndex: 'email' },
			{ title: 'SĐT', dataIndex: 'phone' },
			{
				title: 'Vai trò',
				dataIndex: 'role',
				render: (v: Auth.TStaffRole) => {
					const opt = ROLE_OPTIONS.find((r) => r.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
				filters: ROLE_OPTIONS.map((r) => ({ text: r.label, value: r.value })),
				onFilter: (val: any, r: any) => r.role === val,
			},
			{
				title: 'Trạng thái TK',
				dataIndex: 'accountStatus',
				render: (v: Auth.TAccountStatus) => {
					const opt = ACCOUNT_STATUS_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
			},
			{
				title: 'Công việc',
				dataIndex: 'workStatus',
				render: (v: Auth.TWorkStatus) => {
					const opt = WORK_STATUS_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
			},
			{
				title: 'Ngày bắt đầu',
				dataIndex: 'startedAt',
				render: (v: string) => (v ? moment(v).format('DD/MM/YYYY') : '—'),
			},
			{
				title: '',
				key: 'actions',
				width: 60,
				render: (_: any, r: Employees.IEmployee) => (
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item
									key='edit'
									icon={<Pencil size={14} />}
									onClick={() => {
										setEditing(r);
										setModalOpen(true);
									}}
								>
									Cập nhật
								</Menu.Item>
								<Menu.Item key='reset' icon={<KeyRound size={14} />}>
									<Popconfirm
										title='Reset mật khẩu về mặc định?'
										onConfirm={() => reset(r.id)}
										okText='Reset'
										cancelText='Huỷ'
									>
										Reset mật khẩu
									</Popconfirm>
								</Menu.Item>
								{r.accountStatus === 'LOCKED' ? (
									<Menu.Item key='unlock' icon={<Unlock size={14} />} onClick={() => unlock(r.id)}>
										Mở khoá
									</Menu.Item>
								) : (
									<Menu.Item key='lock' icon={<Lock size={14} />}>
										<Popconfirm
											title='Khoá tài khoản này?'
											onConfirm={() => lock(r.id)}
											okText='Khoá'
											cancelText='Huỷ'
											okButtonProps={{ danger: true }}
										>
											Khoá tài khoản
										</Popconfirm>
									</Menu.Item>
								)}
								<Menu.Divider />
								<Menu.Item key='delete' danger icon={<Trash2 size={14} />}>
									<Popconfirm
										title='Xoá nhân viên? (chỉ áp dụng khi đã khoá > 30 ngày)'
										onConfirm={() => remove(r.id)}
										okText='Xoá'
										cancelText='Huỷ'
										okButtonProps={{ danger: true }}
									>
										Xoá
									</Popconfirm>
								</Menu.Item>
							</Menu>
						}
						trigger={['click']}
					>
						<Button type='text' icon={<MoreHorizontal size={18} />} />
					</Dropdown>
				),
			},
		],
		[reset, lock, unlock, remove],
	);

	return (
		<div className='employees-page'>
			<div className='employees-page__header'>
				<div>
					<h1>Quản lý Nhân viên</h1>
					<p>Danh sách nhân viên hệ thống</p>
				</div>
				<Button
					type='primary'
					icon={<Plus size={16} style={{ marginRight: 4, verticalAlign: 'middle' }} />}
					className='employees-page__add-btn'
					onClick={() => {
						setEditing(null);
						setModalOpen(true);
					}}
				>
					Thêm nhân viên
				</Button>
			</div>

			<div className='employees-page__toolbar'>
				<Input
					prefix={<Search size={14} color='#9B9B9B' />}
					placeholder='Tìm theo tên, email...'
					allowClear
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					style={{ width: 260, borderRadius: 10 }}
				/>
				<Select
					allowClear
					placeholder='Tất cả vai trò'
					style={{ width: 160 }}
					options={ROLE_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
					onChange={(v) => fetch({ role: v, page: 1 })}
				/>
				<Select
					allowClear
					placeholder='Trạng thái'
					style={{ width: 160 }}
					options={WORK_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(v) => fetch({ workStatus: v, page: 1 })}
				/>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={list}
				columns={columns as any}
				pagination={{
					current: query.page,
					pageSize: query.limit,
					total,
					showSizeChanger: true,
					onChange: (page, limit) => fetch({ page, limit }),
				}}
				className='employees-page__table'
			/>

			<EmployeeFormModal
				open={modalOpen}
				editing={editing}
				loading={submitting}
				onCancel={() => {
					setModalOpen(false);
					setEditing(null);
				}}
				onSubmit={onSubmit}
			/>
		</div>
	);
}
