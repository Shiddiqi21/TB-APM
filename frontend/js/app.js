// ===== SAMPAHPEDIA APP.JS =====

// Console Easter Egg
console.log(`%c
 ____                        _     ____           _ _       
/ ___|  __ _ _ __ ___  _ __ | |_  |  _ \\ ___  __| (_) __ _ 
\\___ \\ / _\` | '_ \` _ \\| '_ \\| __| | |_) / _ \\/ _\` | |/ _\` |
 ___) | (_| | | | | | | |_) | |_  |  __/  __/ (_| | | (_| |
|____/ \\__,_|_| |_| |_| .__/ \\__| |_|   \\___|\\__,_|_|\\__,_|
                       |_|                                   
🌿 Pilah Cerdas, Bumi Bersih
`, 'color:#7CC635;font-weight:bold');

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
if(navbar){
  window.addEventListener('scroll',()=>{
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if(navToggle && navLinks){
  navToggle.addEventListener('click',()=>{
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  // Close menu when a nav link is clicked (mobile)
  navLinks.querySelectorAll('.nav-link').forEach(link=>{
    link.addEventListener('click',()=>{
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
    });
  });
}

// ===== INTERSECTION OBSERVER (REVEAL) =====
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
revealEls.forEach(el=>observer.observe(el));

// ===== STAT COUNTER =====
const statNums = document.querySelectorAll('.stat-num[data-target]');
const counterObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const el = e.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = Math.ceil(target/40);
      const timer = setInterval(()=>{
        current = Math.min(current+step, target);
        el.textContent = current;
        if(current >= target) clearInterval(timer);
      },40);
      counterObs.unobserve(el);
    }
  });
},{threshold:0.5});
statNums.forEach(el=>counterObs.observe(el));

// ===== PAGE FADE IN =====
document.body.style.opacity='0';
window.addEventListener('load',()=>{
  document.body.style.transition='opacity .5s ease';
  document.body.style.opacity='1';
});
