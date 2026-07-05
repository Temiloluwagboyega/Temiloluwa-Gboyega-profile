import Reveal from './Reveal'
import { projects } from '../data/projects'

function ProjectCard({ project, delay }) {
  const isLive = Boolean(project.url)
  return (
    <Reveal as="article" className="card" delay={delay}>
      {isLive && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card-link"
          aria-label={`Open ${project.title}`}
        ></a>
      )}
      {project.image ? (
        <div className="card-media">
          <img src={project.image} alt={project.alt} loading="lazy" />
        </div>
      ) : (
        <div className="card-media ph" aria-hidden="true">
          <div className="grid-overlay"></div>
          <div className="mono">{project.monogram}</div>
        </div>
      )}
      <span className="card-cat">{project.category}</span>
      <div className="card-body">
        <div className="card-title-row">
          <h3 className="card-title">{project.title}</h3>
          {isLive && (
            <span className="card-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </span>
          )}
        </div>
        <p className="card-desc">{project.description}</p>
        <ul className="stack">
          {project.stack.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function Work() {
  return (
    <section id="work" className="section section-line">
      <div className="wrap">
        <div className="work-head">
          <div>
            <Reveal className="eyebrow" as="div">Selected Work</Reveal>
            <Reveal delay={1}>
              <h2 className="section-title">Things I&rsquo;ve shipped.</h2>
            </Reveal>
          </div>
          <Reveal delay={1}>
            <p className="section-intro">
              A mix of client, freelance and personal projects. Each is live — feel free to click through.
            </p>
          </Reveal>
        </div>

        <div className="work-grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} delay={i % 2} />
          ))}
        </div>
        <p className="work-note">
          Further projects are still in production or are private company work I can&rsquo;t share publicly.
        </p>
      </div>
    </section>
  )
}
