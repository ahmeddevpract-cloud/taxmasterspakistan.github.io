// Smooth Scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({
    behavior: 'smooth'
  });
}

// Mobile Menu
const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-links');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

// SCROLL ANIMATIONS (Premium Feel)
ScrollReveal().reveal('.hero h2', {
  delay: 200,
  distance: '60px',
  origin: 'bottom',
  duration: 800
});

ScrollReveal().reveal('.hero p', {
  delay: 400,
  distance: '60px',
  origin: 'bottom',
  duration: 800
});

ScrollReveal().reveal('.card', {
  interval: 150,
  distance: '70px',
  origin: 'bottom',
  duration: 800
});

ScrollReveal().reveal('.feature', {
  interval: 120,
  distance: '50px'
});

ScrollReveal().reveal('.cta', {
  delay: 200,
  scale: 0.9
});
