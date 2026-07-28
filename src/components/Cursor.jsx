import { useEffect, useRef } from 'react'

/**
 * The pointer is a </> glyph that tracks 1:1, with a ring easing along behind
 * it. The ring opens up and tints over anything interactive.
 *
 * Fine-pointer devices only — touch and prefers-reduced-motion keep the native
 * cursor, since hiding it there costs more than it gives.
 */
export default function Cursor() {
  const glyph = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!fine.matches || reduced.matches) return

    document.body.classList.add('has-cursor')

    const point = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const eased = { x: point.x, y: point.y }
    let raf = 0
    let seen = false

    const show = () => {
      glyph.current?.classList.add('is-on')
      ring.current?.classList.add('is-on')
    }
    const hide = () => {
      glyph.current?.classList.remove('is-on')
      ring.current?.classList.remove('is-on')
    }

    const onMove = (e) => {
      point.x = e.clientX
      point.y = e.clientY
      if (!seen) {
        // don't let the ring fly in from the centre on first movement
        seen = true
        eased.x = e.clientX
        eased.y = e.clientY
        show()
      }
    }

    const onOver = (e) => {
      const r = ring.current
      const g = glyph.current
      if (!r || !g || typeof e.target?.closest !== 'function') return
      const hit = Boolean(e.target.closest('a, button, [role="button"]'))
      r.classList.toggle('is-link', hit)
      g.classList.toggle('is-link', hit)
    }

    const tick = () => {
      eased.x += (point.x - eased.x) * 0.18
      eased.y += (point.y - eased.y) * 0.18
      if (glyph.current) {
        glyph.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
      }
      if (ring.current) {
        ring.current.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.documentElement.addEventListener('pointerenter', show)
    document.documentElement.addEventListener('pointerleave', hide)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerenter', show)
      document.documentElement.removeEventListener('pointerleave', hide)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-glyph" ref={glyph} aria-hidden="true">
        &lt;/&gt;
      </div>
    </>
  )
}
