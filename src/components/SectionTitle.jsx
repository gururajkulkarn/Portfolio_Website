import { motion } from "framer-motion";

export default function SectionTitle({ eyebrow, title, children, direction = "up" }) {
  const offset = direction === "left" ? { x: -32, y: 0 } : direction === "right" ? { x: 32, y: 0 } : { x: 0, y: 22 };

  return (
    <motion.div
      className="max-w-3xl"
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <p className="text-cyan-400 text-sm font-bold tracking-[.25em]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-4xl md:text-6xl font-black leading-tight">
        {title}
      </h2>
      {children && (
        <p className="mt-5 text-slate-400 text-lg leading-8">{children}</p>
      )}
    </motion.div>
  );
}
