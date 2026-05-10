import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './styles.less';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-4 sm:px-6 py-10"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[420px] flex flex-col items-center gap-6"
      >
        <img
          src="/spalogo.png"
          alt="Luna Spa Logo"
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
        />

        <div className="flex flex-col items-center gap-2 w-full text-center">
          <h2
            className="login-form__title font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Đăng Nhập
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Hệ thống quản lý nội bộ Luna Spa
          </p>
        </div>

        {error && (
          <div className="login-form__error w-full rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Địa chỉ email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="login-form__input w-full text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              className="text-[13px] font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-form__input login-form__input--with-icon w-full text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                className="login-form__eye"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-[18px] h-[18px] rounded accent-[var(--accent-deep)]"
              />
              <span
                className="text-[13px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Ghi nhớ đăng nhập
              </span>
            </label>
            <a
              href="#"
              className="text-[13px] font-medium hover:opacity-80 transition-opacity"
              style={{ color: 'var(--accent-deep)' }}
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="login-form__submit w-full flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Đăng Nhập'
          )}
        </button>
      </form>
    </div>
  );
}
