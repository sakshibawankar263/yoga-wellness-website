'use strict';

/* ── State ───────────────────────────────────────────────────── */
const STATE = {
  currentSection: 's-loading',
  sections: ['s-identity','s-personality','s-evidence','s-code','s-terminal','s-report','s-button','s-ending'],
  cardFlipped: false,
  identityRevealed: false,
  personalityAnimated: false,
  evidenceAnimated: false,
  codeCompiled: false,
  reportAnimated: false,
  mx: 0, my: 0
};

/* ── DOM helpers ────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ================================================================
   CURSOR
================================================================ */
const cursor      = $('#cursor');
const cursorParts = $('#cursor-particles');
let lastX = 0, lastY = 0;

document.addEventListener('mousemove', (e) => {
  STATE.mx = e.clientX;
  STATE.my = e.clientY;
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';

  // Trail particles
  const dx = e.clientX - lastX, dy = e.clientY - lastY;
  if (Math.abs(dx) + Math.abs(dy) > 6) {
    spawnCursorParticle(e.clientX, e.clientY);
    lastX = e.clientX; lastY = e.clientY;
  }
});

document.addEventListener('click', (e) => {
  for (let i = 0; i < 6; i++) spawnCursorParticle(e.clientX, e.clientY, true);
  createClickRipple(e.clientX, e.clientY);
});

function spawnCursorParticle(x, y, burst = false) {
  const p = document.createElement('div');
  p.className = 'cursor-particle';
  const tx = (Math.random() - 0.5) * (burst ? 50 : 20);
  const ty = (Math.random() - 0.5) * (burst ? 50 : 20);
  p.style.cssText = `left:${x}px;top:${y}px;--tx:${tx}px;--ty:${ty}px`;
  cursorParts.appendChild(p);
  setTimeout(() => p.remove(), 600);
}

function createClickRipple(x, y) {
  const r = document.createElement('div');
  r.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:0;height:0;
    border-radius:50%;border:2px solid rgba(0,184,255,0.6);
    transform:translate(-50%,-50%);pointer-events:none;z-index:9997;
    animation:click-ripple 0.5s ease-out forwards`;
  document.body.appendChild(r);
  if (!document.getElementById('click-ripple-style')) {
    const s = document.createElement('style');
    s.id = 'click-ripple-style';
    s.textContent = '@keyframes click-ripple{to{width:60px;height:60px;opacity:0}}';
    document.head.appendChild(s);
  }
  setTimeout(() => r.remove(), 500);
}

// Hover state
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('button, .ev-card, .answer-card, .term-sugg, .nav-dot, .card-wrapper'))
    document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.matches('button, .ev-card, .answer-card, .term-sugg, .nav-dot, .card-wrapper'))
    document.body.classList.remove('cursor-hover');
});

/* ================================================================
   BACKGROUND CANVAS — PARTICLES + GRID
================================================================ */
class BackgroundRenderer {
  constructor(canvasId, opts = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx    = this.canvas.getContext('2d');
    this.opts   = { accent: '#00b8ff', particleCount: 60, ...opts };
    this.particles = [];
    this.raf    = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    this.start();
  }
  resize() {
    if (!this.canvas) return;
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  initParticles() {
    this.particles = [];
    const n = this.opts.particleCount;
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  start() {
    const draw = (t = 0) => {
      this.raf = requestAnimationFrame(draw);
      const { ctx, canvas } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.drawGrid(t);
      this.drawParticles(t);
      this.drawFog(t);
    };
    draw();
  }
  drawGrid(t) {
    const { ctx, canvas } = this;
    const sz  = 50;
    const off = (t * 0.01) % sz;
    ctx.strokeStyle = 'rgba(0,184,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = -sz + off; x < canvas.width + sz; x += sz) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = -sz + off; y < canvas.height + sz; y += sz) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }
    // Scanlines
    ctx.fillStyle = 'rgba(0,0,0,0.04)';
    for (let y = 0; y < canvas.height; y += 3) {
      ctx.fillRect(0, y, canvas.width, 1);
    }
  }
  drawParticles(t) {
    const { ctx, canvas, opts } = this;
    const hex = opts.accent;
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      const alpha = p.o * (0.7 + 0.3 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hex + Math.round(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();

      // Connect nearby
      this.particles.forEach(q => {
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = hex + Math.round((1 - dist/100) * 0.08 * 255).toString(16).padStart(2,'0');
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }
  drawFog(t) {
    const { ctx, canvas, opts } = this;
    const x = canvas.width * 0.5 + Math.sin(t * 0.0005) * 100;
    const y = canvas.height * 0.5 + Math.cos(t * 0.0004) * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * 0.6);
    grad.addColorStop(0, opts.accent + '08');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  stop() { if (this.raf) cancelAnimationFrame(this.raf); }
}

/* Init global background */
const globalBg = new BackgroundRenderer('bg-canvas', { accent: '#00b8ff', particleCount: 50 });
const sectionBgs = {};

/* ================================================================
   SECTION TRANSITION ENGINE
================================================================ */
function showSection(id, label = 'ACCESSING...') {
  const overlay = $('#transition-overlay');
  const text    = $('#transition-text');
  text.textContent = label;
  overlay.classList.add('active');

  setTimeout(() => {
    // Hide current
    $$('.section').forEach(s => {
      s.classList.remove('section--active');
      s.style.pointerEvents = 'none';
    });

    const target = document.getElementById(id);
    if (!target) return;
    target.classList.add('section--active');
    target.style.pointerEvents = 'all';
    STATE.currentSection = id;

    // Always start every section from the top
window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});

    // Spawn section background
    const bgMap = {
      's-identity':    { canvas: 'bg-canvas-2', accent: '#00b8ff' },
      's-personality': { canvas: 'bg-canvas-3', accent: '#9b5cf6' },
      's-evidence':    { canvas: 'bg-canvas-4', accent: '#00e5a0' },
      's-code':        { canvas: 'bg-canvas-5', accent: '#f59e0b' },
      's-terminal':    { canvas: 'bg-canvas-6', accent: '#00e5a0' },
      's-report':      { canvas: 'bg-canvas-7', accent: '#00b8ff' },
      's-button':      { canvas: 'bg-canvas-8', accent: '#ff4444' }
    };
    if (bgMap[id] && !sectionBgs[id]) {
      sectionBgs[id] = new BackgroundRenderer(bgMap[id].canvas, { accent: bgMap[id].accent, particleCount: 40 });
    }

    // Update nav dots
    updateNavDots(id);

    overlay.classList.remove('active');
    onSectionEnter(id);
  }, 600);
}

function updateNavDots(activeId) {
  const nav = $('#nav-dots');
  const sectionOrder = STATE.sections.filter(s => s !== 's-ending');
  if (activeId === 's-loading' || activeId === 's-ending') {
    nav.classList.remove('visible');
    return;
  }
  nav.classList.add('visible');
  $$('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('nav-dot--active', sectionOrder[i] === activeId);
  });
}

// Nav dot clicks
$$('.nav-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const sec = dot.dataset.section;
    const labels = {
      's-identity':    'LOADING IDENTITY FILE...',
      's-personality': 'LOADING BEHAVIORAL DATA...',
      's-evidence':    'ACCESSING EVIDENCE ROOM...',
      's-code':        'LOADING CHALLENGE...',
      's-terminal':    'CONNECTING TO TERMINAL...',
      's-report':      'COMPILING REPORT...',
      's-button':      'FINAL DIRECTIVE LOADING...'
    };
    showSection(sec, labels[sec] || 'ACCESSING...');
  });
});

/* ================================================================
   SECTION ENTER CALLBACKS
================================================================ */
function onSectionEnter(id) {
  switch (id) {
    case 's-identity':    enterIdentity(); break;
    case 's-personality': enterPersonality(); break;
    case 's-evidence':    enterEvidence(); break;
    case 's-code':        enterCode(); break;
    case 's-terminal':    enterTerminal(); break;
    case 's-report':      enterReport(); break;
    case 's-button':      enterButton(); break;
    case 's-ending':      enterEnding(); break;
  }
}

/* ================================================================
   UTILITY — Show button with animation
================================================================ */
function showBtn(id) {
  const btn = document.getElementById(id);
  if (btn) btn.classList.add('visible');
}

/* ================================================================
   CARD 3D MOUSE PARALLAX (IDENTITY CARD)
================================================================ */
document.addEventListener('mousemove', (e) => {
  if (STATE.currentSection === 's-identity') {
    const card = $('#card-wrapper');
    if (card && card.classList.contains('flipped')) {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / (window.innerHeight / 2)) * 8;
      const ry   = -((e.clientX - cx) / (window.innerWidth  / 2)) * 8;
      card.style.transform = `rotateY(180deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  }
});

