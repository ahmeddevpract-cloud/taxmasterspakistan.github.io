/* ============================================================
   TAXMASTERS PAKISTAN — script.js  Final Production
   ============================================================ */
'use strict';

/* ── Loader ────────────────────────────────────────────────── */
(function () {
  var el = document.getElementById('siteLoader');
  if (!el) return;
  function hide() {
    el.classList.add('done');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
  }
  var cap = setTimeout(hide, 2800);
  function go() { clearTimeout(cap); setTimeout(hide, 1500); }
  if (document.readyState === 'complete') { go(); }
  else { window.addEventListener('load', go, { once: true }); }
}());

/* ── Navbar scroll ──────────────────────────────────────────── */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var t = false;
  window.addEventListener('scroll', function () {
    if (t) return; t = true;
    requestAnimationFrame(function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      t = false;
    });
  }, { passive: true });
}());

/* ── Hamburger / mobile nav ─────────────────────────────────── */
(function () {
  var btn = document.querySelector('.hamburger');
  var panel = document.querySelector('.mobile-nav');
  if (!btn || !panel) return;

  function close() {
    btn.classList.remove('open');
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }
  function open() {
    btn.classList.add('open');
    panel.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }

  btn.setAttribute('aria-expanded', 'false');

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    panel.classList.contains('open') ? close() : open();
  });

  /* Each nav link closes the panel then follows href normally */
  var links = panel.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', close);
  }

  /* Close on tap outside */
  document.addEventListener('click', function (e) {
    if (!panel.classList.contains('open')) return;
    if (panel.contains(e.target) || btn.contains(e.target)) return;
    close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
}());

/* ── Active nav link ────────────────────────────────────────── */
(function () {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  var all = document.querySelectorAll('.nav-links a, .mobile-nav a');
  for (var i = 0; i < all.length; i++) {
    var href = (all[i].getAttribute('href') || '').split('/').pop();
    if (href === page || (page === '' && href === 'index.html')) {
      all[i].classList.add('active');
    }
  }
}());

/* ── Scroll reveal ──────────────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  /* Never reveal footer elements */
  var filtered = [];
  for (var i = 0; i < els.length; i++) {
    if (!els[i].closest('footer')) filtered.push(els[i]);
  }

  if (!('IntersectionObserver' in window)) {
    for (var j = 0; j < filtered.length; j++) filtered[j].classList.add('visible');
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var delay = parseInt(e.target.dataset.delay, 10) || 0;
      setTimeout(function (el) { el.classList.add('visible'); }, delay, e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  for (var k = 0; k < filtered.length; k++) io.observe(filtered[k]);
}());

/* ── WhatsApp widget ────────────────────────────────────────── */
(function () {
  var w = document.getElementById('waWidget');
  if (!w) return;
  var timer = null;
  function clearT() { if (timer) { clearTimeout(timer); timer = null; } }

  window.toggleWa = function (e) {
    if (e) e.stopPropagation();
    var opening = !w.classList.contains('open');
    w.classList.toggle('open', opening);
    clearT();
    if (opening) timer = setTimeout(function () { w.classList.remove('open'); }, 14000);
  };
  window.closeWa = function (e) {
    if (e) e.stopPropagation();
    w.classList.remove('open'); clearT();
  };

  document.addEventListener('click', function (e) {
    if (w.classList.contains('open') && !w.contains(e.target)) {
      w.classList.remove('open'); clearT();
    }
  });

  if (!sessionStorage.getItem('wa_shown')) {
    timer = setTimeout(function () {
      w.classList.add('open');
      sessionStorage.setItem('wa_shown', '1');
      timer = setTimeout(function () { w.classList.remove('open'); }, 12000);
    }, 7000);
  }
}());

/* ── FAQ ────────────────────────────────────────────────────── */
window.toggleFaq = function (btn) {
  var item = btn.closest('.faq-item');
  if (!item) return;
  var wasOpen = item.classList.contains('open');
  var all = document.querySelectorAll('.faq-item.open');
  for (var i = 0; i < all.length; i++) all[i].classList.remove('open');
  if (!wasOpen) item.classList.add('open');
};

/* ── Email: rebuild href to defeat Cloudflare mangling ─────── */
(function () {
  var links = document.querySelectorAll('.email-link');
  for (var i = 0; i < links.length; i++) {
    var u = links[i].getAttribute('data-u');
    var d = links[i].getAttribute('data-d');
    if (u && d) links[i].setAttribute('href', 'mailto:' + u + '@' + d);
  }
}());

/* ── Logo: error fallback ───────────────────────────────────── */
(function () {
  var imgs = document.querySelectorAll('img.logo-img');
  for (var i = 0; i < imgs.length; i++) {
    imgs[i].setAttribute('draggable', 'false');
    imgs[i].addEventListener('contextmenu', function (e) { e.preventDefault(); });
    /* If logo.png fails to load, hide broken-image icon but keep brand text */
    imgs[i].addEventListener('error', function () { this.style.display = 'none'; });
  }
}());
