'use strict';

/* ════════════════════════════════════════════════════════════════
   JAY DENGLE PORTFOLIO — ENHANCED ULTRA EDITION JAVASCRIPT
════════════════════════════════════════════════════════════════ */

// ── 1. COSMOS CANVAS (star field + shooting stars) ─────────────────────────
(function initCosmos() {
  const canvas = document.getElementById('cosmos-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Stars
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: Math.random() * 1.2 + 0.2,
    a: Math.random(),
    speed: Math.random() * 0.008 + 0.002,
    phase: Math.random() * Math.PI * 2
  }));

  // Shooting stars
  const shootingStars = [];
  let shootTimer = 0;

  function spawnShooting() {
    shootingStars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 5,
      angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
      life: 1,
      decay: Math.random() * 0.02 + 0.015
    });
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.01;
    shootTimer++;
    if (shootTimer > 120 + Math.random() * 200) {
      spawnShooting();
      shootTimer = 0;
    }

    // Draw stars
    stars.forEach(s => {
      const alpha = 0.3 + 0.5 * Math.sin(t * s.speed * 10 + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 180, 255, ${alpha * 0.6})`;
      ctx.fill();
    });

    // Draw shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i];
      const ex = ss.x + Math.cos(ss.angle) * ss.len;
      const ey = ss.y + Math.sin(ss.angle) * ss.len;
      const grad = ctx.createLinearGradient(ss.x, ss.y, ex, ey);
      grad.addColorStop(0, `rgba(168, 85, 247, ${ss.life * 0.9})`);
      grad.addColorStop(0.4, `rgba(200, 160, 255, ${ss.life * 0.5})`);
      grad.addColorStop(1, `rgba(168, 85, 247, 0)`);
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5 * ss.life;
      ctx.stroke();

      // Flare at head
      ctx.beginPath();
      ctx.arc(ss.x, ss.y, 2 * ss.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 180, 255, ${ss.life * 0.8})`;
      ctx.fill();

      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.life -= ss.decay;
      if (ss.life <= 0) shootingStars.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


// ── 2. PAGE LOADER ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  const pct    = document.getElementById('loader-pct');
  let n = 0;
  const ticker = setInterval(() => {
    n = Math.min(n + Math.random() * 8 + 2, 100);
    if (pct) pct.textContent = Math.round(n) + '%';
    if (n >= 100) {
      clearInterval(ticker);
      setTimeout(() => {
        loader && loader.classList.add('hidden');
        setTimeout(() => {
          if (loader) loader.style.display = 'none';
          initPageAnimations();
          animateCounters();
          animateSkillBars();
        }, 900);
      }, 400);
    }
  }, 100);
});


// ── 3. CUSTOM CURSOR + TRAIL ────────────────────────────────────────────────
(function initCursor() {
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .content-card, .project-item, .service-item, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.body.style.cursor = 'none';
})();


// ── 4. SCROLL PROGRESS ──────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  bar.style.width = Math.min(pct, 100) + '%';
}, { passive: true });


// ── 5. SIDEBAR TOGGLE ───────────────────────────────────────────────────────
const sidebar    = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener('click', () => sidebar.classList.toggle('active'));
}


// ── 6. TESTIMONIALS MODAL ───────────────────────────────────────────────────
const testimonialsItems = document.querySelectorAll('[data-testimonials-item]');
const modalContainer    = document.querySelector('[data-modal-container]');
const modalCloseBtn     = document.querySelector('[data-modal-close-btn]');
const overlay           = document.querySelector('[data-overlay]');
const modalImg          = document.querySelector('[data-modal-img]');
const modalTitle        = document.querySelector('[data-modal-title]');
const modalText         = document.querySelector('[data-modal-text]');

function toggleModal() {
  modalContainer && modalContainer.classList.toggle('active');
  overlay        && overlay.classList.toggle('active');
}

testimonialsItems.forEach(item => {
  item.addEventListener('click', function() {
    const avatar = this.querySelector('[data-testimonials-avatar]');
    const title  = this.querySelector('[data-testimonials-title]');
    const text   = this.querySelector('[data-testimonials-text]');
    if (modalImg)   { modalImg.src = avatar.src; modalImg.alt = avatar.alt; }
    if (modalTitle) modalTitle.innerHTML = title.innerHTML;
    if (modalText)  modalText.innerHTML  = text.innerHTML;
    toggleModal();
  });
});

