/* ===================================================================
 * Temiloluwa Gboyega — Portfolio interactions
 * Three.js interactive particle field + UI behaviour
 * =================================================================== */
import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------- Preloader */
window.addEventListener("load", () => {
    const pl = document.getElementById("preloader");
    if (pl) setTimeout(() => pl.classList.add("done"), 350);
    document.body.classList.add("loaded");
});

/* -------------------------------------------------- Header scroll state */
const header = document.querySelector(".site-header");
const onScrollHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
onScrollHeader();
window.addEventListener("scroll", onScrollHeader, { passive: true });

/* -------------------------------------------------- Mobile menu */
const toggle = document.querySelector(".nav-toggle");
const links = document.querySelectorAll(".nav-links a");
if (toggle) {
    toggle.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
        toggle.setAttribute("aria-expanded", document.body.classList.contains("menu-open"));
    });
    links.forEach((a) => a.addEventListener("click", () => document.body.classList.remove("menu-open")));
}

/* -------------------------------------------------- Scroll reveal */
const revealEls = document.querySelectorAll("[data-reveal]");
if (prefersReduced) {
    revealEls.forEach((el) => el.classList.add("in"));
} else {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
}

/* -------------------------------------------------- Scrollspy */
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links li[data-nav]");
const spy = new IntersectionObserver(
    (entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                const id = e.target.id;
                navItems.forEach((li) => li.classList.toggle("current", li.dataset.nav === id));
            }
        });
    },
    { threshold: 0.5 }
);
sections.forEach((s) => spy.observe(s));

/* -------------------------------------------------- Three.js particle field */
(function heroField() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas || prefersReduced) return;

    const hero = document.querySelector(".hero");
    let width = hero.clientWidth;
    let height = hero.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 14;

    // Particle grid arranged on a plane, gently waving.
    const COLS = 120;
    const ROWS = 70;
    const GAP = 0.42;
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    const cyan = new THREE.Color(0x22d3ee);
    const violet = new THREE.Color(0x8b5cf6);
    const tmp = new THREE.Color();

    let i = 0;
    for (let x = 0; x < COLS; x++) {
        for (let y = 0; y < ROWS; y++) {
            const px = (x - COLS / 2) * GAP;
            const py = (y - ROWS / 2) * GAP;
            positions[i * 3] = px;
            positions[i * 3 + 1] = py;
            positions[i * 3 + 2] = 0;
            const t = x / COLS;
            tmp.copy(cyan).lerp(violet, t);
            colors[i * 3] = tmp.r;
            colors[i * 3 + 1] = tmp.g;
            colors[i * 3 + 2] = tmp.b;
            seeds[i] = Math.random() * Math.PI * 2;
            i++;
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.085,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    const points = new THREE.Points(geo, mat);
    points.rotation.x = -0.9;
    scene.add(points);

    // Pointer parallax
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener("pointermove", (e) => {
        pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    const posAttr = geo.getAttribute("position");
    let t = 0;
    let running = true;
    let raf;

    function animate() {
        if (!running) return;
        raf = requestAnimationFrame(animate);
        t += 0.012;

        for (let k = 0; k < count; k++) {
            const px = posAttr.array[k * 3];
            const py = posAttr.array[k * 3 + 1];
            const wave =
                Math.sin(px * 0.45 + t) * 0.6 +
                Math.cos(py * 0.4 + t * 0.9) * 0.6 +
                Math.sin((px + py) * 0.25 + seeds[k]) * 0.35;
            posAttr.array[k * 3 + 2] = wave;
        }
        posAttr.needsUpdate = true;

        pointer.x += (pointer.tx - pointer.x) * 0.05;
        pointer.y += (pointer.ty - pointer.y) * 0.05;
        points.rotation.z = pointer.x * 0.12;
        points.rotation.x = -0.9 + pointer.y * 0.12;
        camera.position.x = pointer.x * 1.2;
        camera.position.y = -pointer.y * 0.8;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }
    animate();

    function resize() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }
    window.addEventListener("resize", resize);

    // Pause when hero off-screen or tab hidden (perf + battery)
    const vis = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            running = e.isIntersecting && !document.hidden;
            if (running && !raf) animate();
            else if (!running) { cancelAnimationFrame(raf); raf = null; }
        });
    }, { threshold: 0 });
    vis.observe(hero);

    document.addEventListener("visibilitychange", () => {
        running = !document.hidden && hero.getBoundingClientRect().bottom > 0;
        if (running) animate();
        else { cancelAnimationFrame(raf); raf = null; }
    });
})();

/* -------------------------------------------------- Footer year */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
