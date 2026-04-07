import React from "react";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="flex flex-row items-center gap-20"
      style={{ padding: "100px 80px", fontFamily: "Inter, sans-serif", backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Left: Image */}
      <img
        src={require("@/assets/landingPage-img/about-image.png")}
        alt="About Luna Spa"
        className="w-[560px] h-[440px] rounded-3xl shadow object-cover flex-shrink-0"
      />

      {/* Right: Content */}
      <div className="flex flex-col gap-5">
        <span className="text-[13px] tracking-widest font-semibold" style={{ color: "var(--accent-deep)" }}>
          — About Us
        </span>
        <h2 className="text-[44px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          About Luna Spa
        </h2>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Founded with a passion for holistic wellness, Luna Spa has been a
          sanctuary for those seeking relaxation and rejuvenation. Our expert
          therapists combine ancient healing traditions with modern techniques to
          deliver an experience that nurtures both body and soul.
        </p>
        <p className="text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Every detail at Luna Spa is thoughtfully curated — from our
          hand-selected organic products to our serene, candlelit treatment
          rooms. We believe true beauty begins with inner peace, and our mission
          is to help you find yours.
        </p>
        <div className="w-[48px] h-[4px] rounded-sm mt-2" style={{ backgroundColor: "var(--accent-deep)" }} />
      </div>
    </section>
  );
};

export default AboutSection;
