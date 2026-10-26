// =========================================================
// main.js – entry point
// PRACTICAL 1:  external JS file + console methods
// PRACTICAL 11: ES6 modules (import)
// =========================================================
import { profile } from './data.js';
import { initTheme } from './theme.js';
import {
  typeRoles, animateCounters, startClock, startCountdown,
  trackVisits, revealOnScroll, scrollEffects, initMenu, toast
} from './ui.js';
import { renderAbout, renderTimeline, renderSkills, renderAchievements } from './sections.js';
import { loadProjects } from './projects.js';
import { initContact } from './contact.js';

console.time('Portfolio ready');

// ---------- Console methods (Practical 1) ----------
console.log('%cSumira Wandile · Portfolio', 'font: 600 16px "Source Serif 4", serif; color: #1d4ed8;');
console.info('Built with HTML, CSS, vanilla JavaScript (ES6 modules) and jQuery.');
console.group('Visitor details');
console.log('Screen size:', `${window.innerWidth} × ${window.innerHeight}`);
console.log('Language:', navigator.language);
console.log('Online:', navigator.onLine);
console.groupEnd();

// ---------- Theme ----------
initTheme(document.getElementById('theme-toggle'), (theme) => toast(`${theme === 'dark' ? 'Dark' : 'Light'} theme saved`));

// ---------- Hero ----------
const visits = trackVisits();
typeRoles(document.getElementById('typed'), profile.roles);
startCountdown(new Date('2028-05-31T00:00:00+05:30'), {
  days: document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  mins: document.getElementById('cd-mins'),
  secs: document.getElementById('cd-secs')
});

// ---------- Static sections ----------
renderAbout();
renderTimeline();
renderSkills();
renderAchievements();

// ---------- Data loaded from JSON ----------
loadProjects();     // fetch()

// ---------- Contact ----------
initContact();

// ---------- Page behaviour ----------
initMenu();
scrollEffects();
revealOnScroll((el) => {
  // Start the counters only when the About section becomes visible
  const counters = el.querySelectorAll('.counter');
  if (counters.length) animateCounters(counters);
});

// ---------- Footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
startClock(document.getElementById('clock'));
document.getElementById('visit-count').textContent =
  `Visit #${visits.count} from this browser`;

console.timeEnd('Portfolio ready');
