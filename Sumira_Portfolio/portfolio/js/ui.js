// =========================================================
// ui.js – page behaviour
// PRACTICAL 11: setTimeout / setInterval (typing, counters, clock, countdown)
// PRACTICAL 7:  DOM updates
// PRACTICAL 9:  localStorage + sessionStorage (visit tracking)
// =========================================================

// Safe text for innerHTML (stops user input from becoming HTML)
export const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

// ---------- Greeting based on time ----------
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  else if (hour < 17) return 'Good afternoon';
  else return 'Good evening';
}

// ---------- Typing effect (recursive setTimeout) ----------
export function typeRoles(el, words, { typeSpeed = 85, eraseSpeed = 40, hold = 1500 } = {}) {
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const word = words[wordIndex];
    el.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(tick, typeSpeed);
    } else if (!deleting) {
      deleting = true;
      setTimeout(tick, hold);            // pause on the full word
    } else if (charIndex > 0) {
      charIndex--;
      setTimeout(tick, eraseSpeed);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(tick, 300);
    }
  }
  tick();
}

// ---------- Animated counters (setInterval + clearInterval) ----------
export function animateCounters(elements) {
  elements.forEach((el) => {
    const target = parseFloat(el.dataset.target);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const steps = 40;
    let step = 0;

    const id = setInterval(() => {
      step++;
      el.textContent = (target * step / steps).toFixed(decimals) + suffix;
      if (step >= steps) {
        clearInterval(id);
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }, 30);
  });
}

// ---------- Live clock ----------
export function startClock(el) {
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  update();
  return setInterval(update, 1000);
}

// ---------- Countdown ----------
export function startCountdown(targetDate, els) {
  const pad = (n) => String(n).padStart(2, '0');
  const tick = () => {
    const diff = Math.max(0, targetDate - Date.now());
    els.days.textContent = Math.floor(diff / 86400000);
    els.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    els.mins.textContent = pad(Math.floor(diff / 60000) % 60);
    els.secs.textContent = pad(Math.floor(diff / 1000) % 60);
  };
  tick();
  return setInterval(tick, 1000);
}

// ---------- Visit tracking ----------
// localStorage  = survives closing the browser (total visits)
// sessionStorage = only for this tab session (so a refresh is not a new visit)
export function trackVisits() {
  let count = 1, lastVisit = null, newSession = true;
  try {
    count = Number(localStorage.getItem('visits') || 0);
    lastVisit = localStorage.getItem('lastVisit');
    newSession = !sessionStorage.getItem('sessionStarted');
    if (newSession) {
      count++;
      sessionStorage.setItem('sessionStarted', 'yes');
      localStorage.setItem('visits', count);
      localStorage.setItem('lastVisit', new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
    }
  } catch (e) { /* storage blocked */ }
  return { count: count || 1, lastVisit, newSession };
}

// ---------- Reveal sections on scroll ----------
export function revealOnScroll(onVisible) {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (onVisible) onVisible(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

// ---------- Scroll effects: progress bar, nav shadow, active link, back-to-top ----------
export function scrollEffects() {
  const bar = document.getElementById('progress');
  const nav = document.querySelector('.navbar');
  const toTop = document.getElementById('to-top');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    nav.classList.toggle('scrolled', window.scrollY > 10);
    toTop.classList.toggle('show', window.scrollY > 600);

    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---------- Mobile menu (jQuery – Practical 12) ----------
export function initMenu() {
  const $btn = $('#menu-toggle');
  const $menu = $('#nav-links');
  $btn.on('click', () => {
    const open = $menu.toggleClass('open').hasClass('open');
    $btn.attr('aria-expanded', open);
  });
  $menu.on('click', 'a', () => {
    $menu.removeClass('open');
    $btn.attr('aria-expanded', false);
  });
}

// ---------- Toast message ----------
let toastTimer;
export function toast(message, type = 'info') {
  const box = document.getElementById('toast');
  box.textContent = message;
  box.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { box.className = 'toast'; }, 3200);
}