modalCloseBtn && modalCloseBtn.addEventListener('click', toggleModal);
overlay       && overlay.addEventListener('click', toggleModal);


// ── 7. PORTFOLIO FILTER ─────────────────────────────────────────────────────
const selectBtn   = document.querySelector('[data-select]');
const selectItems = document.querySelectorAll('[data-select-item]');
const selectVal   = document.querySelector('[data-selecct-value]');
const filterBtns  = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

selectBtn && selectBtn.addEventListener('click', () => selectBtn.classList.toggle('active'));

function filterFunc(val) {
  filterItems.forEach(item => {
    const match = val === 'all' || val === item.dataset.category;
    item.classList.toggle('active', match);
  });
}

selectItems.forEach(item => {
  item.addEventListener('click', function() {
    const val = this.innerText.toLowerCase();
    if (selectVal) selectVal.innerText = this.innerText;
    selectBtn && selectBtn.classList.remove('active');
    filterFunc(val);
  });
});

let lastBtn = filterBtns[0];
filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const val = this.innerText.toLowerCase();
    if (selectVal) selectVal.innerText = this.innerText;
    filterFunc(val);
    lastBtn && lastBtn.classList.remove('active');
    this.classList.add('active');
    lastBtn = this;
  });
});


// ── 8. CONTACT FORM ─────────────────────────────────────────────────────────
const form      = document.querySelector('[data-form]');
const formIns   = document.querySelectorAll('[data-form-input]');
const formBtn   = document.querySelector('[data-form-btn]');

formIns.forEach(inp => {
  inp.addEventListener('input', () => {
    if (formBtn) {
      form && form.checkValidity()
        ? formBtn.removeAttribute('disabled')
        : formBtn.setAttribute('disabled', '');
    }
  });
});


// ── 9. PAGE NAVIGATION ──────────────────────────────────────────────────────
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages    = document.querySelectorAll('[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', function() {
    const target = this.innerHTML.toLowerCase();
    pages.forEach((page, i) => {
      const isMatch = target === page.dataset.page;
      page.classList.toggle('active', isMatch);
      navLinks[i].classList.toggle('active', isMatch);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      initPageAnimations();
      if (target === 'resume') animateSkillBars();
      if (target === 'about')  animateCounters();
    }, 80);
  });
});


// ── 10. INTERSECTION OBSERVER REVEALS ────────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function initPageAnimations() {
  const selectors = [
    '.about-text p',
    '.service-item',
    '.testimonials-item',
    '.clients-item',
    '.timeline-item',
    '.blog-post-item',
    '.form-input',
    '.stat-card',
    '.contact-item'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = (i * 0.08) + 's';
      revealObs.observe(el);
    });
  });
}

document.addEventListener('DOMContentLoaded', initPageAnimations);


// ── 11. SKILL BAR ANIMATION ───────────────────────────────────────────────────
function animateSkillBars() {
  const fills = document.querySelectorAll('.skill-progress-fill');
  if (!fills.length) return;

  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill = e.target;
      const target = fill.dataset.targetWidth || '0%';
      fill.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { fill.style.width = target; }, 80);
      });
      barObs.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => {
    if (!fill.dataset.targetWidth) {
      const m = (fill.getAttribute('style') || '').match(/width:\s*([\d.]+%)/);
      if (m) fill.dataset.targetWidth = m[1];
    }
    fill.style.width = '0';
    barObs.observe(fill);
  });
}


// ── 12. COUNTER ANIMATION ───────────────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 40;
    const ticker = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current >= target) clearInterval(ticker);
    }, 30);
  });
}


// ── 13. MOUSE-REACTIVE AURORA ──────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const xR = e.clientX / window.innerWidth;
  const yR = e.clientY / window.innerHeight;
  const blobs = document.querySelectorAll('.aurora-blob');
  if (blobs[0]) blobs[0].style.transform = `translate(${xR * 50 - 25}px, ${yR * 40 - 20}px)`;
  if (blobs[1]) blobs[1].style.transform = `translate(${-xR * 40 + 20}px, ${yR * 30 - 15}px)`;
  if (blobs[2]) blobs[2].style.transform = `translate(${xR * 30 - 15}px, ${-yR * 25 + 12}px)`;
  if (blobs[3]) blobs[3].style.transform = `translate(${-xR * 25 + 12}px, ${-yR * 20 + 10}px)`;
}, { passive: true });


