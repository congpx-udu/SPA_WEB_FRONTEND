import React, { useEffect, useState } from "react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
    { label: "Feedback", href: "/#feedback" },
    { label: "Reviews", href: "/feedback" },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const isLandingPage = window.location.pathname === "/";

    if (href.startsWith("#")) {
      e.preventDefault();
      if (isLandingPage) {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Navigate to landing page with hash
        window.location.href = "/" + href;
      }
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      const hash = href.replace("/", "");
      if (isLandingPage) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <nav
      className="flex items-center justify-between border-b"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "16px 80px",
        fontFamily: "Inter, sans-serif",
        backgroundColor: scrolled ? "rgba(255,255,255,0.95)" : "var(--bg-card)",
        borderColor: "var(--border-light)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none",
        transition: "all 0.3s ease",
      }}
    >
      {/* Left: Logo + Brand */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.href = "/"}>
        <img
          src={require("@/assets/landingPage-img/spalogo.png")}
          alt="Luna Spa Logo"
          className="w-[48px] h-[48px] rounded-full object-cover"
        />
        <span className="text-[20px] font-semibold" style={{ color: "var(--text-primary)" }}>
          Luna Spa
        </span>
      </div>

      {/* Center: Nav Links */}
      <div className="flex items-center gap-8">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className="text-[14px] font-medium tracking-wide cursor-pointer transition-colors"
            style={{
              color: "var(--text-secondary)",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right: Book Now Button */}
      <button
        className="rounded-xl px-8 py-3 font-semibold shadow transition-colors cursor-pointer"
        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
      >
        Book Now
      </button>
    </nav>
  );
};

export default Navbar;
