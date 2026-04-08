function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:'smooth'});
}

ScrollReveal().reveal('.hero h2',{delay:200});
ScrollReveal().reveal('.card',{interval:150});
