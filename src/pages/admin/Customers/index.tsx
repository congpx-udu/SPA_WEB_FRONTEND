// Quản lý khách hàng — ADMIN. Dùng BE /customers (BE cho OPERATOR/ADMIN tạo+sửa,
// chỉ ADMIN toggle active). FE giới hạn ở ADMIN cho mục đích menu.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Input, Select, Button, Tag, Dropdown, Menu, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import { Plus, Search, MoreHorizontal, Pencil, Power, BadgeCheck } from 'lucide-react';
import {
	CUSTOMER_SOURCE_OPTIONS,
	CUSTOMER_STATUS_OPTIONS,
} from '@/services/Customers/constant';
import CustomerFormModal from './components/CustomerFormModal';
import '@/pages/admin/Employees/styles.less';

export default function CustomersPage() {
	const { list, total, loading, query, fetch, create, update, toggleActive } = useModel('customers') as any;

	const [searchInput, setSearchInput] = useState('');
	const searchTimerRef = useRef<number | undefined>();

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
	const [editing, setEditing] = useState<CustomerMgmt.ICustomer | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (payload: any) => {
		setSubmitting(true);
		try {
			if (editing) {
				// Edit không cho đổi phone (BE accept nhưng gây conflict unique)
				const { phone, ...rest } = payload;
				await update(editing.id, rest);
			} else {
				await create(payload);
			}
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
				width: 240,
				ellipsis: true,
				render: (v: string, r: CustomerMgmt.ICustomer) => {
					const name = (v && v.trim()) || '';
					const initial = name ? name[0].toUpperCase() : (r.phone?.slice(-2, -1) ?? '?');
					return (
						<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							<div
								style={{
									width: 32,
									height: 32,
									flexShrink: 0,
									borderRadius: '50%',
									background: name
										? 'linear-gradient(135deg, #c47070, #e8a0a0)'
										: 'linear-gradient(135deg, #9CA3AF, #D1D5DB)',
									color: '#fff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontWeight: 600,
									fontSize: 13,
								}}
							>
								{initial}
							</div>
							{name ? (
								<span style={{ fontWeight: 500 }}>{name}</span>
							) : (
								<span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>(Chưa có tên)</span>
							)}
						</div>
					);
				},
			},
			{
				title: 'SĐT',
				dataIndex: 'phone',
				width: 150,
				align: 'center' as const,
				render: (v: string, r: CustomerMgmt.ICustomer) => (
					<span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
						{v}
						{r.phoneVerified && (
							<Tooltip title='SĐT đã xác minh'>
								<BadgeCheck size={14} color='#059669' />
							</Tooltip>
						)}
					</span>
				),
			},
			{ title: 'Email', dataIndex: 'email', width: 200, ellipsis: true, render: (v?: string) => v || '—' },
			{
				title: 'Nguồn',
				dataIndex: 'source',
				width: 130,
				align: 'center' as const,
				render: (v: CustomerMgmt.TSource) => {
					const opt = CUSTOMER_SOURCE_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
			},
			{
				title: 'Trạng thái',
				dataIndex: 'isActive',
				width: 140,
				align: 'center' as const,
				render: (v: boolean) => {
					const opt = CUSTOMER_STATUS_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label}</Tag>;
				},
			},
			{
				title: 'Ngày tạo',
				dataIndex: 'createdAt',
				width: 130,
				align: 'center' as const,
				render: (v?: string) => (v ? new Date(v).toLocaleDateString('vi-VN') : '—'),
			},
			{
				title: 'Thao tác',
				key: 'actions',
				width: 90,
				align: 'center' as const,
				render: (_: any, r: CustomerMgmt.ICustomer) => (
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
								<Menu.Item key='toggle' icon={<Power size={14} />}>
									<Popconfirm
										title={r.isActive ? 'Ngưng hoạt động khách hàng này?' : 'Kích hoạt lại?'}
										onConfirm={() => toggleActive(r)}
										okText='Đồng ý'
										cancelText='Huỷ'
									>
										{r.isActive ? 'Ngưng' : 'Kích hoạt'}
									</Popconfirm>
								</Menu.Item>
							</Menu>
						}
						trigger={['click']}
					>
						<Tooltip title='Tuỳ chọn'>
							<Button type='text' icon={<MoreHorizontal size={18} />} />
						</Tooltip>
					</Dropdown>
				),
			},
		],
		[toggleActive],
	);

	return (
		<div className='employees-page'>
			<div className='employees-page__header'>
				<div>
					<h1>Quản lý Khách hàng</h1>
					<p>Danh sách khách hàng và lịch sử nguồn</p>
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
					Thêm khách hàng
				</Button>
			</div>

			<div className='employees-page__toolbar'>
				<Input
					prefix={<Search size={14} color='#9B9B9B' />}
					placeholder='Tìm theo tên hoặc SĐT...'
					allowClear
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					style={{ width: 260, borderRadius: 10 }}
				/>
				<Select
					allowClear
					placeholder='Nguồn'
					style={{ width: 160 }}
					options={CUSTOMER_SOURCE_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(v) => fetch({ source: v, page: 1 })}
				/>
				<Select
					allowClear
					placeholder='Trạng thái'
					style={{ width: 160 }}
					options={CUSTOMER_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(v) => fetch({ isActive: v, page: 1 })}
				/>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={list}
				columns={columns as any}
				scroll={{ x: 1200 }}
				pagination={{
					current: query.page,
					pageSize: query.limit,
					total,
					showSizeChanger: true,
					onChange: (page, limit) => fetch({ page, limit }),
				}}
				className='employees-page__table'
			/>

			<CustomerFormModal
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
