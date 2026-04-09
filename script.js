/* ============================================================
   TAXMASTERS PAKISTAN — script.js
   Performance: passive listeners, requestAnimationFrame
   Security: DOMPurify-safe, no eval, no innerHTML
   ============================================================ */

'use strict';

/* ─── HELPERS ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── NAVBAR SCROLL ───────────────────────────────────────── */
(function initNavScroll() {
  const nav = $('nav');
  if (!nav) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ─── HAMBURGER ───────────────────────────────────────────── */
(function initHamburger() {
  const btn   = $('.hamburger');
  const panel = $('.mobile-nav');
  const nav   = $('nav');
  if (!btn || !panel) return;

  function close() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function open() {
    btn.classList.add('open');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'mobileNav');
  panel.id = 'mobileNav';

  btn.addEventListener('click', () => {
    panel.classList.contains('open') ? close() : open();
  });

  // Close on any link click inside panel
  $$('a', panel).forEach(a => a.addEventListener('click', close));

  // Close on outside tap/click
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') &&
        !nav.contains(e.target) &&
        !panel.contains(e.target)) {
      close();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

/* ─── ACTIVE NAV LINK ─────────────────────────────────────── */
(function initActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  $$('.nav-links a, .mobile-nav a').forEach(a => {
    const linkPage = (a.getAttribute('href') || '').split('/').pop();
    const isHome   = (page === '' || page === 'index.html');

    if (linkPage === page) {
      a.classList.add('active');
    } else if (isHome && linkPage === 'index.html') {
      a.classList.add('active');
    }
  });
})();

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const els = $$('.reveal');
  if (!els.length) return;

  // Instant fallback for browsers without IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay, 10) || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ─── SMOOTH HASH SCROLL ──────────────────────────────────── */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const target = $(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ─── CARD TILT ───────────────────────────────────────────── */
(function initTilt() {
  // Skip on touch devices — tilt is a hover effect
  if (window.matchMedia('(hover: none)').matches) return;

  $$('.service-card, .contact-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r    = card.getBoundingClientRect();
      const rotX = (((e.clientY - r.top)  / r.height) - 0.5) * -6;
      const rotY = (((e.clientX - r.left) / r.width)  - 0.5) *  6;
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-5px)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── WHATSAPP WIDGET ─────────────────────────────────────── */
(function initWhatsApp() {
  const widget = $('#waWidget');
  if (!widget) return;

  let autoCloseTimer = null;

  window.toggleWa = function() {
    const isOpen = widget.classList.toggle('open');
    if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null; }
    if (isOpen) {
      // Auto-close after 14 s of no interaction
      autoCloseTimer = setTimeout(() => widget.classList.remove('open'), 14000);
    }
  };

  window.closeWa = function() {
    widget.classList.remove('open');
    if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null; }
  };

  // Auto-open after 7 s on first visit
  const hasOpened = sessionStorage.getItem('wa_opened');
  if (!hasOpened) {
    setTimeout(() => {
      widget.classList.add('open');
      sessionStorage.setItem('wa_opened', '1');
      autoCloseTimer = setTimeout(() => widget.classList.remove('open'), 12000);
    }, 7000);
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      window.closeWa();
    }
  });
})();

/* ─── FAQ ACCORDION ───────────────────────────────────────── */
window.toggleFaq = function(btn) {
  const item   = btn.closest('.faq-item');
  if (!item) return;
  const isOpen = item.classList.contains('open');
  // Close all
  $$('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
  });
  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
};

/* ─── SECURITY: disable right-click on logo only ─────────────
   (Prevents casual image scraping of branding assets)        */
(function protectLogo() {
  const logos = $$('.nav-logo img, .footer-brand img');
  logos.forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.setAttribute('draggable', 'false');
  });
})();
