/* ============================================================
   Sania Jawed — Data Analyst & Power BI Developer
   Portfolio JavaScript
   ============================================================
   Table of Contents:
   1. Loader
   2. Custom Cursor (auto-disabled on touch devices)
   3. Navbar / Mobile Menu
   4. Particle Canvas Background
   5. Typing Animation
   6. Counter Animation
   7. Intersection Observers (reveal + counters)
   8. Project Filtering
   9. Modal Data & Open/Close
   10. Skill Info Toast
   11. Ripple Effect
   12. 3D Tilt on Project Cards
   13. Contact Form Submit
   14. Smooth Scroll
   ============================================================ */

/* ============================================
   TOUCH DEVICE DETECTION
   (disables the custom cursor UI on touch/mobile
   devices so the default pointer works correctly)
============================================ */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouchDevice) {
  document.documentElement.classList.add('touch-device');
}

/* ============================================
   LOADER
============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ============================================
   CUSTOM CURSOR
============================================ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .project-card, .skill-card, .service-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ============================================
   NAVBAR
============================================ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
});

function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* ============================================
   PARTICLES
============================================ */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.4 + 0.1;
    this.color = Math.random() > 0.6 ? '#1F6FDB' : Math.random() > 0.5 ? '#7C3AED' : '#58B1A7';
  }
  update() {
    this.x += this.speedX; this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 80; i++) particles.push(new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = '#1F6FDB';
        ctx.globalAlpha = 0.06 * (1 - dist/100);
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================================
   TYPING ANIMATION
============================================ */
const typedEl = document.getElementById('typed-text');
const phrases = [
  'Power BI Developer', 'Data Analyst', 'Product Analytics Specialist',
  'Data Visualization Expert', 'Dashboard Designer', 'Business Intelligence Analyst'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
  const current = phrases[phraseIdx];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIdx--)
    : current.substring(0, charIdx++);
  const speed = isDeleting ? 50 : 80;
  if (!isDeleting && charIdx > current.length) {
    setTimeout(() => { isDeleting = true; typeLoop(); }, 2000);
    return;
  }
  if (isDeleting && charIdx < 0) {
    isDeleting = false;
    phraseIdx = (phraseIdx + 1) % phrases.length;
    setTimeout(typeLoop, 400);
    return;
  }
  setTimeout(typeLoop, speed);
}
setTimeout(typeLoop, 1200);

/* ============================================
   COUNTER ANIMATION
============================================ */
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  let current = 0;
  const step = Math.ceil(target / 40);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (el.parentElement.classList.contains('hero-stat') ? '+' : '+');
    if (current >= target) clearInterval(interval);
  }, 40);
}

