import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Boxes, Braces, Database, PanelsTopLeft, Rocket, Workflow } from "lucide-react";

const workflow = [
  { name: "React", detail: "Build the interface", icon: PanelsTopLeft },
  { name: "Node.js", detail: "Power the server", icon: Workflow },
  { name: "Express", detail: "Create the APIs", icon: Braces },
  { name: "PostgreSQL", detail: "Store the data", icon: Database },
  { name: "Docker", detail: "Package the app", icon: Boxes },
  { name: "Deployment", detail: "Ship to production", icon: Rocket },
];

export default function InteractiveSkillsGraph() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="skills-flow-section" aria-labelledby="skills-flow-title">
      <div className="skills-flow-heading">
        <div>
          <p className="skills-flow-eyebrow">HOW THE PIECES CONNECT</p>
          <h3 id="skills-flow-title">From first component to production.</h3>
          <p className="skills-flow-description">A connected full-stack workflow, built to take an idea all the way live.</p>
        </div>
        <span className="skills-flow-live"><i /> FULL-STACK FLOW</span>
      </div>

      <div className="skills-flow-track" role="group" aria-label="Full-stack development workflow">
        {workflow.map(({ name, detail, icon: Icon }, index) => (
          <div className="skills-flow-item" key={name}>
            <motion.article
              className={`skills-flow-node skills-flow-node-${index + 1}`}
              initial={reducedMotion ? false : { opacity: 0, y: 18, scale: .96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={reducedMotion ? undefined : { y: -5, scale: 1.025 }}
              viewport={{ once: true, amount: .4 }}
              transition={{ duration: .42, delay: reducedMotion ? 0 : index * .09, ease: "easeOut" }}
            >
              <span className="skills-flow-icon"><Icon size={20} strokeWidth={1.9} /></span>
              <span className="skills-flow-node-copy">
                <strong>{name}</strong>
                <small>{detail}</small>
              </span>
              <span className="skills-flow-index">0{index + 1}</span>
            </motion.article>
            {index < workflow.length - 1 && (
              <span className="skills-flow-connector" aria-hidden="true">
                <i />
                <ArrowRight className="skills-flow-arrow" size={15} />
              </span>
            )}
          </div>
        ))}
      </div>
      <span className="skills-flow-orb skills-flow-orb-one" aria-hidden="true" />
      <span className="skills-flow-orb skills-flow-orb-two" aria-hidden="true" />
    </section>
  );
}
