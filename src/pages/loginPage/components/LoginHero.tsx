import './styles.less';

export default function LoginHero() {
  return (
    <div className="relative hidden lg:block lg:w-1/2 min-h-screen overflow-hidden">
      <img
        src={require('@/assets/landingPage-img/hero-background.png')}
        alt="Luna Spa"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #1A1A1ACC 0%, #1A1A1A99 50%, #c4707099 100%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-8 xl:px-20 text-center">
        <img
          src="/spalogo.png"
          alt="Luna Spa Logo"
          className="w-20 h-20 rounded-full object-cover"
        />
        <h1
          className="login-hero__title font-bold leading-tight"
          style={{ color: 'var(--text-light)' }}
        >
          Chào Mừng Trở Lại
        </h1>
        <p className="text-base" style={{ color: '#FFFFFFAA' }}>
          Nơi bình yên bắt đầu
        </p>
        <div
          className="w-[60px] h-[3px] rounded-sm"
          style={{ backgroundColor: 'var(--accent)' }}
        />
        <p className="text-sm max-w-[400px]" style={{ color: '#FFFFFF88' }}>
          Hệ thống quản lý Luna Spa dành cho nhân viên và quản lý nội bộ
        </p>
      </div>
    </div>
  );
}
