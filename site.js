// Shared site behaviors — reveal-on-scroll, mobile nav, hero rotator, audience track switcher

(function () {
  // Reveal-on-scroll
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));

  // Audience track switcher (freelance / recruiter)
  const trackBtns = document.querySelectorAll('[data-track-btn]');
  function setTrack(track) {
    document.body.setAttribute('data-track', track);
    trackBtns.forEach((b) => b.classList.toggle('is-active', b.dataset.trackBtn === track));
    try { localStorage.setItem('site-track', track); } catch (_) {}
  }
  if (trackBtns.length) {
    let initial = 'freelance';
    try { initial = localStorage.getItem('site-track') || 'freelance'; } catch (_) {}
    setTrack(initial);
    trackBtns.forEach((b) => b.addEventListener('click', () => setTrack(b.dataset.trackBtn)));
  }

  // Copy email button
  document.querySelectorAll('[data-copy-email]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const email = btn.getAttribute('data-copy-email');
      try {
        await navigator.clipboard.writeText(email);
        const orig = btn.querySelector('.label')?.textContent || 'Copy';
        const lbl = btn.querySelector('.label');
        if (lbl) {
          lbl.textContent = 'Copied ✓';
          setTimeout(() => { lbl.textContent = orig; }, 1600);
        }
      } catch (_) {}
    });
  });

  // Apply persisted theme
  try {
    const saved = JSON.parse(localStorage.getItem('site-tweaks') || '{}');
    if (saved.theme) document.documentElement.setAttribute('data-theme', saved.theme);
    if (saved.accent) document.documentElement.style.setProperty('--accent', saved.accent);
  } catch (_) {}
})();
