/* ============================================================
   TAXMASTERS PAKISTAN — script.js  FINAL v5
   Fixes: Cloudflare email, iOS touch, mobile nav, animations
   ============================================================ */
'use strict';

/* ─── LOADER ──────────────────────────────────────────────── */
(function () {
  var loader = document.getElementById('siteLoader');
  if (!loader) return;

  function dismiss() {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(function () {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    }, 500);
  }

  var cap = setTimeout(dismiss, 2800);

  function onReady() {
    clearTimeout(cap);
    setTimeout(dismiss, 1500);
  }

  if (document.readyState === 'complete') {
    onReady();
  } else {
    window.addEventListener('load', onReady, { once: true });
  }
})();

/* ─── NAVBAR SCROLL ───────────────────────────────────────── */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ─── HAMBURGER ───────────────────────────────────────────── */
(function () {
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    /* Do NOT lock body scroll — breaks iOS button taps */
  }

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
  }

  hamburger.setAttribute('aria-expanded', 'false');

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (mobileNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close when a link is tapped */
  var links = mobileNav.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', closeMenu);
  }

  /* Close on outside tap */
  document.addEventListener('click', function (e) {
    if (!mobileNav.classList.contains('open')) return;
    if (mobileNav.contains(e.target) || hamburger.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─── ACTIVE NAV LINK ─────────────────────────────────────── */
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a, .mobile-nav a');
  for (var i = 0; i < links.length; i++) {
    var href = (links[i].getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      links[i].classList.add('active');
    }
  }
})();

/* ─── SCROLL REVEAL ───────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('visible');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var delay = parseInt(entry.target.dataset.delay, 10) || 0;
      setTimeout(function (el) {
        el.classList.add('visible');
      }, delay, entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  for (var i = 0; i < els.length; i++) io.observe(els[i]);
})();

/* ─── CARD TILT — desktop only ────────────────────────────── */
(function () {
  /* Skip entirely on touch devices */
  if (!window.matchMedia || window.matchMedia('(hover: none)').matches) return;
  var cards = document.querySelectorAll('.service-card');
  for (var i = 0; i < cards.length; i++) {
    (function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var rx = (((e.clientY - r.top) / r.height) - 0.5) * -4;
        var ry = (((e.clientX - r.left) / r.width) - 0.5) * 4;
        card.style.transform =
          'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-4px)';
      }, { passive: true });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    })(cards[i]);
  }
})();

/* ─── WHATSAPP WIDGET ─────────────────────────────────────── */
(function () {
  var widget = document.getElementById('waWidget');
  if (!widget) return;
  var timer = null;

  function clearT() { if (timer) { clearTimeout(timer); timer = null; } }

  window.toggleWa = function (e) {
    if (e) e.stopPropagation();
    var opening = !widget.classList.contains('open');
    if (opening) {
      widget.classList.add('open');
      clearT();
      timer = setTimeout(function () { widget.classList.remove('open'); }, 14000);
    } else {
      widget.classList.remove('open');
      clearT();
    }
  };

  window.closeWa = function (e) {
    if (e) e.stopPropagation();
    widget.classList.remove('open');
    clearT();
  };

  document.addEventListener('click', function (e) {
    if (widget.classList.contains('open') && !widget.contains(e.target)) {
      widget.classList.remove('open');
      clearT();
    }
  });

  /* Auto-open once per session */
  if (!sessionStorage.getItem('wa_shown')) {
    timer = setTimeout(function () {
      widget.classList.add('open');
      sessionStorage.setItem('wa_shown', '1');
      timer = setTimeout(function () { widget.classList.remove('open'); }, 12000);
    }, 7000);
  }
})();

/* ─── FAQ ─────────────────────────────────────────────────── */
window.toggleFaq = function (btn) {
  var item = btn.closest('.faq-item');
  if (!item) return;
  var wasOpen = item.classList.contains('open');
  var all = document.querySelectorAll('.faq-item.open');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('open');
  if (!wasOpen) item.classList.add('open');
};

/* ─── EMAIL: rebuild from data attrs to defeat Cloudflare ─── */
/* Usage: <a class="email-link" data-u="user" data-d="domain.com">Send Email</a> */
(function () {
  var links = document.querySelectorAll('.email-link');
  for (var i = 0; i < links.length; i++) {
    (function (el) {
      var u = el.getAttribute('data-u');
      var d = el.getAttribute('data-d');
      if (u && d) {
        el.setAttribute('href', 'mailto:' + u + '@' + d);
      }
    })(links[i]);
  }
})();

/* ─── LOGO: protect & error fallback ─────────────────────── */
(function () {
  var imgs = document.querySelectorAll('.logo-img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].setAttribute('draggable', 'false');
    imgs[i].addEventListener('contextmenu', function (e) { e.preventDefault(); });
    imgs[i].addEventListener('error', function () {
      /* If logo fails, show brand text only — never hide it */
      this.style.display = 'none';
    });
  }
})();
