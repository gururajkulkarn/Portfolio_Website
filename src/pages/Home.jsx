import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  Braces,
  Boxes,
  Database,
  Globe2,
  PanelsTopLeft,
  Rocket,
  Smartphone,
  Workflow,
} from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { getSingleton } from "../lib/content";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import ProjectSlider from "../components/ProjectSlider";
import SectionTitle from "../components/SectionTitle";
import {
  defaultProfile,
  defaultAbout,
  defaultProjects,
  defaultExperience,
  defaultTestimonials,
  defaultSettings,
} from "../data/defaultData";

const technologyBrands = {
  React: { slug: "react", color: "61DAFB" },
  "Node.js": { slug: "nodedotjs", color: "5FA04E" },
  Express: { slug: "express", color: "111827" },
  PostgreSQL: { slug: "postgresql", color: "4169E1" },
  Firebase: { slug: "firebase", color: "DD2C00" },
  Docker: { slug: "docker", color: "2496ED" },
  Linux: { slug: "linux", color: "FCC624" },
  Git: { slug: "git", color: "F05032" },
  "Tailwind CSS": { slug: "tailwindcss", color: "06B6D4" },
};

const technologyFallbacks = {
  DevOps: Workflow,
  "REST APIs": Braces,
  "Responsive UI": PanelsTopLeft,
};

const aboutServiceIcons = { AppWindow, Boxes, Database, Globe2, Rocket, Smartphone };