// ── 14. NAME CHARACTER WAVE ────────────────────────────────────────────────
(function initNameWave() {
  const chars = document.querySelectorAll('.name-char');
  chars.forEach((c, i) => {
    c.style.display = 'inline-block';
    c.style.transition = `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.04}s`;
  });

  const nameEl = document.querySelector('.info-content .name');
  if (!nameEl) return;

  nameEl.addEventListener('mouseenter', () => {
    chars.forEach((c, i) => {
      setTimeout(() => { c.style.transform = 'translateY(-6px)'; }, i * 40);
    });
  });

  nameEl.addEventListener('mouseleave', () => {
    chars.forEach((c, i) => {
      setTimeout(() => { c.style.transform = 'translateY(0)'; }, i * 30);
    });
  });
})();


// ── 15. 3D TILT CARDS ──────────────────────────────────────────────────────
(function initTilt() {
  function applyTilt(el) {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    });
    el.addEventListener('mouseenter', () => { el.style.transition = 'none'; });
  }

  document.querySelectorAll('.stat-card, .clients-item').forEach(applyTilt);
})();


// ── 16. MAGNETIC FORM BUTTON ────────────────────────────────────────────────
(function initMagneticBtn() {
  const btn = document.querySelector('[data-form-btn]');
  if (!btn) return;
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2)  * 0.15;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.2;
    btn.style.transition = 'transform 0.1s ease';
    btn.style.transform  = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    btn.style.transform  = '';
  });
})();


// ── 17. TYPEWRITER EFFECT ────────────────────────────────────────────────────
(function initTypewriter() {
  const el = document.querySelector('.title-inner');
  if (!el) return;
  const texts = ['Software Developer', 'AI Enthusiast', 'Problem Solver', 'Python Developer'];
  let ti = 0, ci = 0, deleting = false;
  el.style.borderRight = 'none'; // Remove the CSS ::after cursor since we handle it here

  function tick() {
    const current = texts[ti];
    if (deleting) {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
      setTimeout(tick, 60);
    } else {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 2000); return; }
      setTimeout(tick, 100);
    }
  }

  setTimeout(tick, 2000);
})();


// ── 18. PARTICLE TRAIL (subtle) ──────────────────────────────────────────────
(function initTrail() {
  const container = document.getElementById('cursor-trail-container');
  if (!container) return;
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;overflow:hidden;';

  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', e => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 12) return;
    lastX = e.clientX; lastY = e.clientY;

    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    p.style.cssText = [
      'position:absolute',
      `width:${size}px`, `height:${size}px`,
      `left:${e.clientX}px`, `top:${e.clientY}px`,
      'border-radius:50%',
      `background:rgba(168,85,247,${Math.random() * 0.5 + 0.2})`,
      `box-shadow:0 0 ${size * 2}px rgba(168,85,247,0.6)`,
      'transform:translate(-50%,-50%)',
      'transition:all 0.8s ease',
      'pointer-events:none'
    ].join(';');

    container.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${(Math.random() - 0.5) * 30 - 50}%, ${(Math.random() - 0.5) * 30 - 50}%)`;
      p.style.opacity = '0';
      p.style.width = '1px'; p.style.height = '1px';
    });
    setTimeout(() => p.remove(), 800);
  }, { passive: true });
})();


// ── 19. RIPPLE EFFECT ON SERVICE CARDS ─────────────────────────────────────
(function initRipples() {
  document.querySelectorAll('.service-item, .stat-card').forEach(el => {
    el.addEventListener('click', e => {
      const rect = el.getBoundingClientRect();
      const r = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;
      r.style.cssText = [
        'position:absolute', 'border-radius:50%', 'pointer-events:none',
        `width:${size}px`, `height:${size}px`,
        `left:${e.clientX - rect.left - size / 2}px`,
        `top:${e.clientY - rect.top - size / 2}px`,
        'background:rgba(168,85,247,0.15)',
        'transform:scale(0)',
        'animation:ripple 0.6s ease-out forwards'
      ].join(';');
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  const style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0;}}';
  document.head.appendChild(style);
})();


// ── 20. NAVBAR ACTIVE INDICATOR ─────────────────────────────────────────────
(function initNavIndicator() {
  const links = document.querySelectorAll('.navbar-link');
  links.forEach(link => {
    link.addEventListener('click', function() {
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
})();