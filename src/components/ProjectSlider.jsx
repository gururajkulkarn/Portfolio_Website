import { motion } from "framer-motion";
import { AppWindow, ArrowUpRight, Boxes, Database, ExternalLink } from "lucide-react";
import SectionTitle from "./SectionTitle";

const projectVisuals = [AppWindow, Boxes, Database];
const projectImageRules = [
  { matches: /event|ticket/, image: "/images/online-event-smart-ticketing.png" },
  { matches: /hospital|token|appointment/, image: "/images/smart-hospital-token-system.png" },
  { matches: /e.?commerce|shop|store/, image: "/images/smart-ecommerce-platform.png" },
];

function readableTitle(title = "") {
  return title.replace(/_/g, " ").replace(/\s+/g, " ").trim();
}

export default function ProjectSlider({ projects = [], settings }) {
  return (
    <section id="projects" className="projects-section max-w-7xl mx-auto px-6 py-24 md:py-28">
      <SectionTitle
        eyebrow={settings?.projectsEyebrow || "SELECTED WORK"}
        title={settings?.projectsTitle || "Projects that solve real problems."}
      >
        {settings?.projectsDescription || "A few examples of the products, platforms and learning experiences I’ve built."}
      </SectionTitle>

      {projects.length ? (
        <div className="project-showcase-grid mt-12 md:mt-14">
          {projects.map((project, index) => {
            const Icon = projectVisuals[index % projectVisuals.length];
            const title = readableTitle(project.title);
            const searchableProject = `${project.title || ""} ${project.category || ""}`.toLowerCase();
            const image = project.image || projectImageRules.find(({ matches }) => matches.test(searchableProject))?.image;
            return (
              <motion.article
                key={project.id || `${title}-${index}`}
                className="project-showcase-card"
                initial={{ opacity: 0, x: index % 2 === 0 ? -32 : 32, y: 18 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.52, delay: index * 0.1, ease: "easeOut" }}
              >
                <div className={`project-showcase-art project-showcase-art-${index % 3}`}>
                  {image ? (
                    <img src={image} alt={`${title} preview`} loading="lazy" />
                  ) : (
                    <>
                      <div className="project-art-grid" aria-hidden="true" />
                      <div className="project-art-orbit project-art-orbit-one" aria-hidden="true" />
                      <div className="project-art-orbit project-art-orbit-two" aria-hidden="true" />
                      <div className="project-art-icon"><Icon size={38} strokeWidth={1.5} /></div>
                    </>
                  )}
                  <span className="project-art-category">{project.category || "Web application"}</span>
                </div>

                <div className="project-showcase-content">
                  <h3>{title}</h3>
                  <p>{project.description}</p>
                  {!!project.tags?.length && (
                    <div className="project-showcase-tags">
                      {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                    </div>
                  )}
                  {project.url && project.url !== "#" && (
                    <a href={project.url} target="_blank" rel="noreferrer" className="project-showcase-link">
                      Explore project <ExternalLink size={16} />
                    </a>
                  )}
                  <ArrowUpRight className="project-showcase-arrow" size={20} aria-hidden="true" />
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <div className="project-empty-state mt-12">
          <span>WORK IN PROGRESS</span>
          <h3>New projects are on the way.</h3>
          <p>Check back soon to explore the latest work.</p>
        </div>
      )}
    </section>
  );
}
