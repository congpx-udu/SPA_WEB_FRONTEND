import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="flex flex-row items-center gap-20"
      style={{ padding: "100px 80px", fontFamily: "Inter, sans-serif", backgroundColor: "var(--bg-secondary)" }}
    >
      <img
        src={require("@/assets/landingPage-img/about-image.png")}
        alt="Về Luna Spa"
        className="w-[560px] h-[440px] rounded-3xl shadow object-cover flex-shrink-0"
      />
      <div className="flex flex-col gap-5">
        <span className="text-[13px] tracking-widest font-semibold" style={{ color: "var(--accent-deep)" }}>
          — Về chúng tôi
        </span>
        <h2 className="text-[44px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Về Luna Spa
        </h2>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Được thành lập với niềm đam mê chăm sóc sức khỏe toàn diện, Luna Spa
          là nơi lý tưởng dành cho những ai tìm kiếm sự thư giãn và tái tạo năng lượng.
          Đội ngũ chuyên gia trị liệu của chúng tôi kết hợp phương pháp chữa lành
          truyền thống với kỹ thuật hiện đại để mang đến trải nghiệm nuôi dưỡng cả thể chất lẫn tâm hồn.
        </p>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Mọi chi tiết tại Luna Spa đều được chăm chút tỉ mỉ — từ các sản phẩm
          hữu cơ được tuyển chọn kỹ lưỡng đến không gian phòng trị liệu yên tĩnh,
          lung linh ánh nến. Chúng tôi tin rằng vẻ đẹp đích thực bắt đầu từ sự
          bình yên nội tại, và sứ mệnh của chúng tôi là giúp bạn tìm thấy điều đó.
        </p>
        <div className="w-[48px] h-[4px] rounded-sm mt-2" style={{ backgroundColor: "var(--accent-deep)" }} />
      </div>
    </section>
  );
};

export default AboutSection;
