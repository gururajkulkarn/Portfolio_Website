import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin, MessageCircle, Phone } from "lucide-react";
export default function Hero({ profile, settings }) {
  const prefersReducedMotion = useReducedMotion();
  const roleTitle = profile.headline?.split("•")[0].trim() || "Full-Stack Developer";
  const whatsappNumber = (profile.phone || "").replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent("Hi Gururaj, I'd like to discuss a project.");
  const whatsappHref = whatsappNumber.length >= 8
    ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    : `https://wa.me/?text=${whatsappMessage}`;

  return (
    <section id="top" className="home-hero relative min-h-screen overflow-hidden bg-grid pt-16 lg:pt-[4.5rem] flex items-start">
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
          <h1 className="mt-7 text-[clamp(1.7rem,8.6vw,2.65rem)] sm:text-6xl lg:text-6xl xl:text-[3.5rem] font-black leading-[1.08] tracking-tight">
            <span className="block xl:whitespace-nowrap">
              <span>
                {Array.from(roleTitle).map((letter, index) => (
                  <motion.span
                    key={`${letter}-${index}`}
                    className={letter === " " ? "inline-block w-[.28em]" : "inline-block"}
                    initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.01,
                      delay: prefersReducedMotion ? 0 : index * 0.045,
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
          <p className="mt-7 max-w-2xl text-lg text-slate-400 leading-8">
            {profile.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
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
          <p className="mt-8 text-sm text-slate-500 flex items-center gap-2">
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
        >
          <div className="hero-ring absolute w-80 h-80 rounded-full border border-indigo-400/20 animate-[spin_18s_linear_infinite]" />
          <div className="hero-portrait-card w-72 h-72 sm:w-96 sm:h-96 rounded-[3rem] glass glow p-3 rotate-3 hover:rotate-0 transition duration-700">
            <div className="w-full h-full rounded-[2.4rem] bg-gradient-to-br from-indigo-500/30 via-slate-900 to-fuchsia-500/20 overflow-hidden grid place-items-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.name} portrait`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-9xl font-black text-gradient">G</div>
              )}
            </div>
          </div>
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