/* ================================================================
   SECTION 8 DANGER BUTTON — orbit speed on hover
================================================================ */
document.addEventListener('mousemove', () => {
  if (STATE.currentSection !== 's-button') return;
  const btn = $('#danger-btn');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top  + rect.height / 2;
  const dist = Math.hypot(STATE.mx - cx, STATE.my - cy);
  const maxDist = 200;
  const speed = Math.max(0, 1 - dist / maxDist);
  $$('.orbit-ring').forEach((ring, i) => {
    const baseDur = [12, 8, 5][i];
    ring.style.animationDuration = (baseDur * (1 - speed * 0.7)) + 's';
  });
});

/* ================================================================
   MAGNETIC BUTTONS
================================================================ */
$$('.cta-btn, .danger-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) * 0.2;
    const dy   = (e.clientY - cy) * 0.2;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ================================================================
   KEYBOARD NAVIGATION
================================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    const sec  = STATE.currentSection;
    const list = STATE.sections;
    const idx  = list.indexOf(sec);
    if (idx < list.length - 2) {
      const next = list[idx + 1];
      const labels = {
        's-personality': 'LOADING BEHAVIORAL DATA...',
        's-evidence':    'ACCESSING EVIDENCE ROOM...',
        's-code':        'LOADING CHALLENGE...',
        's-terminal':    'CONNECTING TO TERMINAL...',
        's-report':      'COMPILING REPORT...',
        's-button':      'FINAL DIRECTIVE...'
      };
      showSection(next, labels[next] || 'ACCESSING...');
    }
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    const sec  = STATE.currentSection;
    const list = STATE.sections;
    const idx  = list.indexOf(sec);
    if (idx > 0) {
      const prev   = list[idx - 1];
      showSection(prev, 'ACCESSING...');
    }
  }
});

/* ================================================================
   SOUND PLACEHOLDERS
   (Uncomment and implement when audio files are added)
================================================================ */
// function playSound(id) {
//   const el = document.getElementById('snd-' + id);
//   if (el) { el.currentTime = 0; el.play().catch(() => {}); }
// }
// document.querySelectorAll('[data-sound]').forEach(el => {
//   el.addEventListener('click', () => playSound(el.dataset.sound));
// });

/* ================================================================
   INIT — Final setup on DOM ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Hide nav until past loading
  $('#nav-dots').classList.remove('visible');

  // Remove any pre-existing visible buttons (they should appear dynamically)
  $$('.cta-btn').forEach(btn => btn.classList.remove('visible'));
});
document.addEventListener("click", function (e) {

    if (e.target.id === "archive-close") {

        document
            .getElementById("archive-view")
            .classList.add("hidden");

    }

});