/* ============================================
   INTERSECTION OBSERVER (reveal + counters)
============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Counter
      entry.target.querySelectorAll('.counter, [data-count]').forEach(animateCounter);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Hero counters
const heroStatObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      heroStatObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.hero-stats').forEach(el => heroStatObserver.observe(el));

/* ============================================
   PROJECT FILTERING
============================================ */
function filterProjects(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.project-card').forEach(card => {
    const cardCat = card.dataset.cat || '';
    if (cat === 'all' || cardCat.includes(cat)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

/* ============================================
   MODAL DATA
============================================ */
const modalData = {
  proj1: {
    emoji: '🛒', cat: 'Power BI · DataBuzz June 2026',
    title: 'UK E-Commerce Conversion & Sales Analytics',
    desc: 'A 6-page Power BI competition dashboard analyzing 10,000 orders across a 13-table star schema. Built for the DataBuzz June 2026 Challenge, this project involved deep competitive analysis — reverse-engineering previous winning dashboards, running Python/pandas analysis to extract headline metrics, and resolving complex DAX issues including circular dependencies and dual-relationship filter context collisions.',
    kpis: [{v:'10K', l:'Orders'}, {v:'6 Pages', l:'Dashboard'}, {v:'13 Tables', l:'Star Schema'}, {v:'8.8/10', l:'Est. Score'}],
    problem: 'Multi-table star schema with complex filter context requirements, device-type segmentation, and conversion funnel analytics spanning 6 report pages.',
    solution: 'Reverse-engineered competition-winning approaches, built a Python/pandas data profiling pipeline first, then constructed the Power BI model with carefully managed bidirectional relationships and advanced DAX for time-intelligent metrics.',
    tools: ['Power BI', 'DAX', 'Python', 'pandas', 'SQL', 'Power Query'],
    gh: 'https://github.com/saniajawed'
  },
  proj2: {
    emoji: '🏥', cat: 'Power BI · FP20 Challenge 38',
    title: 'Code Blue — Emergency Operations Dashboard',
    desc: 'A dual-deliverable project: a 3-page Power BI dashboard and a full HTML/CSS/Chart.js web version, both analyzing 9,994 patient visits across 11 UK hospitals. Built for FP20 Analytics Challenge 38, this was the first time building an HTML dashboard from scratch — learned web development to complement the Power BI portfolio.',
    kpis: [{v:'9,994', l:'Patient Visits'}, {v:'11', l:'Hospitals'}, {v:'2', l:'Deliverables'}, {v:'FP20', l:'Challenge'}],
    problem: 'Blank readmission risk labels in DAX, ZoomCharts configuration challenges, data mismatch in summary card, and the need to reproduce the visualization in HTML/JS without prior web development knowledge.',
    solution: 'Resolved all DAX blank-label issues via conditional IF logic and ISBLANK() guards. Learned HTML, CSS, Chart.js from scratch to build the web version with glassmorphism design and animated KPI cards.',
    tools: ['Power BI', 'DAX', 'ZoomCharts', 'HTML', 'CSS', 'JavaScript', 'Chart.js'],
    gh: 'https://github.com/saniajawed'
  },
  proj3: {
    emoji: '🍺', cat: 'Power BI · ZoomCharts Competition',
    title: 'F&B Supply Chain — ZoomCharts 4U Report',
    desc: 'A 4-page competition Power BI dashboard strategy for a food & beverage supply chain scenario. Built with detailed visual specifications, a comprehensive DAX/implementation roadmap, and ZoomCharts Drill Down PRO visuals for supply chain KPI analysis.',
    kpis: [{v:'4', l:'Report Pages'}, {v:'ZC Pro', l:'Drill Down'}, {v:'F&B', l:'Domain'}],
    problem: 'Supply chain KPI visibility across distribution tiers with drill-through requirements and multi-dimension filtering using ZoomCharts custom visuals.',
    solution: 'Designed a phased implementation roadmap starting with data model architecture, then DAX measures layer, then visual layer using ZoomCharts Drill Down PRO for interactive drill paths.',
    tools: ['Power BI', 'DAX', 'ZoomCharts', 'Power Query', 'Star Schema Design'],
    gh: 'https://github.com/saniajawed'
  },
  proj4: {
    emoji: '💻', cat: 'HTML · CSS · JavaScript',
    title: 'Code Blue — HTML Dashboard',
    desc: 'First full web development project — built from zero knowledge of HTML, CSS, and JavaScript. A complete web-based dashboard version of the Code Blue emergency operations analytics, featuring glassmorphism design, animated KPI cards, and Chart.js-powered visualizations that match the Power BI version.',
    kpis: [{v:'0→1', l:'Self-taught'}, {v:'100%', l:'Handcoded'}, {v:'Glass', l:'Design System'}],
    problem: 'Persistent chart rendering issues, CSS z-index conflicts in glassmorphism layering, and Chart.js initialization timing bugs.',
    solution: 'Systematic debugging of rendering pipeline — resolved canvas initialization order, added DOMContentLoaded guards, and used ResizeObserver to handle responsive chart redraws.',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'Glassmorphism', 'CSS Animations'],
    gh: 'https://github.com/saniajawed'
  },
  proj5: {
    emoji: '❤️', cat: 'Power BI · Zion Tech Hub',
    title: 'Hypertension Cardiology Patient Outcomes',
    desc: 'A Power BI dashboard for cardiology patient outcome analysis built for the Zion Tech Hub challenge. Tracks treatment pathways, readmission rates, blood pressure metrics, and patient outcome scores across multiple clinical facilities.',
    kpis: [{v:'Clinical', l:'KPIs'}, {v:'ZTH', l:'Challenge'}, {v:'Multi-site', l:'Analysis'}],
    problem: 'Complex clinical data with multi-condition patient records requiring careful data modeling to avoid double-counting across treatment episodes.',
    solution: 'Designed patient-grain fact table with separate clinical event table, using TREATAS() DAX for cross-filter relationships between the two fact tables without physical relationships.',
    tools: ['Power BI', 'DAX', 'Power Query', 'Clinical Analytics'],
    gh: 'https://github.com/saniajawed'
  },
  proj6: {
    emoji: '📱', cat: 'HTML · CSS · JavaScript · Chart.js',
    title: 'From Instagram Brand to Profitable Business',
    desc: 'An interactive business analytics dashboard built entirely with HTML, CSS, JavaScript, and Chart.js — a storytelling dashboard mapping the journey from a social media page to a profitable business across four distinct phases, combining engagement metrics, conversion tracking, and revenue performance visualization.',
    kpis: [{v:'4', l:'Phases'}, {v:'Live', l:'Analytics'}, {v:'100%', l:'Handcoded'}],
    problem: 'Translating a multi-phase business growth story into a single cohesive interactive dashboard, with scroll-triggered reveals and real-time-feeling chart updates using vanilla JavaScript.',
    solution: 'Used Chart.js for all data visualizations paired with IntersectionObserver for scroll-triggered animations, structuring the dashboard around four clear narrative phases from social growth to profitability.',
    tools: ['HTML5', 'CSS3', 'JavaScript', 'Chart.js', 'IntersectionObserver'],
    gh: 'https://github.com/saniajawed'
  }
};

/* ============================================
   MODAL OPEN/CLOSE
============================================ */
function openModal(id) {
  const d = modalData[id];
  if (!d) return;
  const toolBadges = d.tools.map(t => `<span class="badge" style="margin:3px;">${t}</span>`).join('');
  const kpiCards = d.kpis.map(k => `<div class="modal-kpi"><div class="modal-kpi-val">${k.v}</div><div class="modal-kpi-lbl">${k.l}</div></div>`).join('');
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-hero">
      <span style="font-size:5rem;">${d.emoji}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="modal-cat">${d.cat}</div>
      <div class="modal-title">${d.title}</div>
      <div class="modal-desc">${d.desc}</div>
      <div class="modal-section-title">Key Metrics</div>
      <div class="modal-kpi-row">${kpiCards}</div>
      <div class="modal-section-title">Problem Statement</div>
      <div class="modal-desc">${d.problem}</div>
      <div class="modal-section-title">Solution Approach</div>
      <div class="modal-desc">${d.solution}</div>
      <div class="modal-section-title">Tools Used</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;">${toolBadges}</div>
      <div class="modal-btns">
        <a href="${d.gh}" target="_blank" class="btn btn-primary">⭐ View on GitHub</a>
        <button class="btn btn-secondary" onclick="closeModal()">Close</button>
      </div>
    </div>
  `;
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalBackdrop')) return;
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================
   SKILL INFO TOAST
============================================ */
function showSkillInfo(el, name, info) {
  const toast = document.getElementById('skillToast');
  toast.innerHTML = `<strong>${name}</strong><br><span style="opacity:0.75;font-size:0.8rem;">${info}</span>`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

/* ============================================
   RIPPLE
============================================ */
document.querySelectorAll('.ripple-container').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ============================================
   TILT ON PROJECT CARDS
============================================ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ============================================
   FORM SUBMIT
============================================ */
function handleFormSubmit(btn) {
  const original = btn.innerHTML;
  btn.innerHTML = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #22C55E, #16A34A)';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

/* ============================================
   SMOOTH SCROLL FOR NAV
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
