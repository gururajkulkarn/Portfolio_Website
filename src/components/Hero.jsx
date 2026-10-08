import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowDown, ArrowRight, Braces, Boxes, Download, Mail, MapPin, MessageCircle, Phone, Workflow } from "lucide-react";
export default function Hero({ profile, settings }) {
  const prefersReducedMotion = useReducedMotion();
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, { stiffness: 130, damping: 18, mass: .6 });
  const tiltY = useSpring(rawTiltY, { stiffness: 130, damping: 18, mass: .6 });
  const roleTitle = profile.headline?.split("•")[0].trim() || "Full-Stack Developer";
  const whatsappNumber = (profile.phone || "").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent("Hi Gururaj, I'd like to discuss a project.");
  const whatsappHref = whatsappNumber.length >= 8
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : `https://wa.me/?text=${whatsappMessage}`;

  const handleVisualPointerMove = (event) => {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    rawTiltX.set((.5 - y) * 9);
    rawTiltY.set((x - .5) * 10);
    event.currentTarget.style.setProperty("--hero-pointer-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--hero-pointer-y", `${y * 100}%`);
  };

  const resetVisualPointer = (event) => {
    rawTiltX.set(0);
    rawTiltY.set(0);
    event.currentTarget.style.setProperty("--hero-pointer-x", "50%");
    event.currentTarget.style.setProperty("--hero-pointer-y", "50%");
  };

  return (
    <section id="top" className="home-hero relative min-h-screen overflow-hidden bg-grid pt-6 lg:pt-6 flex items-start">
      <div className="absolute -top-40 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full orb" />
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-cyan-500/15 rounded-full orb" />
      <div className="hero-codefield" aria-hidden="true">
        <span className="code-fragment code-fragment-one">const future = build();</span>
        <span className="code-fragment code-fragment-two">&lt;AI /&gt; · WEB · API</span>
        <span className="code-fragment code-fragment-three">0101 1010 0110</span>
        <span className="code-fragment code-fragment-four">npm run deploy</span>
        <svg className="circuit-lines" viewBox="0 0 1200 700" fill="none">
          <path d="M650 80h130v90h130m-220 20h90v100h170m-360 80h160v-70h110m-20 230h120V410h170M820 80v-40h190v110h100" />
          <path d="M700 530h70v-95h110m60-260v80h90v80h100m-10 100h-90v-70h-120" />
          <circle cx="910" cy="170" r="4" />
          <circle cx="950" cy="350" r="4" />
          <circle cx="880" cy="435" r="4" />
          <circle cx="1000" cy="150" r="4" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-2 lg:py-0 grid lg:grid-cols-[1.15fr_.85fr] gap-10 lg:gap-14 items-center relative z-10">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex px-4 py-2 rounded-full glass text-cyan-300 text-sm">
            {settings.heroEyebrow}
          </span>
          <h1 className="mt-5 text-[clamp(1.7rem,8.6vw,2.65rem)] sm:text-6xl lg:text-6xl xl:text-[3.5rem] font-black leading-[1.08] tracking-tight">
            <span className="block xl:whitespace-nowrap">
              <span>
                {Array.from(roleTitle).map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className={`hero-title-letter ${letter === " " ? "inline-block w-[.28em]" : "inline-block"}`}
                    initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.01,
                      delay: prefersReducedMotion ? 0 : index * 0.075,
                    }}
                  >
                    {letter === " " ? "\u00a0" : letter}
                  </motion.span>
                ))}
              </span>
            </span>
            <span className="text-gradient block mt-1 text-[clamp(1.6rem,7.7vw,2.5rem)] sm:text-5xl lg:text-5xl xl:text-[3.25rem]">
              {profile.headline?.split("•").slice(1).join("•").trim()}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-400 leading-8">
            {profile.bio}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label={whatsappNumber.length >= 8 ? "Chat with Gururaj on WhatsApp" : "Open WhatsApp and choose a chat; add a profile number for a direct chat"}
              className="hero-whatsapp-cta px-7 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 font-bold hover:scale-105 transition flex items-center gap-3"
            >
              <span className="hero-whatsapp-icon" aria-hidden="true">
                <MessageCircle size={22} strokeWidth={2.25} />
                <Phone className="hero-whatsapp-phone" size={10} strokeWidth={3} />
              </span>
              {settings.primaryCta}
              <ArrowRight size={18} />
            </a>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-7 py-4 rounded-xl glass font-semibold flex items-center gap-2"
              >
                <Download size={18} /> {settings.secondaryCta || "View resume"}
              </a>
            )}
          </div>
          <motion.div
            className="hero-contact-links"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: prefersReducedMotion ? 0 : 0.3 }}
          >
            <a className="hero-contact-link hero-contact-phone" href="tel:+917353563239">
              <span className="hero-contact-icon" aria-hidden="true"><Phone size={19} /></span>
              <span className="hero-contact-copy"><small>Call me</small><strong>7353563239</strong></span>
              <ArrowRight className="hero-contact-arrow" size={16} aria-hidden="true" />
            </a>
            <a className="hero-contact-link hero-contact-email" href="mailto:gururajkulkarni115@gmail.com">
              <span className="hero-contact-icon" aria-hidden="true"><Mail size={19} /></span>
              <span className="hero-contact-copy"><small>Email me</small><strong>gururajkulkarni115@gmail.com</strong></span>
              <ArrowRight className="hero-contact-arrow" size={16} aria-hidden="true" />
            </a>
          </motion.div>
          <p className="mt-6 text-sm text-slate-500 flex items-center gap-2">
            <MapPin size={16} />
            {profile.location} · {profile.availability}
          </p>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{ position: "relative", display: "flex", justifyContent: "center" }}
          onPointerMove={handleVisualPointerMove}
          onPointerLeave={resetVisualPointer}
        >
          <div className="hero-ring absolute w-80 h-80 sm:w-[27rem] sm:h-[27rem] xl:w-[30rem] xl:h-[30rem] rounded-full border border-indigo-400/20 animate-[spin_18s_linear_infinite]" />
          <div className="hero-3d-particles" aria-hidden="true">
            {Array.from({ length: 8 }, (_, index) => <i className={`hero-3d-particle hero-3d-particle-${index + 1}`} key={index} />)}
          </div>
          <motion.div
            className="hero-portrait-card w-72 h-72 sm:w-[26rem] sm:h-[26rem] xl:w-[29rem] xl:h-[29rem] rounded-[2.5rem] glass glow p-2"
            style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000, transformStyle: "preserve-3d" }}
          >
            <div className="w-full h-full rounded-[2rem] bg-slate-900 overflow-hidden grid place-items-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} portrait`}
                  className="w-full h-full object-cover object-center opacity-100"
                />
              ) : (
                <div className="text-9xl font-black text-gradient">G</div>
              )}
            </div>
          </motion.div>
          <span className="hero-tech-chip hero-tech-chip-react" aria-hidden="true"><Boxes size={16} /> React</span>
          <span className="hero-tech-chip hero-tech-chip-api" aria-hidden="true"><Braces size={16} /> REST API</span>
          <span className="hero-tech-chip hero-tech-chip-flow" aria-hidden="true"><Workflow size={16} /> Full stack</span>
        </motion.div>
      </div>
      <a href="#about" className="hero-scroll-cue">
        <span>{settings.scrollCue || "Scroll to explore"}</span>
        <span className="hero-scroll-mouse"><i /></span>
        <ArrowDown size={15} />
      </a>
    </section>
  );
}
