/* ================================================================
   animations.js — premium interaction layer
   Typewriter · Parallax · Card entrance · Cursor · Nav active
   Magnetic · Service dim · Skill bars · Scroll progress · Hire float
================================================================ */

(function () {
  'use strict';

  const touch    = window.matchMedia('(hover: none)').matches;
  const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── TYPEWRITER ROTATOR ────────────────────────────────────── */
  function applyTypewriter() {
    const el = document.querySelector('.rotator[data-rotator]');
    if (!el) return;

    let phrases;
    try { phrases = JSON.parse(el.dataset.rotator); } catch (e) { return; }
    if (!phrases.length) return;

    // Reduced motion or fallback: just show first phrase statically
    if (reduced) { el.textContent = phrases[0]; return; }

    let idx = 0, charIdx = 0, deleting = false, timer = null;

    const WRITE_MS  = 88;
    const DELETE_MS = 48;
    const HOLD_MS   = 2600;   // pause at end of word
    const GAP_MS    = 320;    // pause before next word

    // Show first phrase immediately so there's never a blank flash
    el.textContent = phrases[0];
    charIdx = phrases[0].length;

    function tick() {
      const phrase = phrases[idx];

      if (!deleting) {
        // Still typing
        if (charIdx < phrase.length) {
          charIdx++;
          el.textContent = phrase.slice(0, charIdx);
          timer = setTimeout(tick, WRITE_MS);
        } else {
          // Finished typing — hold then delete
          timer = setTimeout(() => { deleting = true; tick(); }, HOLD_MS);
        }
      } else {
        // Deleting
        if (charIdx > 0) {
          charIdx--;
          el.textContent = phrase.slice(0, charIdx);
          timer = setTimeout(tick, DELETE_MS);
        } else {
          // Finished deleting — move to next phrase
          deleting = false;
          idx = (idx + 1) % phrases.length;
          charIdx = 0;
          timer = setTimeout(tick, GAP_MS);
        }
      }
    }

    // Start deleting the pre-shown first phrase after initial hold
    timer = setTimeout(() => { deleting = true; tick(); }, HOLD_MS);
  }

  /* ── HERO PARALLAX ─────────────────────────────────────────── */
  function applyHeroParallax() {
    if (touch || reduced || window.innerWidth < 900) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shift = window.scrollY * 0.22;
          hero.style.setProperty('--parallax-y', `${shift}px`);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── HERO CURSOR SPOTLIGHT ─────────────────────────────────── */
  function applyHeroSpotlight() {
    if (touch) return;
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const spot = document.createElement('div');
    spot.className = 'hero-cursor-spot';
    const heroPos = getComputedStyle(hero).position;
    if (heroPos === 'static') hero.style.position = 'relative';
    hero.appendChild(spot);

    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      spot.style.background =
        `radial-gradient(520px circle at ${x}% ${y}%, rgba(255,90,60,0.08), transparent 60%)`;
    });

    hero.addEventListener('mouseleave', () => { spot.style.background = ''; });
  }

  /* ── TILT ──────────────────────────────────────────────────── */
  function applyTilt(selector, intensity, scalePeak) {
    if (touch || reduced) return;
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transition = 'transform 0.08s linear';
        el.style.transform  =
          `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(${scalePeak},${scalePeak},${scalePeak})`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        el.style.transform  = '';
      });
    });
  }

  /* ── GROUP DIM ─────────────────────────────────────────────── */
  function applyGroupDim(containerSel, itemSel) {
    document.querySelectorAll(containerSel).forEach(container => {
      const items = () => container.querySelectorAll(itemSel);

      container.addEventListener('mouseenter', e => {
        const hovered = e.target.closest(itemSel);
        if (!hovered) return;
        items().forEach(item => {
          if (item !== hovered) {
            item.style.opacity   = '0.38';
            item.style.filter    = 'blur(2px) saturate(0.4)';
            item.style.transform = 'scale(0.96)';
          }
        });
      }, true);

      container.addEventListener('mousemove', e => {
        const hovered = e.target.closest(itemSel);
        if (!hovered) return;
        items().forEach(item => {
          if (item !== hovered) {
            item.style.opacity   = '0.38';
            item.style.filter    = 'blur(2px) saturate(0.4)';
            item.style.transform = 'scale(0.96)';
          } else {
            item.style.opacity = '';
            item.style.filter  = '';
          }
        });
      }, true);

      container.addEventListener('mouseleave', () => {
        items().forEach(item => {
          item.style.opacity   = '';
          item.style.filter    = '';
          item.style.transform = '';
        });
      });
    });
  }

  /* ── SERVICE ROW DIM ───────────────────────────────────────── */
  function applyServiceDim() {
    const list = document.querySelector('.services-list');
    if (!list) return;
    const rows = () => list.querySelectorAll('.service-row');

    list.addEventListener('mouseenter', e => {
      const hovered = e.target.closest('.service-row');
      if (!hovered) return;
      rows().forEach(r => { if (r !== hovered) r.style.opacity = '0.35'; });
    }, true);

    list.addEventListener('mousemove', e => {
      const hovered = e.target.closest('.service-row');
      if (!hovered) return;
      rows().forEach(r => {
        r.style.opacity = r === hovered ? '' : '0.35';
      });
    }, true);

    list.addEventListener('mouseleave', () => {
      rows().forEach(r => { r.style.opacity = ''; });
    });
  }

  /* ── HEADING REVEAL ────────────────────────────────────────── */
  function applyHeadingReveal() {
    const targets = document.querySelectorAll(
      '.section-title, h2.section-title, .hero-h1, .display'
    );
    if (!targets.length) return;

    if (reduced) {
      targets.forEach(el => { el.classList.remove('h3d-hidden'); el.classList.add('h3d-active'); });
      return;
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('h3d-hidden');
          entry.target.classList.add('h3d-active');
        } else {
          entry.target.classList.remove('h3d-active');
          entry.target.classList.add('h3d-hidden');
        }
      });
    }, { threshold: 0.15 });

    targets.forEach(el => {
      el.classList.add('h3d-hidden');
      io.observe(el);
    });
  }

  /* ── CARD ENTRANCE WITH STAGGER ────────────────────────────── */
  function applyCardEntrance() {
    if (reduced) return;

    // Work cards stagger on scroll
    const workGrid = document.querySelector('.work-grid');
    if (workGrid) {
      const cards = workGrid.querySelectorAll('.work-card');
      cards.forEach(card => {
        card.classList.add('card-enter');
      });

      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.work-card');
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('card-enter-active'), i * 110);
            });
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      io.observe(workGrid);
    }

    // Testimonial cards stagger
    const testGrid = document.querySelector('.testimonials-grid');
    if (testGrid) {
      const cards = testGrid.querySelectorAll('.testimonial-card');
      cards.forEach(card => card.classList.add('card-enter'));

      const io2 = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.testimonial-card');
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('card-enter-active'), i * 120);
            });
            io2.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      io2.observe(testGrid);
    }

    // Engagement cards stagger
    const engGrid = document.querySelector('.engagement-grid');
    if (engGrid) {
      const cards = engGrid.querySelectorAll('.engagement-card');
      cards.forEach(card => card.classList.add('card-enter'));

      const io3 = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.engagement-card');
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('card-enter-active'), i * 90);
            });
            io3.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      io3.observe(engGrid);
    }
  }

  /* ── PREMIUM CURSOR ────────────────────────────────────────── */
  function applyCursor() {
    if (touch) return;
    document.body.classList.add('has-custom-cursor');

    const dot   = document.createElement('div'); dot.id   = 'cursor-dot';
    const ring  = document.createElement('div'); ring.id  = 'cursor-ring';
    const label = document.createElement('div'); label.id = 'cursor-label';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(label);

    let mx = -200, my = -200, rx = -200, ry = -200, raf = null;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
      if (!raf) raf = requestAnimationFrame(lerpRing);
    });

    function lerpRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left  = rx.toFixed(2) + 'px';
      ring.style.top   = ry.toFixed(2) + 'px';
      label.style.left = (rx + 24).toFixed(2) + 'px';
      label.style.top  = (ry + 24).toFixed(2) + 'px';
      raf = (Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3)
        ? requestAnimationFrame(lerpRing) : null;
    }

    const linkSel = 'a, button, .work-card, .testimonial-card, .engagement-card, .stack-card, .service-row, .rec-badge, .contact-channel';

    document.addEventListener('mouseover', e => {
      const target = e.target.closest(linkSel);
      if (!target) return;
      document.body.classList.add('cursor-hover');
      // Show label hint for CTAs
      const hint = target.dataset.cursorLabel || target.getAttribute('aria-label') || '';
      if (hint) {
        label.textContent = hint;
        label.classList.add('visible');
      }
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest(linkSel)) {
        document.body.classList.remove('cursor-hover');
        label.classList.remove('visible');
        label.textContent = '';
      }
    });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0'; ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      dot.style.opacity = '1'; ring.style.opacity = '1';
    });
  }

  /* ── ACTIVE SECTION NAV HIGHLIGHT ─────────────────────────── */
  function applyNavActive() {
    // Static page-level active
    const page = location.pathname.split('/').pop().replace('.html', '') || 'index';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href') || '';
      const name = href.replace('.html', '').replace('./', '') || 'index';
      if (name === page || (page === 'index' && name === '')) {
        a.classList.add('active');
      }
    });

    // Scroll-spy for in-page sections (index only)
    if (page !== 'index' && page !== '') return;
    const sections = document.querySelectorAll('section[id], header[id]');
    if (!sections.length) return;

    const links = document.querySelectorAll('.nav-links a[href*="#"]');
    if (!links.length) return;

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href').includes('#' + entry.target.id));
          });
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(sec => io.observe(sec));
  }

  /* ── SCROLL PROGRESS ───────────────────────────────────────── */
  function applyScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.insertBefore(bar, document.body.firstChild);
    window.addEventListener('scroll', () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0).toFixed(1) + '%';
    }, { passive: true });
  }

  /* ── ANIMATED STAT COUNTERS ────────────────────────────────── */
  function applyStatCounters() {
    const nodes = document.querySelectorAll('.stat-n[data-count]');
    if (!nodes.length) return;

    function formatNum(n) {
      return n >= 1000 ? n.toLocaleString('en-US') : String(n);
    }

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.count, 10);

        if (reduced) { el.textContent = formatNum(target); io.unobserve(el); return; }

        const t0  = performance.now();
        const dur = 1600;

        (function tick(now) {
          const p = Math.min((now - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);   // cubic ease-out
          el.textContent = formatNum(Math.round(e * target));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);

        io.unobserve(el);
      });
    }, { threshold: 0.6 });

    nodes.forEach(el => { el.textContent = '0'; io.observe(el); });
  }

  /* ── MAGNETIC BUTTONS ──────────────────────────────────────── */
  function applyMagnetic() {
    if (touch || reduced) return;
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const cx = r.left + r.width  / 2;
        const cy = r.top  + r.height / 2;
        const dx = (e.clientX - cx) * 0.28;
        const dy = (e.clientY - cy) * 0.28;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
        btn.style.transform  = '';
        setTimeout(() => { btn.style.transition = ''; }, 450);
      });
    });
  }

  /* ── STAGGER REVEAL DELAYS ─────────────────────────────────── */
  function applyStagger() {
    document.querySelectorAll('.stack-grid .stack-col').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
    document.querySelectorAll('.process .step').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.09}s`;
    });
    document.querySelectorAll('.rec-cell').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.05}s`;
    });
  }

  /* ── SKILL BARS ────────────────────────────────────────────── */
  function applySkillBars() {
    document.querySelectorAll('.skill-fill[data-width]').forEach(el => {
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (reduced) {
            el.style.width = el.dataset.width + '%';
          } else {
            // Tiny delay so the reveal animation fires first
            setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 120);
          }
          io.unobserve(el);
        }
      }, { threshold: 0.3 });
      io.observe(el);
    });
  }

  /* ── FLOATING HIRE CTA ─────────────────────────────────────── */
  function applyHireFloat() {
    const pill = document.createElement('a');
    pill.href = 'contact.html';
    pill.className = 'hire-float';
    pill.setAttribute('aria-label', 'Available for work — contact me');
    pill.innerHTML =
      '<span class="hf-dot"></span>' +
      '<span class="hf-text">Available · Let\'s talk</span>' +
      '<span class="hf-arrow">→</span>' +
      '<button class="hf-close" type="button" aria-label="Dismiss">×</button>';

    document.body.appendChild(pill);

    pill.querySelector('.hf-close').addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      pill.classList.add('hf-dismissed');
      setTimeout(() => pill.remove(), 400);
    });

    const hero = document.querySelector('.hero');
    if (hero) {
      new IntersectionObserver(([entry]) => {
        pill.classList.toggle('visible', !entry.isIntersecting);
      }, { threshold: 0.05 }).observe(hero);
    } else {
      window.addEventListener('scroll', () => {
        pill.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
    }
  }

  /* ── HERO BADGE ────────────────────────────────────────────── */
  function applyHeroBadgePulse() {
    // The badge is injected via HTML; just ensure the pulse class is set
    const badge = document.querySelector('.hero-badge');
    if (badge && !reduced) badge.classList.add('pulse-badge');
  }

  /* ── REVEAL OBSERVER (generic .reveal elements) ────────────── */
  function applyReveal() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  /* ── SERVICE ROW LINE REVEAL ───────────────────────────────── */
  function applyServiceReveal() {
    if (reduced) return;
    const services = document.querySelector('.services');
    if (!services) return;
    const rows = services.querySelectorAll('.service-row');

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          rows.forEach((row, i) => {
            setTimeout(() => row.classList.add('row-visible'), i * 80);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    rows.forEach(row => row.classList.add('row-hidden'));
    io.observe(services);
  }

  /* ── INIT ───────────────────────────────────────────────────── */
  function init() {
    applyScrollProgress();
    applyCursor();
    applyStatCounters();
    applyHireFloat();
    applyTypewriter();
    applyHeroParallax();
    applyHeroSpotlight();
    applyHeadingReveal();
    applyCardEntrance();
    applyServiceReveal();
    applySkillBars();
    applyHeroBadgePulse();
    applyReveal();

    applyTilt('.work-card',        10, 1.03);
    applyTilt('.testimonial-card', 8,  1.02);
    applyTilt('.engagement-card',  7,  1.02);
    applyTilt('.stack-card',       9,  1.025);
    applyTilt('.process .step',    6,  1.015);

    applyGroupDim('.work-grid',         '.work-card');
    applyGroupDim('.testimonials-grid', '.testimonial-card');

    applyServiceDim();
    applyMagnetic();
    applyStagger();
    applyNavActive();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
