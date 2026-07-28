import Reveal from './Reveal'

/**
 * Abode — the company section.
 *
 * Laid out as a record rather than a card: labelled fields on hairline rules,
 * because a verifiable record is literally what Abode builds. Carries Abode's
 * own coral accent so the section reads as the company's, not the portfolio's.
 */

const RECORD = [
  { label: 'Role', value: 'Founder & Product Engineer' },
  { label: 'Since', value: '2026 — Present' },
  { label: 'Entity', value: 'Registered company' },
]

const PRODUCTS = [
  {
    n: '01',
    name: 'Marketplace',
    blurb: 'Homeowners hire, workers get work — matched on verified identity and real history.',
  },
  {
    n: '02',
    name: 'AgencyOS',
    blurb: 'The SaaS platform recruitment agencies run their whole operation on.',
  },
]

const STACK = ['React', 'React Native', 'Next.js', 'TypeScript', 'Django', 'PostgreSQL', 'Tailwind CSS']

const ABODE_URL = 'https://getabode.vercel.app/'

export default function Founding() {
  return (
    <section id="founding" className="section section-line founding">
      <div className="wrap">
        <Reveal className="founding-head" as="div">
          <span className="eyebrow">Founding</span>
          <span className="founding-flag">Building now</span>
        </Reveal>

        <Reveal delay={1}>
          <h2 className="founding-title">Abode</h2>
        </Reveal>
        <Reveal delay={1}>
          <p className="founding-lead">
            Trust infrastructure for Nigerian homes, workers and recruitment agencies.
          </p>
        </Reveal>

        <Reveal delay={2} className="founding-media">
          <a href={ABODE_URL} target="_blank" rel="noopener noreferrer">
            <img
              src="/images/portfolio/abode.png"
              alt="The Abode platform landing page"
              loading="lazy"
              width="1349"
              height="999"
            />
          </a>
        </Reveal>

        <div className="founding-grid">
          <Reveal delay={1} as="dl" className="founding-record">
            {RECORD.map(({ label, value }) => (
              <div className="rec" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </Reveal>

          <div className="founding-body">
            <Reveal delay={2}>
              <p className="founding-thesis">
                Nigeria&rsquo;s domestic workforce runs on WhatsApp groups, word of mouth and paper
                files — so nobody can prove who anyone is. Abode builds the layer underneath it:
                verified identity, portable reputation and real employment records. I lead design and
                engineering across web and mobile, alongside product strategy and architecture.
              </p>
            </Reveal>

            <Reveal delay={3} className="founding-products">
              {PRODUCTS.map(({ n, name, blurb }) => (
                <div className="prod" key={n}>
                  <span className="prod-n">Product {n}</span>
                  <h3 className="prod-name">{name}</h3>
                  <p className="prod-blurb">{blurb}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        <Reveal delay={2} className="founding-foot">
          <dl className="founding-stack">
            <dt>Stack</dt>
            <dd>
              <ul className="stack">
                {STACK.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </dd>
          </dl>
          <a
            className="btn btn--primary founding-cta"
            href={ABODE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Abode
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M9 7h8v8" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
