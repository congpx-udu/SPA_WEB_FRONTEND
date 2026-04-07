import React from "react";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative w-full h-[700px] flex items-center justify-center"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Background Image */}
      <img
        src={require("@/assets/landingPage-img/hero-background.png")}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, #f4c2c2AA 50%, #c47070DD 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <h1
          className="text-[60px] font-extrabold tracking-tight leading-tight"
          style={{ color: "#FFFFFF" }}
        >
          Discover Your Inner Peace
        </h1>
        <p className="text-[17px] max-w-[700px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
          Escape the everyday and immerse yourself in a world of tranquility.
          Luna Spa offers personalized treatments designed to rejuvenate your
          body, calm your mind, and restore your spirit.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <button
            className="rounded-xl px-10 py-[18px] font-semibold shadow hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "var(--accent-deep)", color: "#FFFFFF" }}
          >
            Book Appointment
          </button>
          <button
            className="bg-transparent border-2 border-white rounded-xl px-10 py-[18px] font-semibold hover:bg-white hover:bg-opacity-10 transition-colors cursor-pointer"
            style={{ color: "#FFFFFF" }}
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
