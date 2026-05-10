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
		path: '/feedback',
		name: 'Feedback',
		component: './landingPage/components/FeedbackPage',
		layout: false,
		hideInMenu: true,
	},

	///////////////////////////////////
	// SPA MANAGEMENT MENU
	{
		path: '/admin/dashboard',
		name: 'Dashboard',
		component: './admin/Dashboard',
		icon: 'DashboardOutlined',
	},
	{
		path: '/lich-hen',
		name: 'Lịch hẹn',
		component: './admin/Dashboard',
		icon: 'CalendarOutlined',
	},
	{
		path: '/dich-vu',
		name: 'Dịch vụ',
		component: './admin/Dashboard',
		icon: 'StarOutlined',
	},
	{
		path: '/khach-hang',
		name: 'Khách hàng',
		component: './admin/Dashboard',
		icon: 'TeamOutlined',
	},
	{
		path: '/nhan-vien',
		name: 'Nhân viên',
		component: './admin/Dashboard',
		icon: 'UserSwitchOutlined',
	},
	{
		path: '/danh-gia',
		name: 'Đánh giá',
		component: './admin/Dashboard',
		icon: 'StarOutlined',
	},
	{
		path: '/bao-cao',
		name: 'Báo cáo',
		component: './admin/Dashboard',
		icon: 'BarChartOutlined',
	},
	// {
	// 	path: '/gioi-thieu',
	// 	name: 'About',
	// 	component: './TienIch/GioiThieu',
	// 	hideInMenu: true,
	// },
	// {
	// 	path: '/random-user',
	// 	name: 'RandomUser',
	// 	component: './RandomUser',
	// 	hideInMenu: true,
	// },

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	// {
	// 	path: '/notification',
	// 	routes: [
	// 		{
	// 			path: './subscribe',
	// 			exact: true,
	// 			component: './ThongBao/Subscribe',
	// 		},
	// 		{
	// 			path: './check',
	// 			exact: true,
	// 			component: './ThongBao/Check',
	// 		},
	// 		{
	// 			path: './',
	// 			exact: true,
	// 			component: './ThongBao/NotifOneSignal',
	// 		},
	// 	],
	// 	layout: false,
	// 	hideInMenu: true,
	// },
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