export default function Home() {
  const [isLoading, setIsLoading] = useState(true),
    [profile, setProfile] = useState(defaultProfile),
    [about, setAbout] = useState(defaultAbout),
    [settings, setSettings] = useState(defaultSettings),
    [projects, setProjects] = useState(defaultProjects),
    [experience, setExperience] = useState(defaultExperience),
    [testimonials, setTestimonials] = useState(defaultTestimonials);
  const skills = profile.skills || [];
  const services = about.services || [];
  useEffect(() => {
    const loaderTimer = window.setTimeout(() => setIsLoading(false), 2400);
    getSingleton("profile")
      .then((savedProfile) => {
        if (savedProfile) setProfile({
          ...defaultProfile,
          ...savedProfile,
          avatarUrl: savedProfile.avatarUrl || defaultProfile.avatarUrl,
          socials: { ...defaultProfile.socials, ...savedProfile.socials },
        });
      })
      .catch(() => {});
    getSingleton("about")
      .then((savedAbout) => {
        if (savedAbout) setAbout({ ...defaultAbout, ...savedAbout });
      })
      .catch(() => {});
    getSingleton("settings")
      .then((savedSettings) => {
        if (savedSettings) setSettings({
          ...defaultSettings,
          ...savedSettings,
          navigation: { ...defaultSettings.navigation, ...savedSettings.navigation },
        });
      })
      .catch(() => {});
    const get = (path, setter, fallback) => {
      try {
        return onSnapshot(
          collection(db, path),
          (s) => setter(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
          () => setter(fallback),
        );
      } catch {}
    };
    const unsubs = [
      get("projects", (records) => setProjects(records.length ? records : defaultProjects), defaultProjects),
      get("experience", setExperience, defaultExperience),
      get("testimonials", setTestimonials, defaultTestimonials),
    ];
    return () => {
      window.clearTimeout(loaderTimer);
      unsubs.forEach((u) => u && u());
    };
  }, []);
  if (isLoading) {
    return (
      <div className="site-loader" role="status" aria-label="Loading portfolio">
        <div className="site-loader-content">
          <span className="site-loader-emblem" aria-hidden="true">
            <i className="site-loader-orbit-dot site-loader-orbit-dot-one" />
            <i className="site-loader-orbit-dot site-loader-orbit-dot-two" />
            <span className="site-loader-monogram">G</span>
          </span>
          <span className="site-loader-caption">{profile.name?.toUpperCase() || "GURURAJ KULKARNI"}</span>
          <span className="site-loader-progress" aria-hidden="true"><i /></span>
        </div>
        <span className="sr-only">Loading portfolio</span>
      </div>
    );
  }
  return (
    <>
      <Navbar profile={profile} settings={settings} />
      <main>
        <Hero profile={profile} settings={settings} />
        <Stats items={settings.stats} />
        <section id="about" className="about-section relative isolate overflow-hidden border-y border-white/10">
          <div className="about-section-glow" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-6 py-24 md:py-28 relative z-10">
            <motion.div
              className="about-intro"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
                <p className="section-eyebrow">{about.eyebrow}</p>
                <h2 className="about-title">
                  {about.title} <span>{about.titleAccent}</span>
                </h2>
              <div className="about-summary">
                <p>{about.description}</p>
              </div>
            </motion.div>

            <div className="about-services-grid">
              {services.map((service, index) => {
                const Icon = aboutServiceIcons[service.icon] || Boxes;
                return (
                  <motion.article
                    key={`${service.title}-${index}`}
                    className="about-service-card"
                    initial={{ opacity: 0, y: 26 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8, scale: 1.015 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.48, delay: index * 0.07, ease: "easeOut" }}
                  >
                    <div className="about-service-topline">
                      <span className="about-service-icon"><Icon size={21} strokeWidth={1.8} /></span>
                      <span className="about-service-number">0{index + 1}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <span className="about-service-accent" aria-hidden="true" />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>
        <section
          id="skills"
          className="py-24 bg-white/[.025] border-y border-white/10"
        >
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle eyebrow={settings.skillsEyebrow} title={settings.skillsTitle} />
            <motion.div
              className="technology-panel glass"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              <div className="technology-panel-header">
                <div>
                  <p className="technology-panel-kicker">{settings.technologyPanelTitle}</p>
                  <p className="technology-panel-copy">{settings.technologyPanelDescription}</p>
                </div>
              </div>
              <div className="technology-tiles">
                {skills.map((skill, index) => {
                  const brand = technologyBrands[skill];
                  const FallbackIcon = technologyFallbacks[skill] || Boxes;
                  return (
                    <motion.div
                      key={skill}
                      className="technology-tile"
                      initial={{ opacity: 0, y: 14, scale: .96 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ y: -5, scale: 1.045 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ duration: .3, delay: index * .045, ease: "easeOut" }}
                    >
                      <span className="technology-logo" aria-hidden="true">
                        {brand ? (
                          <>
                            <img
                              src={`https://cdn.simpleicons.org/${brand.slug}/${brand.color}`}
                              alt=""
                              loading="lazy"
                              onError={(event) => {
                                event.currentTarget.hidden = true;
                                event.currentTarget.nextElementSibling?.removeAttribute("hidden");
                              }}
                            />
                            <FallbackIcon size={21} strokeWidth={1.8} hidden />
                          </>
                        ) : (
                          <FallbackIcon size={22} strokeWidth={1.9} />
                        )}
                      </span>
                      <span>{skill}</span>
                    </motion.div>
                  );
                })}
              </div>
              <div className="technology-panel-footer">
                <span className="technology-status-dot" />
                <span>{settings.technologyPanelFooter}</span>
              </div>
            </motion.div>
          </div>
        </section>
        <ProjectSlider projects={projects} settings={settings} />
        <section id="experience" className="max-w-7xl mx-auto px-6 py-28">
          <SectionTitle
            eyebrow={settings.experienceEyebrow}
            title={settings.experienceTitle}
          />
          <div className="mt-12 space-y-5">
            {experience.map((e, i) => (
              <motion.div
                key={e.id || i}
                className="glass rounded-3xl p-7 md:p-9 grid md:grid-cols-[1fr_auto] gap-5"
                initial={{ opacity: 0, x: i % 2 === 0 ? -36 : 36 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
              >
                <div>
                  <p className="text-cyan-300 font-semibold">{e.role}</p>
                  <h3 className="mt-2 text-2xl font-bold">{e.company}</h3>
                  <p className="mt-4 text-slate-400 leading-7">
                    {e.description}
                  </p>
                </div>
                <span className="text-slate-500 text-sm">{e.period}</span>
              </motion.div>
            ))}
          </div>
        </section>
        <section data-section="testimonials" className="py-28 bg-gradient-to-b from-transparent to-indigo-950/20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionTitle eyebrow={settings.testimonialsEyebrow} title={settings.testimonialsTitle} />
            <div className="mt-12 grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id || i}
                  className="glass rounded-3xl p-8"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -28 : 28, y: 12 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  whileHover={{ y: -5 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
                >
                  <p className="text-xl leading-8 text-slate-200">
                    “{t.quote}”
                  </p>
                  <p className="mt-7 font-bold">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section
          id="contact"
          className="max-w-5xl mx-auto px-6 py-28 text-center"
        >
          <motion.div
            className="rounded-[2rem] p-10 md:p-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600"
            initial={{ opacity: 0, y: 28, scale: .98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-bold text-indigo-100">{settings.contactEyebrow}</p>
            <h2 className="mt-4 text-4xl md:text-6xl font-black">
              {settings.contactTitle}
            </h2>
            <p className="mt-5 text-indigo-100 text-lg">
              {settings.contactDescription}
            </p>
            <a
              href={"mailto:" + profile.email}
              className="inline-block mt-8 px-7 py-4 rounded-xl bg-white text-slate-950 font-bold hover:scale-105 transition"
            >
              {settings.contactCta} →
            </a>
          </motion.div>
        </section>
      </main>
      <Footer profile={profile} settings={settings} />
    </>
  );
}
