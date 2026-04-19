/* ═══════════════════════════════════════════
   HEADVENTOR — main.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
});

/* ══════════════════════════════════════════
   LOADER
══════════════════════════════════════════ */
function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  if (!loader || !fill) { bootPage(); return; }

  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(interval); }
    fill.style.width = pct + '%';
    if (pct === 100) {
      setTimeout(() => {
        gsap.to(loader, {
          opacity: 0,
          duration: 0.7,
          ease: 'power2.inOut',
          onComplete: () => {
            loader.style.display = 'none';
            document.body.classList.remove('is-loading');
            bootPage();
          }
        });
      }, 300);
    }
  }, 80);
}

/* ══════════════════════════════════════════
   BOOT — everything that runs after loader
══════════════════════════════════════════ */
function bootPage() {
  initScrollProgress();
  initNav();
  initHamburger();
  initCanvas();
  initHeroEntrance();
  initHeroParallax();
  initTypewriter();
  initMagnetic();
  initContactForm();
  initScrollAnimations();
}

/* ══════════════════════════════════════════
   NAV — scroll behaviour + spy
══════════════════════════════════════════ */
function initNav() {
  const nav  = document.getElementById('nav');
  const links = document.querySelectorAll('.nav-lnk');

  // Scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Scroll spy
  const sections = document.querySelectorAll('section[id]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav-lnk[href="#${e.target.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => spy.observe(s));
}

/* ══════════════════════════════════════════
   HAMBURGER / MOBILE MENU
══════════════════════════════════════════ */
function initHamburger() {
  const burger  = document.getElementById('burger');
  const overlay = document.getElementById('mob-overlay');
  const links   = document.querySelectorAll('.mob-lnk');
  if (!burger || !overlay) return;

  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      gsap.from('.mob-lnk', { y: 30, opacity: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    }
  });

  links.forEach(l => l.addEventListener('click', () => {
    overlay.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ══════════════════════════════════════════
   HERO CANVAS — Aurora + Particles
══════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes = [];
  const GOLD = [255, 184, 0];
  const AMBER = [255, 140, 20];
  const LIGHT = [255, 220, 100];
  const NODE_COUNT = 48;
  const MAX_DIST = 155;
  let mouse = { x: 0.5, y: 0.5 };

  // Aurora blobs
  const blobs = [
    { x: 0.25, y: 0.45, r: 0.38, col: GOLD,  speed: 0.00028, phase: 0 },
    { x: 0.75, y: 0.40, r: 0.32, col: AMBER, speed: 0.00022, phase: Math.PI },
    { x: 0.50, y: 0.20, r: 0.26, col: LIGHT, speed: 0.00038, phase: Math.PI / 2 },
    { x: 0.20, y: 0.75, r: 0.22, col: GOLD,  speed: 0.00031, phase: Math.PI * 1.4 },
    { x: 0.80, y: 0.70, r: 0.20, col: AMBER, speed: 0.00025, phase: Math.PI * 0.7 },
  ];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    spawnNodes();
  }

  function spawnNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.4 + 0.6,
    }));
  }

  function drawAurora(t) {
    blobs.forEach(b => {
      const mx = mouse.x - 0.5;
      const my = mouse.y - 0.5;
      const bx = (b.x + mx * 0.06 + Math.sin(t * b.speed + b.phase) * 0.14) * W;
      const by = (b.y + my * 0.06 + Math.cos(t * b.speed * 1.2 + b.phase) * 0.10) * H;
      const br = b.r * Math.max(W, H);
      const g  = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0.055)`);
      g.addColorStop(1, `rgba(${b.col[0]},${b.col[1]},${b.col[2]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
  }

  function drawNodes() {
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,184,0,${0.14 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,184,0,0.5)';
      ctx.fill();
    });
  }

  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    drawAurora(t);
    drawNodes();
    requestAnimationFrame(frame);
  }

  resize();
  requestAnimationFrame(frame);

  window.addEventListener('resize', resize);
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = e.clientY / window.innerHeight;
  }, { passive: true });
}

