import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
export default function Navbar({ profile, settings }) {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false),
    [activeSection, setActiveSection] = useState("home");
  const items = [
    ["Home", "home"],
    ["About", "about"],
    ["Skills", "skills"],
    ["Projects", "projects"],
    ["Experience", "experience"],
    ["Contact", "contact"],
  ];
  const displayName = profile?.name || "Gururaj Kulkarni";
  const brandMark = displayName.trim().split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "GK";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      if (window.scrollY < 80) setActiveSection("home");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const sections = items
      .map(([, id]) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`site-nav fixed top-0 inset-x-0 z-50 ${scrolled ? "site-nav-scrolled" : ""}`}>
      <nav aria-label="Main navigation" className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <a href="/#" className="font-black text-[1.65rem] max-[380px]:text-xl flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">
            {brandMark}
          </span>
          {displayName}<span className="text-indigo-400">.</span>
        </a>
        <div className="hidden md:flex items-center gap-1 font-semibold">
          {items.map(([label, id]) => (
            <a
              key={id}
              href={id === "home" ? "/#top" : "/#" + id}
              aria-current={activeSection === id ? "page" : undefined}
              className={`navbar-link ${activeSection === id ? "navbar-link-active" : ""}`}
            >
              {settings?.navigation?.[id] || label}
            </a>
          ))}
          <Link
            to="/admin"
            className="nav-admin ml-3 px-5 py-3 rounded-xl bg-white text-slate-950 font-bold shadow-lg hover:-translate-y-0.5"
          >
            Admin
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-100 hover:bg-white/10"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="md:hidden px-6 pb-6 pt-3 space-y-1 bg-[#080c1c]/95 backdrop-blur-2xl border-t border-white/10 shadow-xl">
          {items.map(([label, id]) => (
            <a
              onClick={() => setOpen(false)}
              key={id}
              href={id === "home" ? "/#top" : "/#" + id}
              aria-current={activeSection === id ? "page" : undefined}
              className={`navbar-link block ${activeSection === id ? "navbar-link-active" : ""}`}
            >
              {settings?.navigation?.[id] || label}
            </a>
          ))}
        
        </div>
      )}
    </header>
  );
}
