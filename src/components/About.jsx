import Reveal from './Reveal'
import { skills } from '../data/experience'

export default function About() {
  return (
    <section id="about" className="section section-line">
      <div className="wrap about-grid">
        <Reveal className="about-photo">
          <img src="/images/me.PNG" alt="Portrait of Temiloluwa Gboyega" width="500" height="500" />
          <div className="badge">
            <span className="dot"></span> Founder &amp; builder
          </div>
        </Reveal>
        <div>
          <Reveal className="eyebrow" as="div">About</Reveal>
          <Reveal delay={1}>
            <h2 className="section-title">Engineering that puts people first.</h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="about-lead">
              I design and build responsive, user-focused web applications — with real attention to
              performance, accessibility and secure UI development.
              
            </p>
          </Reveal>
          <Reveal delay={2}>
            <p className="about-body">
              I&rsquo;m proficient across React.js, JavaScript, TypeScript, Tailwind CSS, Django and Python,
              with strong experience in API integration and real-time data. I work best in Agile teams
              shipping scalable, high-quality solutions — and I&rsquo;m driven by using technology to solve
              real-world problems, with growing interests in cybersecurity and data science.
            </p>
          </Reveal>

          <Reveal delay={3} className="skill-groups">
            {Object.entries(skills).map(([group, items]) => (
              <div className="skill-group" key={group}>
                <h4>{group}</h4>
                <ul className="chips">
                  {items.map(({ name, key }) => (
                    <li key={name} className={`chip${key ? ' is-key' : ''}`}>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