/* ══════════════════════════════════════════
   HERO ENTRANCE (GSAP)
══════════════════════════════════════════ */
function initHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-eyebrow',    { opacity: 1, y: 0, duration: 0.7, delay: 0.1 })
    .to('.hero-h1',         { opacity: 1, y: 0, duration: 0.8 }, '-=0.4')
    .to('.hero-body',       { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-actions',    { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
    .to('.hero-scroll',     { opacity: 1,        duration: 0.5 }, '-=0.3')
    .to('.hero-ghost',      { opacity: 1,        duration: 1.2 }, '-=0.6');

  // Set initial states
  gsap.set(['.hero-h1', '.hero-body', '.hero-actions'], { y: 30 });
  gsap.set('.hero-ghost', { opacity: 0 });
}

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('tw-el');
  if (!el) return;
  const text = "invent what's next";
  let i = 0;

  function tick() {
    el.textContent = text.slice(0, i++);
    if (i <= text.length) setTimeout(tick, i === 1 ? 900 : 62);
  }
  setTimeout(tick, 1200);
}

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════ */
function initMagnetic() {
  if (window.matchMedia('(hover: none)').matches) return;

  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const dx  = e.clientX - (r.left + r.width / 2);
      const dy  = e.clientY - (r.top  + r.height / 2);
      gsap.to(el, { x: dx * 0.28, y: dy * 0.28, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' });
    });
  });
}

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS (GSAP ScrollTrigger)
══════════════════════════════════════════ */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const defaults = { ease: 'power3.out', duration: 0.85 };

  function reveal(selector, vars, triggerEl) {
    document.querySelectorAll(selector).forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: triggerEl || el, start: 'top 88%' },
        ...defaults,
        ...vars,
      });
    });
  }

  // Section tags
  reveal('.sec-tag', { opacity: 0, x: -24 });

  // About
  gsap.from('.about-left h2', {
    scrollTrigger: { trigger: '.about-sec', start: 'top 80%' },
    opacity: 0, x: -40, duration: 1, ease: 'power3.out',
  });
  gsap.from('.about-right', {
    scrollTrigger: { trigger: '.about-sec', start: 'top 80%' },
    opacity: 0, x: 40, duration: 1, ease: 'power3.out', delay: 0.15,
  });

  // Services heading
  gsap.from('.services-sec .sec-h2', {
    scrollTrigger: { trigger: '.services-sec', start: 'top 82%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
  });

  // Service rows — stagger
  gsap.from('.svc-row', {
    scrollTrigger: { trigger: '.svc-list', start: 'top 82%' },
    opacity: 0, y: 30, stagger: 0.12, duration: 0.75, ease: 'power3.out',
  });

  // Metrics
  gsap.from('.metric-item', {
    scrollTrigger: { trigger: '.metrics-band', start: 'top 85%' },
    opacity: 0, y: 24, stagger: 0.1, duration: 0.7, ease: 'power3.out',
  });

  // GCC heading
  gsap.from('.gcc-head', {
    scrollTrigger: { trigger: '.gcc-sec', start: 'top 82%' },
    opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
  });

  // GCC cards
  gsap.from('.gcc-card', {
    scrollTrigger: { trigger: '.gcc-grid', start: 'top 85%' },
    opacity: 0, y: 40, scale: 0.97, stagger: 0.12, duration: 0.8, ease: 'power3.out',
  });

  // Approach heading
  gsap.from('.approach-sec .sec-h2', {
    scrollTrigger: { trigger: '.approach-sec', start: 'top 82%' },
    opacity: 0, y: 28, duration: 0.75, ease: 'power3.out',
  });

  // Approach steps
  gsap.from('.ap-step', {
    scrollTrigger: { trigger: '.approach-grid', start: 'top 85%' },
    opacity: 0, y: 36, stagger: 0.12, duration: 0.75, ease: 'power3.out',
  });

  // Testimonial
  gsap.from('.testi-card', {
    scrollTrigger: { trigger: '.testimonial-band', start: 'top 85%' },
    opacity: 0, y: 32, duration: 0.85, ease: 'power3.out',
  });

  // CTA
  gsap.from('.cta-left', {
    scrollTrigger: { trigger: '.cta-sec', start: 'top 82%' },
    opacity: 0, x: -40, duration: 0.9, ease: 'power3.out',
  });
  gsap.from('.cta-right', {
    scrollTrigger: { trigger: '.cta-sec', start: 'top 82%' },
    opacity: 0, x: 40, duration: 0.9, ease: 'power3.out', delay: 0.1,
  });

  // Marquee pause on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.marquee-row').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  }
}

/* ══════════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((window.scrollY / max) * 100) + '%';
  }, { passive: true });
}

/* ══════════════════════════════════════════
   HERO PARALLAX
══════════════════════════════════════════ */
function initHeroParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const heroEl = document.querySelector('.hero');
  if (!heroEl) return;

  // Ghost text drifts up faster than scroll
  gsap.to('.hero-ghost', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
    y: -140,
    ease: 'none',
  });

  // Canvas drifts at half speed (depth illusion)
  gsap.to('#hero-canvas', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 },
    y: -70,
    ease: 'none',
  });

  // Hero content drifts slightly (natural exit)
  gsap.to('.hero-inner', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    y: -50,
    ease: 'none',
  });

  // Scroll hint fades as you scroll
  gsap.to('.hero-scroll', {
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '25% top', scrub: true },
    opacity: 0,
    ease: 'none',
  });
}

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btnLabel = document.getElementById('form-btn-label');
  const status  = document.getElementById('form-status');
  const btn     = document.getElementById('form-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    // Basic client-side validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      }
    });
    if (!valid) {
      status.className = 'form-status error';
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    // Email format check
    const emailEl = document.getElementById('f-email');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.classList.add('error');
      status.className = 'form-status error';
      status.textContent = 'Please enter a valid email address.';
      return;
    }

    // Submit
    btnLabel.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = '✓ Message sent — we\'ll be in touch shortly.';
        form.reset();
        btnLabel.textContent = 'Sent!';
        setTimeout(() => {
          btnLabel.textContent = 'Send Message';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('server error');
      }
    } catch {
      status.className = 'form-status error';
      status.textContent = 'Something went wrong. Please email us directly at info@headventor.com';
      btnLabel.textContent = 'Send Message';
      btn.disabled = false;
    }
  });
}
