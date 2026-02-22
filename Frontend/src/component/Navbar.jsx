import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Products", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "About", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 0 2rem;
          transition: background 0.4s ease, box-shadow 0.4s ease, padding 0.3s ease;
        }

        .nav-root.scrolled {
          background: rgba(10, 10, 12, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06);
        }

        .nav-root:not(.scrolled) {
          background: transparent;
        }

        /* Demo background */
        .demo-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0c 0%, #12121a 40%, #0d0d14 100%);
          position: relative;
          overflow: hidden;
        }

        .demo-bg::before {
          content: '';
          position: absolute;
          top: -40%;
          left: 10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .demo-bg::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .demo-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
          padding: 2rem;
        }

        .demo-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.1;
          max-width: 700px;
        }

        .demo-headline span {
          background: linear-gradient(135deg, #818cf8, #c084fc 50%, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .demo-sub {
          margin-top: 1.25rem;
          font-size: 1.1rem;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* ---- NAV INNER ---- */
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          text-decoration: none;
          cursor: pointer;
        }

        .logo-mark {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.3);
        }

        .logo-mark svg {
          width: 16px;
          height: 16px;
          fill: white;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          color: #fff;
          letter-spacing: -0.02em;
        }

        /* Desktop links */
        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          list-style: none;
        }

        .nav-links li a {
          position: relative;
          display: block;
          padding: 0.5rem 0.875rem;
          font-size: 0.9rem;
          font-weight: 400;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
          letter-spacing: 0.01em;
        }

        .nav-links li a::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: 16px;
          height: 1.5px;
          background: linear-gradient(90deg, #818cf8, #c084fc);
          border-radius: 99px;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-links li a:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .nav-links li a:hover::after,
        .nav-links li a.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-links li a.active {
          color: #fff;
        }

        /* Right actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn-ghost {
          padding: 0.5rem 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.6);
          background: transparent;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease;
          letter-spacing: 0.01em;
        }

        .btn-ghost:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .btn-primary {
          padding: 0.5rem 1.125rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          color: #fff;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          letter-spacing: 0.01em;
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.25);
        }

        .btn-primary:hover {
          opacity: 0.9;
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(129, 140, 248, 0.35);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        /* Hamburger */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.06);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          padding: 0;
        }

        .hamburger span {
          display: block;
          width: 16px;
          height: 1.5px;
          background: rgba(255,255,255,0.7);
          border-radius: 99px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }

        .hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* Mobile menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 72px;
          left: 1rem;
          right: 1rem;
          background: rgba(14, 14, 20, 0.97);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 0.75rem;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: slideDown 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: top;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .mobile-menu.open {
          display: block;
        }

        .mobile-menu ul {
          list-style: none;
          margin-bottom: 0.75rem;
        }

        .mobile-menu ul li a {
          display: block;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          font-weight: 400;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          border-radius: 10px;
          transition: color 0.15s, background 0.15s;
          letter-spacing: 0.01em;
        }

        .mobile-menu ul li a:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 0.5rem 0;
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0 0.25rem 0.25rem;
        }

        .mobile-actions .btn-ghost,
        .mobile-actions .btn-primary {
          width: 100%;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          border-radius: 10px;
        }

        @media (max-width: 768px) {
          .nav-links, .nav-actions { display: none; }
          .hamburger { display: flex; }
        }
      `}</style>

      <div className="demo-bg">
        {/* ===== NAVBAR ===== */}
        <nav className={`nav-root ${scrolled ? "scrolled" : ""}`}>
          <div className="nav-inner">

            {/* Logo */}
            <a className="nav-logo" href="#">
              <div className="logo-mark">
                <svg viewBox="0 0 16 16">
                  <path d="M8 1L1 5v6l7 4 7-4V5L8 1zm0 2.3L13 6l-5 2.9L3 6l5-2.7zM2.5 7.4l5 2.9v4.9l-5-2.9V7.4zm6 7.8V10.3l5-2.9v4.9l-5 2.9z"/>
                </svg>
              </div>
              <span className="logo-text">Axiom</span>
            </a>

            {/* Desktop Links */}
            <ul className="nav-links">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={activeLink === link.label ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveLink(link.label);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Desktop Actions */}
            <div className="nav-actions">
              <button className="btn-ghost">Log in</button>
              <button className="btn-primary">Get started →</button>
            </div>

            {/* Hamburger */}
            <button
              className={`hamburger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-divider" />
          <div className="mobile-actions">
            <button className="btn-ghost">Log in</button>
            <button className="btn-primary">Get started →</button>
          </div>
        </div>

        {/* Demo content */}
        <div className="demo-content">
          <h1 className="demo-headline">
            Build products<br /><span>people love</span>
          </h1>
          <p className="demo-sub">Scroll down to see the navbar transition · Resize to see mobile menu</p>
        </div>

        {/* Extra scroll space */}
        <div style={{ height: "150vh" }} />
      </div>
    </>
  );
}
