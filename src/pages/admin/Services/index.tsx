// Quản lý dịch vụ — ADMIN. Khớp design Pencil.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Input, Select, Button, Tag, Dropdown, Menu, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { Plus, Search, MoreHorizontal, Pencil, Power } from 'lucide-react';
import {
	SERVICE_CATEGORY_OPTIONS,
	SERVICE_STATUS_OPTIONS,
} from '@/services/Services/constant';
import ServiceFormModal from './components/ServiceFormModal';
import '@/pages/admin/Employees/styles.less';

export default function ServicesPage() {
	const { list, total, loading, query, fetch, create, update, toggleActive } = useModel('services') as any;

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
	const [editing, setEditing] = useState<SvcMgmt.IService | null>(null);
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
			{ title: 'Mã DV', dataIndex: 'code', width: 130, render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
			{
				title: 'Tên dịch vụ',
				dataIndex: 'name',
				render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
			},
			{
				title: 'Danh mục',
				dataIndex: 'category',
				render: (v: SvcMgmt.TCategory) => {
					const opt = SERVICE_CATEGORY_OPTIONS.find((c) => c.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
			},
			{
				title: 'Giá (VND)',
				dataIndex: 'unitPrice',
				align: 'right' as const,
				render: (v: number) => v?.toLocaleString('vi-VN'),
			},
			{
				title: 'Thời lượng',
				dataIndex: 'durationMinutes',
				render: (v: number) => `${v} phút`,
			},
			{
				title: 'Trạng thái',
				dataIndex: 'isActive',
				render: (v: boolean) => {
					const opt = SERVICE_STATUS_OPTIONS.find((s) => s.value === v);
					return <Tag color={opt?.color}>{opt?.label}</Tag>;
				},
			},
			{
				title: '',
				key: 'actions',
				width: 60,
				render: (_: any, r: SvcMgmt.IService) => (
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
										title={r.isActive ? 'Tạm ngưng dịch vụ này?' : 'Kích hoạt lại dịch vụ này?'}
										onConfirm={() => toggleActive(r)}
										okText='Đồng ý'
										cancelText='Huỷ'
									>
										{r.isActive ? 'Tạm ngưng' : 'Kích hoạt'}
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
		[toggleActive],
	);

	return (
		<div className='employees-page'>
			<div className='employees-page__header'>
				<div>
					<h1>Quản lý Dịch vụ</h1>
					<p>Danh sách dịch vụ spa hệ thống</p>
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
					Thêm dịch vụ
				</Button>
			</div>

			<div className='employees-page__toolbar'>
				<Input
					prefix={<Search size={14} color='#9B9B9B' />}
					placeholder='Tìm theo tên dịch vụ...'
					allowClear
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
					style={{ width: 260, borderRadius: 10 }}
				/>
				<Select
					allowClear
					placeholder='Tất cả danh mục'
					style={{ width: 180 }}
					options={SERVICE_CATEGORY_OPTIONS.map((c) => ({ value: c.value, label: c.label }))}
					onChange={(v) => fetch({ category: v, page: 1 })}
				/>
				<Select
					allowClear
					placeholder='Trạng thái'
					style={{ width: 160 }}
					options={SERVICE_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
					onChange={(v) => fetch({ isActive: v, page: 1 })}
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

			<ServiceFormModal
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
