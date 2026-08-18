import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const COLS = 120
const ROWS = 70
const GAP = 0.42
const COUNT = COLS * ROWS

/**
 * Interactive particle field in the site's gold → teal palette.
 * Idle: a gently waving plane that parallaxes toward the cursor.
 * On scroll: the plane morphs into a rotating tunnel and the camera
 * flies into it — a wormhole transition out of the hero.
 *
 * `scroll` is the hero's own sticky-travel progress (0 → 1), supplied by
 * Hero so the whole morph completes while the stage is still pinned.
 */
function ParticleField({ scroll }) {
  const pointsRef = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const { camera, gl } = useThree()

  const { positions, colors, seeds, grid } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    const grid = new Float32Array(COUNT * 2) // base x/y of each point
    const gold = new THREE.Color('#cfa83a')
    const teal = new THREE.Color('#23967f')
    const tmp = new THREE.Color()

    let i = 0
    for (let x = 0; x < COLS; x++) {
      for (let y = 0; y < ROWS; y++) {
        const gx = (x - COLS / 2) * GAP
        const gy = (y - ROWS / 2) * GAP
        positions[i * 3] = gx
        positions[i * 3 + 1] = gy
        positions[i * 3 + 2] = 0
        grid[i * 2] = gx
        grid[i * 2 + 1] = gy
        tmp.copy(gold).lerp(teal, x / COLS)
        colors[i * 3] = tmp.r
        colors[i * 3 + 1] = tmp.g
        colors[i * 3 + 2] = tmp.b
        seeds[i] = Math.random() * Math.PI * 2
        i++
      }
    }
    return { positions, colors, seeds, grid }
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const smooth = useRef({ x: 0, y: 0, p: 0 })

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const points = pointsRef.current
    if (!points) return

    const s = smooth.current
    s.x += (pointer.current.x - s.x) * 0.05
    s.y += (pointer.current.y - s.y) * 0.05
    s.p += (scroll.current - s.p) * 0.12
    const e = s.p * s.p * (3 - 2 * s.p) // smoothstep ease of scroll progress

    const pos = points.geometry.attributes.position
    const halfW = (COLS * GAP) / 2
    const halfH = (ROWS * GAP) / 2

    for (let k = 0; k < COUNT; k++) {
      const gx = grid[k * 2]
      const gy = grid[k * 2 + 1]

      // shape A — waving plane
      const wz =
        Math.sin(gx * 0.45 + t) * 0.6 +
        Math.cos(gy * 0.4 + t * 0.9) * 0.6 +
        Math.sin((gx + gy) * 0.25 + seeds[k]) * 0.35

      // shape B — rotating tunnel: columns wrap into a ring, rows run into depth
      const angle = ((gx + halfW) / (halfW * 2)) * Math.PI * 2 + t * 0.18 + gy * 0.04
      const radius = 4.4 + Math.sin(gy * 0.6 + t * 1.4 + seeds[k]) * 0.35
      const tx = Math.cos(angle) * radius
      const ty = Math.sin(angle) * radius
      const tz = ((gy + halfH) / (halfH * 2)) * -34 + 4 + ((t * 2.4 + seeds[k]) % 2) * e

      pos.array[k * 3] = gx * (1 - e) + tx * e
      pos.array[k * 3 + 1] = gy * (1 - e) + ty * e
      pos.array[k * 3 + 2] = wz * (1 - e) + tz * e
    }
    pos.needsUpdate = true

    // plane tilt eases out as the tunnel forms; slow barrel roll inside it
    points.rotation.x = (-0.9 + s.y * 0.12) * (1 - e)
    points.rotation.z = s.x * 0.12 * (1 - e) + t * 0.06 * e

    camera.position.x = s.x * 1.2 * (1 - e * 0.7)
    camera.position.y = -s.y * 0.8 * (1 - e * 0.7)
    camera.position.z = 14 - e * 12.5 // fly into the tunnel mouth
    camera.lookAt(0, 0, e * -20) // look down the tunnel as it forms

    // Fade out over the last stretch of the runway, keyed to the raw scroll
    // value rather than the eased one so it always reaches 0 by the time the
    // stage unpins and the next section takes over.
    const fade = Math.min(Math.max((scroll.current - 0.82) / 0.18, 0), 1)
    gl.domElement.style.opacity = String(1 - fade)
  })

  return (
    <points ref={pointsRef} rotation-x={-0.9}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.085}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

