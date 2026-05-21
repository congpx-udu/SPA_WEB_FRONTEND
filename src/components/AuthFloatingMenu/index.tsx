// Footer của sidebar (ProLayout menuFooterRender):
//  - Cài đặt
//  - Thu gọn / Mở rộng
//  - Đăng xuất (đỏ, có confirm)
import { Modal } from 'antd';
import { history, useModel } from 'umi';
import { LogOut, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export default function AuthFloatingMenu({ collapsed = false }: { collapsed?: boolean }) {
	const { currentUser, logout } = useModel('auth') as {
		currentUser: Auth.IStaff | null;
		logout: () => void;
	};
	const { setInitialState, initialState } = useModel('@@initialState') as any;

	if (!currentUser) return null;

	const handleLogout = () => {
		Modal.confirm({
			title: 'Đăng xuất',
			content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
			okText: 'Đăng xuất',
			cancelText: 'Huỷ',
			okButtonProps: { danger: true },
			onOk: async () => {
				logout();
				await setInitialState({ ...(initialState ?? {}), currentUser: undefined });
				history.replace('/login');
			},
		});
	};

	const toggleCollapse = () => {
		// ProLayout lưu trạng thái collapsed trong @@initialState.settings hoặc qua MenuFooter context.
		// Cách đơn giản: phát event nhấn vào sider trigger có sẵn.
		const trigger = document.querySelector('.ant-pro-sider-collapsed-button, .ant-layout-sider-trigger') as HTMLElement;
		if (trigger) trigger.click();
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 2,
				padding: '12px',
				borderTop: '1px solid #F0F0F0',
				fontFamily: 'Inter, sans-serif',
			}}
		>
			<FooterItem
				icon={<Settings size={18} />}
				label='Cài đặt'
				collapsed={collapsed}
				onClick={() => history.push('/change-password')}
			/>
			<FooterItem
				icon={collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
				label={collapsed ? 'Mở rộng' : 'Thu gọn'}
				collapsed={collapsed}
				muted
				onClick={toggleCollapse}
			/>
			<FooterItem
				icon={<LogOut size={18} />}
				label='Đăng xuất'
				collapsed={collapsed}
				danger
				onClick={handleLogout}
			/>
		</div>
	);
}

function FooterItem({
	icon,
	label,
	collapsed,
	danger,
	muted,
	onClick,
}: {
	icon: React.ReactNode;
	label: string;
	collapsed: boolean;
	danger?: boolean;
	muted?: boolean;
	onClick: () => void;
}) {
	const color = danger ? '#DC2626' : muted ? 'var(--text-muted)' : 'var(--sidebar-text)';
	const iconColor = danger ? '#DC2626' : 'var(--sidebar-icon)';
	return (
		<button
			onClick={onClick}
			title={label}
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: collapsed ? 'center' : 'flex-start',
				gap: 12,
				padding: collapsed ? '10px 0' : '10px 14px',
				background: 'transparent',
				border: 'none',
				borderRadius: 10,
				color,
				fontSize: 14,
				cursor: 'pointer',
				transition: 'background 0.15s',
				width: '100%',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.background = danger ? '#FEF2F2' : '#FFF6F6';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.background = 'transparent';
			}}
		>
			<span style={{ display: 'flex', color: iconColor }}>{icon}</span>
			{!collapsed && <span>{label}</span>}
		</button>
	);
}
