import Reveal from './Reveal'

export default function Contact() {
  return (
    <section id="contact" className="section section-line contact">
      <div className="wrap contact-inner">
        <div>
          <Reveal className="eyebrow" as="div">Get in touch</Reveal>
          <Reveal delay={1}>
            <h2>
              Let&rsquo;s build something <em>worth using.</em>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p>Have a role, a project, or just want to talk tech and design? My inbox is always open.</p>
          </Reveal>
          <Reveal delay={2}>
            <a href="mailto:temiloluwagboyega@gmail.com" className="btn btn--primary">
              Say hello
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16v12H4zM4 7l8 6 8-6" />
              </svg>
            </a>
          </Reveal>
        </div>
        <Reveal delay={3} className="contact-meta">
          <div className="block">
            <h4>Email</h4>
            <a href="mailto:temiloluwagboyega@gmail.com">temiloluwagboyega@gmail.com</a>
          </div>
          <div className="block">
            <h4>Phone</h4>
            <a href="tel:+2349153120110">+234 915 312 0110</a>
          </div>
          <div className="block">
            <h4>Elsewhere</h4>
            <div className="contact-socials">
              <a href="https://www.linkedin.com/in/temiloluwa-gboyega-5212632b1/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://github.com/Temiloluwagboyega" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
