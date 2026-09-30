import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import SectionTitle from "./SectionTitle";

export default function TestimonialsCarousel({ testimonials = [], settings = {} }) {
  const slides = testimonials.filter((item) => item?.quote);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setActiveIndex((current) => (slides.length ? current % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused || reducedMotion) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [activeIndex, paused, reducedMotion, slides.length]);

  if (!slides.length) return null;

  const active = slides[activeIndex];
  const move = (direction) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      data-section="testimonials"
      aria-label="Testimonials"
      className="testimonials-section"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="testimonials-inner">
        <SectionTitle eyebrow={settings.testimonialsEyebrow} title={settings.testimonialsTitle} />
        {settings.testimonialsDescription && (
          <p className="testimonials-intro">{settings.testimonialsDescription}</p>
        )}

        <div className="testimonials-stage">
          <span className="testimonials-orbit testimonials-orbit-one" aria-hidden="true" />
          <span className="testimonials-orbit testimonials-orbit-two" aria-hidden="true" />
          <div className="testimonials-quote-mark" aria-hidden="true"><Quote /></div>

          <div className="testimonials-slide-window" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={active.id || activeIndex}
                className="testimonials-card"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 48, filter: "blur(5px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -48, filter: "blur(5px)" }}
                transition={{ duration: reducedMotion ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="testimonials-quote">“{active.quote}”</p>
                <div className="testimonials-author">
                  <span className="testimonials-avatar" aria-hidden="true">
                    {(active.name || active.role || "F").trim().slice(0, 1).toUpperCase()}
                  </span>
                  <span className="testimonials-author-copy">
                    <strong>{active.name}</strong>
                    <span>{active.role}</span>
                  </span>
                  <span className="testimonials-counter">{String(activeIndex + 1).padStart(2, "0")} <i /> {String(slides.length).padStart(2, "0")}</span>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <div className="testimonials-controls">
            <div className="testimonials-pagination" role="group" aria-label="Choose testimonial">
              {slides.map((item, index) => (
                <button
                  key={item.id || index}
                  type="button"
                  className={`testimonials-dot${index === activeIndex ? " is-active" : ""}`}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            <div className="testimonials-arrows">
              <button type="button" aria-label="Previous testimonial" onClick={() => move(-1)}><ArrowLeft size={18} /></button>
              <button type="button" aria-label="Next testimonial" onClick={() => move(1)}><ArrowRight size={18} /></button>
            </div>
          </div>
          <span className="testimonials-autoplay-note">{paused || reducedMotion ? "Use the arrows to explore" : "Feedback · on a rotating loop"}</span>
        </div>
      </div>
    </section>
  );
}
