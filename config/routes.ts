export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	{
		path: '/',
		name: 'LandingPage',
		component: './landingPage',
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/login',
		name: 'Login',
		component: './loginPage',
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/change-password',
		name: 'ChangePassword',
		component: './auth/ChangePassword',
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/feedback',
		name: 'Feedback',
		component: './landingPage/components/FeedbackPage',
		layout: false,
		hideInMenu: true,
	},

	///////////////////////////////////
	// SPA MANAGEMENT MENU — phân quyền theo StaffRole (ADMIN / OPERATOR / STAFF)
	{
		path: '/admin/dashboard',
		name: 'Dashboard',
		component: './admin/Dashboard',
		icon: 'DashboardOutlined',
		access: 'canAdminOrOperator',
	},
	{
		path: '/lich-hen',
		name: 'Lịch hẹn',
		component: './admin/Dashboard',
		icon: 'CalendarOutlined',
		access: 'canAny',
	},
	{
		path: '/dich-vu',
		name: 'Dịch vụ',
		component: './admin/Services',
		icon: 'StarOutlined',
		access: 'canAdminOrOperator',
	},
	{
		path: '/khach-hang',
		name: 'Khách hàng',
		component: './admin/Dashboard',
		icon: 'TeamOutlined',
		access: 'canAdminOrOperator',
	},
	// Cụm "Nhân viên" — ADMIN thấy đủ 3 sub, STAFF chỉ thấy Lễ tân + Thu ngân.
	{
		path: '/nhan-vien',
		name: 'Nhân viên',
		icon: 'TeamOutlined',
		access: 'canAdminOrStaff',
		routes: [
			{
				name: 'Quản lý nhân viên',
				path: 'quan-ly',
				component: './admin/Employees',
				icon: 'UserOutlined',
				access: 'canAdmin',
			},
			{
				name: 'Lễ tân',
				path: 'le-tan',
				component: './staff/LeTan',
				icon: 'UserSwitchOutlined',
				access: 'canAdminOrStaff',
			},
			{
				name: 'Thu ngân',
				path: 'thu-ngan',
				component: './staff/ThuNgan',
				icon: 'DollarOutlined',
				access: 'canAdminOrStaff',
			},
		],
	},
	{
		path: '/danh-gia',
		name: 'Đánh giá',
		component: './admin/Dashboard',
		icon: 'StarOutlined',
		access: 'canAdminOrOperator',
	},
	{
		path: '/bao-cao',
		name: 'Báo cáo',
		component: './admin/Dashboard',
		icon: 'BarChartOutlined',
		access: 'canAdmin',
	},

	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
