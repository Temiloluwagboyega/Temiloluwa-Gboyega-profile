import { useEffect, useState } from 'react'

const NAV = [
  { id: 'intro', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'founding', label: 'Founding' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('intro')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV.map(({ id }) => document.getElementById(id)).filter(Boolean)
    // Marks whichever section straddles the middle of the viewport. Height
    // independent, so the tall scroll-runway hero can't fall out of range the
    // way a ratio threshold would.
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s) => spy.observe(s))
    return () => spy.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap nav">
        <a href="#top" className="brand" onClick={() => setMenuOpen(false)}>
          Temiloluwa<span>.</span>
        </a>
        <nav>
          <ul className="nav-links">
            {NAV.map(({ id, label }) => (
              <li key={id} className={active === id ? 'current' : ''}>
                <a href={`#${id}`} onClick={() => setMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="/Temiloluwa_Gboyega_Resume.pdf" className="btn btn--primary nav-cta" download>
                Résumé
              </a>
            </li>
          </ul>
        </nav>
        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}
