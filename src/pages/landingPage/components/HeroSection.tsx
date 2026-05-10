import React from "react";

export const HeroSection: React.FC = () => {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section
      className="relative w-full h-[700px] flex items-center justify-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <img
        src={require("@/assets/landingPage-img/hero-background.png")}
        alt="Ảnh nền"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #f4c2c2AA 50%, #c47070DD 100%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <h1
          className="text-[60px] font-extrabold tracking-tight leading-tight"
          style={{ color: "#FFFFFF" }}
        >
          Khám Phá Sự Bình Yên
        </h1>
        <p className="text-[17px] max-w-[700px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
          Thoát khỏi nhịp sống hối hả và đắm mình trong thế giới thanh tịnh.
          Luna Spa mang đến các liệu trình cá nhân hóa giúp tái tạo cơ thể,
          thư giãn tâm trí và phục hồi tinh thần của bạn.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => scrollToId("booking")}
            className="rounded-xl px-10 py-[18px] font-semibold shadow hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "var(--accent-deep)", color: "#FFFFFF" }}
          >
            Đặt lịch hẹn
          </button>
          <button
            onClick={() => scrollToId("services")}
            className="bg-transparent border-2 border-white rounded-xl px-10 py-[18px] font-semibold hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer"
            style={{ color: "#FFFFFF" }}
          >
            Xem dịch vụ
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
