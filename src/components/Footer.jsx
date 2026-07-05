export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <span>© {new Date().getFullYear()} Temiloluwa Gboyega — Designed &amp; built by me.</span>
        <a href="#top" className="to-top">
          Back to top
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M6 11l6-6 6 6" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
