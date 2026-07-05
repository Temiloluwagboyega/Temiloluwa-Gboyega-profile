import Reveal from './Reveal'
import { employment, education } from '../data/experience'

export default function Experience() {
  return (
    <section id="experience" className="section section-line">
      <div className="wrap">
        <Reveal className="eyebrow" as="div">Experience &amp; Education</Reveal>
        <Reveal delay={1}>
          <h2 className="section-title">Where I&rsquo;ve been building.</h2>
        </Reveal>
        <div className="exp-grid">
          <div>
            <Reveal className="col-head" as="div">Employment</Reveal>
            <div className="timeline">
              {employment.map((job, i) => (
                <Reveal className="tl-item" key={`${job.role}-${job.org}`} delay={Math.min(i, 3)}>
                  <div className="role">
                    {job.role} <span className="org">· {job.org}</span>
                  </div>
                  <div className="period">{job.period}</div>
                  <ul>
                    {job.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <Reveal className="col-head" as="div">Education</Reveal>
            <div className="timeline">
              {education.map((item) => (
                <Reveal className="tl-item" key={item.role}>
                  <div className="role">{item.role}</div>
                  <div className="org">{item.org}</div>
                  <div className="period">{item.period}</div>
                  <p className="desc">{item.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
