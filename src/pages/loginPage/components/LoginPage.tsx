import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Left Panel - Decorative */}
      <div className="relative hidden lg:block lg:w-1/2 min-h-screen overflow-hidden">
        <img
          src={require("@/assets/landingPage-img/hero-background.png")}
          alt="Luna Spa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #1A1A1ACC 0%, #1A1A1A99 50%, #c4707099 100%)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full gap-6 px-8 xl:px-20 text-center">
          <img
            src="/spalogo.png"
            alt="Luna Spa Logo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <h1
            className="font-bold leading-tight"
            style={{
              color: "var(--text-light)",
              fontSize: "clamp(28px, 3vw, 40px)",
            }}
          >
            Chào Mừng Trở Lại
          </h1>
          <p
            className="text-base"
            style={{ color: "#FFFFFFAA" }}
          >
            Nơi bình yên bắt đầu
          </p>
          <div
            className="w-[60px] h-[3px] rounded-sm"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <p
            className="text-sm max-w-[400px]"
            style={{ color: "#FFFFFF88" }}
          >
            Hệ thống quản lý Luna Spa dành cho nhân viên và quản lý nội bộ
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div
        className="w-full lg:w-1/2 min-h-screen flex items-center justify-center px-4 sm:px-6 py-10"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px] flex flex-col items-center gap-6"
        >
          {/* Logo */}
          <img
            src="/spalogo.png"
            alt="Luna Spa Logo"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
          />

          {/* Title */}
          <div className="flex flex-col items-center gap-2 w-full text-center">
            <h2
              className="font-bold"
              style={{
                color: "var(--text-primary)",
                fontSize: "clamp(24px, 3.5vw, 32px)",
              }}
            >
              Đăng Nhập
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Hệ thống quản lý nội bộ Luna Spa
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="w-full rounded-xl px-4 py-3 text-sm"
              style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-4 w-full">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[13px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Địa chỉ email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full h-[46px] rounded-xl px-3.5 text-sm outline-none transition-colors focus:ring-2"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-primary)",
                  // @ts-ignore
                  "--tw-ring-color": "var(--accent)",
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-[13px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-[46px] rounded-xl px-3.5 pr-11 text-sm outline-none transition-colors focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-light)",
                    color: "var(--text-primary)",
                    // @ts-ignore
                    "--tw-ring-color": "var(--accent)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-70 transition-opacity"
                >
                  {showPassword ? (
                    <EyeOff size={18} style={{ color: "var(--text-muted)" }} />
                  ) : (
                    <Eye size={18} style={{ color: "var(--text-muted)" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
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
                  style={{ color: "var(--text-secondary)" }}
                >
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <a
                href="#"
                className="text-[13px] font-medium hover:opacity-80 transition-opacity"
                style={{ color: "var(--accent-deep)" }}
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] rounded-xl flex items-center justify-center text-[15px] font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "var(--accent-deep)",
              color: "var(--text-light)",
            }}
          >
            {loading ? (
              <div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              />
            ) : (
              "Đăng Nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
