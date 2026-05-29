// Lịch sử kho — ADMIN. List ledger entries với filter material/loại/ngày.
import { useEffect, useMemo, useState } from 'react';
import { Table, Select, DatePicker, Tag, Tooltip } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import PageHeader from '@/components/PageHeader';
import {
	TRANSACTION_TYPE_OPTIONS,
	REFERENCE_TYPE_LABEL,
} from '@/services/StockLedger/constant';
import '@/pages/admin/Employees/styles.less';

const { RangePicker } = DatePicker;

export default function StockLedgerPage() {
	const { list, total, loading, query, fetch } = useModel('stockLedger') as any;
	const { list: materials, fetch: fetchMaterials } = useModel('materials') as any;

	useEffect(() => {
		fetch();
		fetchMaterials({ limit: 100 });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

	const columns = useMemo(
		() => [
			{
				title: 'Thời gian',
				dataIndex: 'createdAt',
				width: 150,
				render: (v: string) => moment(v).format('DD/MM/YYYY HH:mm'),
			},
			{
				title: 'Mã VL',
				dataIndex: 'materialCode',
				width: 110,
				render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code>,
			},
			{
				title: 'Tên vật liệu',
				dataIndex: 'materialName',
				width: 200,
				ellipsis: true,
				render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span>,
			},
			{
				title: 'Loại',
				dataIndex: 'transactionType',
				width: 130,
				align: 'center' as const,
				render: (v: StockLedger.TTransactionType) => {
					const opt = TRANSACTION_TYPE_OPTIONS.find((t) => t.value === v);
					return <Tag color={opt?.color}>{opt?.label ?? v}</Tag>;
				},
			},
			{
				title: 'SL thay đổi',
				dataIndex: 'quantityChange',
				width: 110,
				align: 'right' as const,
				render: (v: number, r: StockLedger.ILedgerEntry) => (
					<span style={{ color: v >= 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
						{v >= 0 ? '+' : ''}
						{v} {r.materialUnit}
					</span>
				),
			},
			{
				title: 'Tồn trước',
				dataIndex: 'stockBefore',
				width: 90,
				align: 'right' as const,
			},
			{
				title: 'Tồn sau',
				dataIndex: 'stockAfter',
				width: 90,
				align: 'right' as const,
				render: (v: number) => <strong>{v}</strong>,
			},
			{
				title: 'NCC',
				dataIndex: 'supplierName',
				width: 150,
				ellipsis: true,
				render: (v: string | null) => v || '—',
			},
			{
				title: 'Đơn giá',
				dataIndex: 'unitPrice',
				width: 110,
				align: 'right' as const,
				render: (v: number | null) => (v != null ? `${v.toLocaleString('vi-VN')}đ` : '—'),
			},
			{
				title: 'Tổng tiền',
				dataIndex: 'totalCost',
				width: 120,
				align: 'right' as const,
				render: (v: number | null) =>
					v != null ? <strong>{v.toLocaleString('vi-VN')}đ</strong> : '—',
			},
			{
				title: 'Nhân viên',
				dataIndex: 'performedByName',
				width: 140,
				ellipsis: true,
			},
			{
				title: 'Lý do / Tham chiếu',
				dataIndex: 'reason',
				width: 200,
				ellipsis: true,
				render: (v: string, r: StockLedger.ILedgerEntry) => (
					<Tooltip title={v}>
						<span>
							{v || '—'}
							{r.referenceType && (
								<Tag style={{ marginLeft: 6 }} color='#E5E7EB'>
									{REFERENCE_TYPE_LABEL[r.referenceType]}
								</Tag>
							)}
						</span>
					</Tooltip>
				),
			},
		],
		[],
	);

	return (
		<div className='employees-page'>
			<PageHeader title='Lịch sử kho' subtitle='Audit trail mọi giao dịch nhập / xuất vật liệu' />

			<div className='employees-page__toolbar'>
				<Select
					allowClear
					showSearch
					optionFilterProp='label'
					placeholder='Vật liệu'
					style={{ width: 240 }}
					options={materials.map((m: any) => ({ value: m.id, label: `${m.code} — ${m.name}` }))}
					onChange={(v) => fetch({ materialId: v, page: 1 })}
				/>
				<Select
					allowClear
					placeholder='Loại giao dịch'
					style={{ width: 180 }}
					options={TRANSACTION_TYPE_OPTIONS.map((t) => ({ value: t.value, label: t.label }))}
					onChange={(v) => fetch({ transactionType: v, page: 1 })}
				/>
				<RangePicker
					value={dateRange as any}
					format='DD/MM/YYYY'
					onChange={(range) => {
						setDateRange(range as any);
						fetch({
							fromDate: range?.[0]?.startOf('day').toISOString(),
							toDate: range?.[1]?.endOf('day').toISOString(),
							page: 1,
						});
					}}
				/>
			</div>

			<Table
				rowKey='id'
				loading={loading}
				dataSource={list}
				columns={columns as any}
				scroll={{ x: 1700 }}
				pagination={{
					current: query.page,
					pageSize: query.limit,
					total,
					showSizeChanger: true,
					onChange: (page, limit) => fetch({ page, limit }),
				}}
				className='employees-page__table'
			/>
		</div>
	);
}