export default function Hero() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches

  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const contentRef = useRef(null)
  const progress = useRef(0)
  // pause the render loop once the stage has scrolled out of view
  const [live, setLive] = useState(true)

  useEffect(() => {
    if (reduced) return

    const onScroll = () => {
      const hero = heroRef.current
      const stage = stageRef.current
      if (!hero || !stage) return

      // How far the sticky stage can travel inside the hero. Derived from the
      // real box heights so it stays correct whatever the CSS runway is.
      const travel = hero.offsetHeight - stage.offsetHeight
      const p = travel > 0 ? Math.min(Math.max(-hero.getBoundingClientRect().top / travel, 0), 1) : 0
      progress.current = p

      // Copy clears out early so the tunnel has the frame to itself.
      const content = contentRef.current
      if (content) {
        const f = Math.min(p / 0.42, 1)
        content.style.opacity = String(1 - f)
        content.style.transform = `translate3d(0, ${-f * 70}px, 0)`
        // don't let invisible copy swallow clicks over the tunnel
        content.style.pointerEvents = f > 0.85 ? 'none' : ''
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    const io = new IntersectionObserver(
      ([entry]) => setLive(entry.isIntersecting),
      { rootMargin: '10% 0px' }
    )
    io.observe(stageRef.current)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      io.disconnect()
    }
  }, [reduced])

  return (
    <section id="intro" className={reduced ? 'hero' : 'hero hero--motion'} ref={heroRef}>
      <div className="hero-stage" ref={stageRef}>
        {!reduced && (
          <Canvas
            className="hero-canvas"
            camera={{ position: [0, 0, 14], fov: 60 }}
            /* additive blending is fill-rate bound, so don't render a phone's
               full 3x density for it */
            dpr={[1, small ? 1.5 : 2]}
            gl={{ alpha: true, antialias: true }}
            frameloop={live ? 'always' : 'never'}
          >
            <ParticleField scroll={progress} />
          </Canvas>
        )}

        <div className="hero-content" ref={contentRef}>
          <div className="wrap">
            <div className="hero-eyebrow">Founder &amp; Fullstack Engineer · Nigeria</div>
            <h1>
              I&rsquo;m Temiloluwa Gboyega.
              <br />
              I build <em>secure, fast</em>
              <br />
              web experiences.
            </h1>
            <p className="hero-sub">
              Fullstack engineer with <b>3 years</b> shipping responsive, user-focused web
              applications across <b>fintech, e-commerce and social platforms</b>. Now building{' '}
              <b>Abode</b> — trust infrastructure for Nigeria&rsquo;s domestic workforce.
            </p>
            <div className="hero-actions">
              <a href="#work" className="btn btn--primary">
                View my work
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
              <a href="/Temiloluwa_Gboyega_Resume.pdf" className="btn" download>
                Download résumé
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v13M7 12l5 5 5-5M5 21h14" />
                </svg>
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <div className="num">4+</div>
                <div className="lbl">Years building</div>
              </div>
              <div className="stat">
                <div className="num">8</div>
                <div className="lbl">Shipped projects</div>
              </div>
              <div className="stat">
                <div className="num">1</div>
                <div className="lbl">Company founded</div>
              </div>
            </div>
          </div>

          <div className="hero-social">
            <a href="https://www.linkedin.com/in/temiloluwa-gboyega-5212632b1/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href="https://github.com/Temiloluwagboyega" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
          <a href="#about" className="scroll-hint">
            Scroll
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
