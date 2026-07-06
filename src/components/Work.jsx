import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Reveal from './Reveal'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const pad = (n) => String(n).padStart(2, '0')

const ArrowOut = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
)

/* -------- shared panel content -------- */
function PanelMedia({ project }) {
  if (project.image) {
    return (
      <div className="sc-panel__media">
        <img src={project.image} alt={project.alt} loading="lazy" />
      </div>
    )
  }
  return (
    <div className="sc-panel__media ph" aria-hidden="true">
      <div className="grid-overlay"></div>
      <span className="mono">{project.monogram}</span>
    </div>
  )
}

function PanelInfo({ project }) {
  const isLive = Boolean(project.url)
  return (
    <div className="sc-panel__info">
      <div className="sc-panel__cat">{project.category}</div>
      <h3 className="sc-panel__title">{project.title}</h3>
      <p className="sc-panel__desc">{project.description}</p>
      <ul className="stack">
        {project.stack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      {isLive ? (
        <a className="btn btn--primary sc-panel__cta" href={project.url} target="_blank" rel="noopener noreferrer">
          Visit live <ArrowOut />
        </a>
      ) : (
        <span className="sc-panel__soon">In development</span>
      )}
    </div>
  )
}

/* -------- desktop: pinned scroll showcase -------- */
function Showcase() {
  const root = useRef(null)
  const barRef = useRef(null)
  const [active, setActive] = useState(0)
  const n = projects.length

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.sc-panel')

      gsap.set(panels, { autoAlpha: 0, scale: 0.86, yPercent: 14 })
      gsap.set(panels[0], { autoAlpha: 1, scale: 0.86, yPercent: 10 })

      const tl = gsap.timeline()
      // first project expands into place
      tl.to(panels[0], { scale: 1, yPercent: 0, duration: 0.6, ease: 'power2.out' }).to({}, { duration: 0.5 })
      // each subsequent project rises over the previous
      for (let i = 1; i < n; i++) {
        tl.to(panels[i - 1], { autoAlpha: 0, scale: 1.12, yPercent: -12, duration: 0.6, ease: 'power2.in' }, '>')
          .fromTo(
            panels[i],
            { autoAlpha: 0, scale: 0.86, yPercent: 14 },
            { autoAlpha: 1, scale: 1, yPercent: 0, duration: 0.6, ease: 'power2.out' },
            '<0.1'
          )
          .to({}, { duration: 0.5 })
      }

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: () => '+=' + window.innerHeight * n * 0.9,
        pin: '.sc-stage',
        scrub: 1,
        animation: tl,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          setActive((prev) => {
            const next = Math.min(n - 1, Math.round(self.progress * (n - 1)))
            return next === prev ? prev : next
          })
        },
      })
    }, root)

    return () => ctx.revert()
  }, [n])

  return (
    <section id="work" className="section section-line showcase" ref={root}>
      <div className="sc-stage">
        <div className="sc-head">
          <span className="eyebrow">Selected Work</span>
          <span className="sc-count">
            <b>{pad(active + 1)}</b> / {pad(n)}
          </span>
        </div>

        {projects.map((project) => (
          <article className="sc-panel" key={project.title}>
            <div className="sc-panel__inner">
              <PanelMedia project={project} />
              <PanelInfo project={project} />
            </div>
          </article>
        ))}

        <div className="sc-progress">
          <i ref={barRef}></i>
        </div>
      </div>
    </section>
  )
}

/* -------- mobile / reduced-motion: simple card grid -------- */
function CardGrid() {
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
        </div>
        <div className="work-grid">
          {projects.map((project) => {
            const isLive = Boolean(project.url)
            return (
              <Reveal as="article" className="card" key={project.title}>
                {isLive && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="card-link" aria-label={`Open ${project.title}`}></a>
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
                        <ArrowOut />
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
          })}
        </div>
        <p className="work-note">
          Further projects are still in production or are private company work I can&rsquo;t share publicly.
        </p>
      </div>
    </section>
  )
}

export default function Work() {
  const [pinned, setPinned] = useState(null)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 861px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const decide = () => setPinned(desktop.matches && !reduced.matches)
    decide()
    desktop.addEventListener('change', decide)
    reduced.addEventListener('change', decide)
    return () => {
      desktop.removeEventListener('change', decide)
      reduced.removeEventListener('change', decide)
    }
  }, [])

  if (pinned === null) return <section id="work" className="section section-line" style={{ minHeight: '60vh' }} />
  return pinned ? <Showcase /> : <CardGrid />
}
