import { useEffect, useRef, useState } from 'react'

/** Fades content up when it scrolls into view. delay: 0–3 stagger steps. */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const cls = ['reveal', delay ? `d${delay}` : '', inView ? 'in' : '', className].filter(Boolean).join(' ')
  return (
    <Tag ref={ref} className={cls} {...rest}>
      {children}
    </Tag>
  )
}
