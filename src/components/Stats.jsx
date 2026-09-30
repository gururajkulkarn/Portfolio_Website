import { motion } from "framer-motion";

export default function Stats({ items }) {
  return (
    <section className="border-y border-white/10 bg-white/[.02]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map(([label, value], index) => (
          <motion.div
            key={`${label}-${index}`}
            className="stat-item"
            initial={{ opacity: 0, x: index < 2 ? -52 : 52 }}
            whileInView={{ opacity: 1, x: 0 }}
            whileHover={{ y: -5, scale: 1.025 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          >
            <p className="stat-value text-3xl md:text-4xl font-black">{value}</p>
            <p className="mt-2 text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
