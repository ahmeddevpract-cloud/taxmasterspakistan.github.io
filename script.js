/* ============================================================
   TAXMASTERS PAKISTAN — script.js  v3.0
   Fully debugged, cross-browser, production-ready
   ============================================================ */
'use strict';

/* ─── HELPERS ─────────────────────────────────────────────── */
const qs  = (s, ctx) => (ctx || document).querySelector(s);
const qsa = (s, ctx) => [...(ctx || document).querySelectorAll(s)];

/* ─── LOADER ──────────────────────────────────────────────── */
/* Hides the intro loader once page assets are ready */
(function initLoader() {
  const loader = qs('#siteLoader');
  if (!loader) return;

  function dismissLoader() {
    loader.classList.add('loader-done');
    /* Remove from DOM after transition so it never blocks clicks */
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    /* Safety net: force-remove after 600 ms regardless */
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 600);
  }

  /* Wait for fonts + images, but cap at 2.8 s total */
  const cap = setTimeout(dismissLoader, 2800);

  if (document.readyState === 'complete') {
    clearTimeout(cap);
    /* Let the fill animation play (1.4 s) before hiding */
    setTimeout(dismissLoader, 1500);
  } else {
    window.addEventListener('load', () => {
      clearTimeout(cap);
      setTimeout(dismissLoader, 1500);
    }, { once: true });
  }
})();

/* ─── NAVBAR SCROLL ───────────────────────────────────────── */
(function initNavScroll() {
  const nav = qs('nav');
  if (!nav) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      ticking = false;
    });
  }, { passive: true });
})();

/* ─── HAMBURGER / MOBILE NAV ──────────────────────────────── */
(function initHamburger() {
  const hamburger = qs('.hamburger');
  const mobileNav = qs('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', (e) => {
    /* Stop event reaching the document listener below */
    e.stopPropagation();
    mobileNav.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* Each mobile link closes the menu before navigating */
  qsa('a', mobileNav).forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* Close on outside click — only when menu is open */
  document.addEventListener('click', (e) => {
    if (!mobileNav.classList.contains('open')) return;
    if (mobileNav.contains(e.target) || hamburger.contains(e.target)) return;
    closeMenu();
  });

  /* Close on Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─── ACTIVE NAV LINK ─────────────────────────────────────── */
(function initActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-links a, .mobile-nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const els = qsa('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay, 10) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ─── CARD TILT (desktop hover only) ─────────────────────── */
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  qsa('.service-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const rx = (((e.clientY - r.top)  / r.height) - 0.5) * -5;
      const ry = (((e.clientX - r.left) / r.width)  - 0.5) *  5;
      card.style.transform =
        `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ─── WHATSAPP WIDGET ─────────────────────────────────────── */
(function initWhatsApp() {
  const widget = qs('#waWidget');
  if (!widget) return;

  let timer = null;

  function clearTimer() { if (timer) { clearTimeout(timer); timer = null; } }

  window.toggleWa = function(e) {
    if (e) e.stopPropagation();
    const opening = !widget.classList.contains('open');
    widget.classList.toggle('open', opening);
    clearTimer();
    if (opening) timer = setTimeout(() => widget.classList.remove('open'), 14000);
  };

  window.closeWa = function(e) {
    if (e) e.stopPropagation();
    widget.classList.remove('open');
    clearTimer();
  };

  /* Outside click closes widget */
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      widget.classList.remove('open');
      clearTimer();
    }
  });

  /* Auto-open once per session after 7 s */
  if (!sessionStorage.getItem('wa_shown')) {
    timer = setTimeout(() => {
      widget.classList.add('open');
      sessionStorage.setItem('wa_shown', '1');
      timer = setTimeout(() => widget.classList.remove('open'), 12000);
    }, 7000);
  }
})();

/* ─── FAQ ACCORDION ───────────────────────────────────────── */
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const wasOpen = item.classList.contains('open');
  qsa('.faq-item.open').forEach(el => el.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
};

/* ─── LOGO: protect + fallback ───────────────────────────── */
(function initLogos() {
  qsa('img.logo-img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', e => e.preventDefault());
    /* If logo.png fails to load, nothing breaks */
    img.addEventListener('error', () => { img.style.display = 'none'; });
  });
})();
