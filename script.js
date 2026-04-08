function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

const toggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav-links');

if(toggle){
  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
}

ScrollReveal().reveal('.hero h2',{delay:200});
ScrollReveal().reveal('.card',{interval:150});
