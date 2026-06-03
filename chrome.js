// Shared site chrome — nav + footer injected by every page

window.renderNav = function (active) {
  const items = [
    { href: 'index.html',   label: 'Home',    key: 'home',    idx: '01' },
    { href: 'about.html',   label: 'About',   key: 'about',   idx: '02' },
    { href: 'work.html',    label: 'Work',    key: 'work',    idx: '03' },
    { href: 'contact.html', label: 'Contact', key: 'contact', idx: '04' },
  ];
  return `
    <nav class="nav">
      <div class="container nav-inner">
        <a class="brand" href="index.html">
          <span class="brand-mark"></span>
          <span>Dasadiya<span class="b-2"> / Kishan</span></span>
        </a>
        <div class="nav-links">
          ${items.map(i => `<a href="${i.href}" class="${i.key === active ? 'active' : ''}">${i.label}</a>`).join('')}
          <a class="nav-resume" href="resume.html" title="Download résumé">
            <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/></svg>
            Résumé
          </a>
          <a class="nav-resume" href="contact.html">Hire Me →</a>
        </div>
        <button class="nav-toggle" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      </div>
    </nav>
  `;
};

window.renderFooter = function () {
  return `
    <footer class="foot">
      <div class="container">
        <div class="top">
          <div>
            <div class="eyebrow" style="margin-bottom: 24px;"><span class="star"></span> Get in touch</div>
            <h3>Have a Laravel<br>project on the<br>workbench? <em>Let's talk.</em></h3>
            <p class="lede">First reply within one business day. Send a paragraph, a brief, or a Loom — whatever's quickest.</p>
            <div style="display:flex; gap:12px; margin-top:28px; flex-wrap:wrap;">
              <a class="btn primary" href="contact.html">Start a project <span class="arrow">→</span></a>
              <a class="btn" href="resume.html">Download résumé</a>
            </div>
          </div>
          <div class="col">
            <h6>Sitemap</h6>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About</a></li>
              <li><a href="work.html">Selected work</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="col">
            <h6>Elsewhere</h6>
            <ul>
              <li><a href="https://github.com/dasadiyakishan" target="_blank">GitHub</a></li>
              <li><a href="https://linkedin.com/in/dasadiya-kishan-149b01223" target="_blank">LinkedIn</a></li>
              <li><a href="https://github.com/dasadiyakishan" target="_blank">Packagist</a></li>
              <li><a href="mailto:Kishand956@gmail.com">Kishand956@gmail.com</a></li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <span>© 2026 Dasadiya Kishan · Backend developer · Gujarat, India</span>
          <span>Hand-built · v2.0</span>
        </div>
      </div>
    </footer>
  `;
};

window.mountChrome = function (active) {
  const navHost = document.getElementById('nav-host');
  const footHost = document.getElementById('foot-host');
  if (navHost) navHost.innerHTML = window.renderNav(active);
  if (footHost) footHost.innerHTML = window.renderFooter();

  // Wire toggle here — site.js runs before mountChrome injects the nav HTML
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    // Close menu when a nav link is tapped on mobile
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
};
