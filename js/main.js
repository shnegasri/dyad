(() => {
  const savedTheme = localStorage.getItem('wpTheme');
  document.documentElement.dataset.theme = savedTheme === 'dark' ? 'dark' : 'light';
  const links = [
    ['Home', 'index.html', 'home'], ['Explore exams', 'exams.html', 'exams'],
    ['Practice', 'practice.html', 'practice'], ['AI learning', 'ai-learning.html', 'ai-learning'],
    ['Resources', 'resources.html', 'resources'], ['Dashboard', 'dashboard.html', 'dashboard']
  ];
  const logo = '<a class="brand" href="index.html" aria-label="WellPractice home"><span class="brand-mark"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 8v15.5h15.5M7 23 14 16l5 4 9-11M18 9h10v10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"/></svg></span><span>WellPractice</span></a>';
  const currentPage = document.body.dataset.page || 'home';
  const header = document.querySelector('#site-header');
  if (header) {
    header.innerHTML = `<header class="site-header"><div class="header-inner">${logo}<nav class="main-nav" id="main-nav" aria-label="Main navigation">${links.map(([label, href, key]) => `<a href="${href}"${currentPage === key ? ' aria-current="page"' : ''}>${label}</a>`).join('')}<div class="header-tools"><div class="accessibility-controls" role="group" aria-label="Text size"><button type="button" data-font-adjust="-1" aria-label="Decrease text size">A−</button><button type="button" data-font-adjust="1" aria-label="Increase text size">A+</button></div><button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false"><span class="theme-toggle-icon" aria-hidden="true">☾</span><span class="theme-toggle-label">Dark mode</span></button></div></nav><a class="header-cta" href="auth.html">Sign in <span aria-hidden="true">↗</span></a><button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav"><span></span></button></div></header>`;
    const toggle = header.querySelector('.menu-toggle');
    const nav = header.querySelector('.main-nav');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      nav.classList.toggle('is-open', open);
    });
    const themeToggle = header.querySelector('[data-theme-toggle]');
    const updateThemeControl = theme => {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
      themeToggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☼' : '☾';
      themeToggle.querySelector('.theme-toggle-label').textContent = isDark ? 'Light mode' : 'Dark mode';
    };
    updateThemeControl(document.documentElement.dataset.theme);
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('wpTheme', nextTheme);
      updateThemeControl(nextTheme);
    });
    window.addEventListener('storage', event => {
      if (event.key === 'wpTheme' && (event.newValue === 'dark' || event.newValue === 'light')) {
        document.documentElement.dataset.theme = event.newValue;
        updateThemeControl(event.newValue);
      }
    });
  }
  const footer = document.querySelector('#site-footer');
  if (footer) footer.innerHTML = `<footer class="site-footer"><div class="page-wrap footer-main"><div class="footer-brand">${logo}<p>A thoughtful place to prepare, practise, and find your next step.</p></div><div class="footer-col"><h3>LEARN</h3><a href="exams.html">Explore exams</a><a href="practice.html">Practice tests</a><a href="ai-learning.html">AI learning centre</a><a href="resources.html">Study resources</a></div><div class="footer-col"><h3>YOUR SPACE</h3><a href="dashboard.html">Dashboard</a><a href="test-builder.html">Custom test builder</a><a href="community.html">Study community</a><a href="auth.html">Sign in / Join</a></div><div class="footer-col"><h3>WELLPRACTICE</h3><a href="index.html#exams">About the platform</a><a href="mailto:hello@wellpractice.example">Contact</a><a href="auth.html#privacy">Privacy demo</a><a href="auth.html#terms">Terms demo</a></div></div><div class="page-wrap footer-bottom"><span>© 2026 WellPractice · A frontend demonstration</span><span>Demo data is stored only in this browser. <a href="auth.html">Learn about account security</a></span></div></footer>`;
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries, instance) => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); instance.unobserve(entry.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(element => observer ? observer.observe(element) : element.classList.add('is-visible'));
  const progress = JSON.parse(localStorage.getItem('wpProgress') || '{}');
  const homeTests = document.querySelector('#home-tests');
  if (homeTests) homeTests.textContent = progress.testsCompleted || '0';
  const savedZoom = Number(localStorage.getItem('wpFontZoom') || 100);
  document.body.style.zoom = `${savedZoom}%`;
  document.querySelectorAll('[data-font-adjust]').forEach(button => button.addEventListener('click', () => {
    const zoom = Math.max(90, Math.min(120, Number(localStorage.getItem('wpFontZoom') || 100) + Number(button.dataset.fontAdjust) * 10));
    localStorage.setItem('wpFontZoom', String(zoom));
    document.body.style.zoom = `${zoom}%`;
  }));
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * .045, 30);
        heroVisual.style.setProperty('--parallax-y', `${offset}px`);
        heroVisual.style.setProperty('--parallax-orbit', `${offset * -.55}px`);
        queued = false;
      });
    }, { passive: true });
  }
  window.WellPractice = {
    getProgress: () => JSON.parse(localStorage.getItem('wpProgress') || '{}'),
    saveProgress: value => localStorage.setItem('wpProgress', JSON.stringify(value)),
    getBookmarks: key => JSON.parse(localStorage.getItem(`wpBookmarks-${key}`) || '[]'),
    toggleBookmark(key, id) {
      const items = this.getBookmarks(key);
      const next = items.includes(id) ? items.filter(item => item !== id) : [...items, id];
      localStorage.setItem(`wpBookmarks-${key}`, JSON.stringify(next));
      return next.includes(id);
    },
    toast(message) {
      let toast = document.querySelector('.toast');
      if (!toast) { toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); document.body.append(toast); }
      toast.textContent = message;
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => toast.remove(), 2800);
    }
  };
})();