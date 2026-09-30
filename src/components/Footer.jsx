import { ArrowUp, BriefcaseBusiness, Code2, Mail, MapPin } from "lucide-react";

const services = ["Web Development", "Full-Stack Apps", "Technical Training", "Consultation"];
const explore = [
  ["About", "about"],
  ["Experience", "experience"],
  ["Projects", "projects"],
  ["Skills", "skills"],
];


export default function Footer({ profile, settings }) {
  const email = profile?.email && profile.email !== "hello@example.com"
    ? profile.email
    : "gururajkulkarni115@gmail.com";
  const builtWith = settings?.footerText === "Built with React + Firebase + Tailwind CSS."
    ? "Built with React + Tailwind CSS + Firebase."
    : settings?.footerText || "Built with React + Tailwind CSS + Firebase.";

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-main-grid">
          <div className="footer-brand-block">
            <a className="footer-brand" href="#top">
              <span className="footer-brand-mark">GK</span>
              <span>{profile?.name || "Gururaj Kulkarni"}</span>
            </a>
            <p>Thoughtful digital products, from the first conversation to launch and beyond.</p>
          </div>

          <nav className="footer-link-column" aria-label="Services">
            <h3>SERVICES</h3>
            {services.map((service) => <a key={service} href="#about">{service}</a>)}
          </nav>

          <nav className="footer-link-column" aria-label="Explore">
            <h3>EXPLORE</h3>
            {explore.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>

          <div className="footer-link-column footer-contact-column">
            <h3>CONTACT</h3>
            <a href={`mailto:${email}`}><Mail size={15} /> Email</a>
            <span><MapPin size={15} /> {profile?.location || "India"}</span>
            <span><BriefcaseBusiness size={15} /> Available for selected projects &amp; training</span>
          </div>
        </div>

        <div className="footer-stack-row">
       
          <span className="footer-availability"><i /> Available for selected projects &amp; training</span>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <span>© {new Date().getFullYear()} {profile?.name || "Gururaj Kulkarni"}</span>
            {/* <span className="footer-built-line">{builtWith}</span> */}
          </div>
          <a className="footer-back-top" href="#top" aria-label="Back to top">
            <span>Back to top</span><ArrowUp size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
