// =========================================================
// sections.js – builds About, Timeline, Skills, Achievements
// PRACTICAL 2: destructuring + template literals
// PRACTICAL 5: map, filter, forEach, Set on arrays of objects
// PRACTICAL 7: DOM updates
// =========================================================
import { profile, stats, timeline, skills, achievements, certifications } from './data.js';

// ---------- About ----------
export function renderAbout() {
  // Object destructuring
  const { name, college, degree, year, cgpa, interests } = profile;

  document.getElementById('about-text').innerHTML = `
    <p>I'm <strong>${name}</strong>, a ${year} student pursuing a <strong>${degree}</strong> at ${college},
       with a CGPA of <strong>${cgpa}</strong>.</p>
    <p>I enjoy working where data meets engineering. During my internship I built Python scripts that
       turned large JSON files into SQL at scale for a live production system. I have also presented
       a research paper on AI-based disaster resource allocation at ICCIS, BITS Pilani Goa.</p>
    <p>I'm currently strengthening my DSA and Java backend skills, and I'm looking for internships in
       <strong>Data Analytics, Data Science or Software Engineering</strong>.</p>
    <div class="interests">${interests.map((i) => `<span class="tag">${i}</span>`).join('')}</div>
  `;

  document.getElementById('stats').innerHTML = stats
    .map(({ label, value, decimals = 0, suffix = '' }) => `
      <div class="stat">
        <strong class="counter" data-target="${value}" data-decimals="${decimals}" data-suffix="${suffix}">0</strong>
        <span>${label}</span>
      </div>`)
    .join('');
}

// ---------- Timeline ----------
export function renderTimeline() {
  const list = document.getElementById('timeline');
  list.innerHTML = '';
  timeline.forEach(({ type, date, title, org, points }) => {
    const li = document.createElement('li');
    li.className = `tl-item ${type}`;
    li.innerHTML = `
      <div class="tl-card">
        <div class="tl-top">
          <h3>${title}<span class="badge ${type}">${type === 'work' ? 'Experience' : 'Education'}</span></h3>
          <span class="tl-date">${date}</span>
        </div>
        <p class="tl-org">${org}</p>
        <ul>${points.map((p) => `<li>${p}</li>`).join('')}</ul>
      </div>`;
    list.appendChild(li);
  });
}

// ---------- Skills with category filter ----------
const initials = (name) => name.replace(/[^A-Za-z ]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export function renderSkills() {
  const filterBox = document.getElementById('skill-filters');
  const grid = document.getElementById('skill-grid');
  const categories = ['All', ...new Set(skills.map((s) => s.cat))];   // unique categories

  filterBox.innerHTML = categories
    .map((c, i) => `<button class="chip ${i === 0 ? 'active' : ''}" data-cat="${c}">${c}</button>`)
    .join('');

  const show = (cat) => {
    const list = cat === 'All' ? skills : skills.filter((s) => s.cat === cat);
    grid.innerHTML = list
      .map(({ name, cat: c }) => `
        <div class="skill">
          <span class="skill-icon">${initials(name)}</span>
          <div><b>${name}</b><small>${c}</small></div>
        </div>`)
      .join('');
  };

  // Event delegation: one listener for all chips
  filterBox.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filterBox.querySelectorAll('.chip').forEach((b) => b.classList.remove('active'));
    chip.classList.add('active');
    show(chip.dataset.cat);
  });

  show('All');
}

// ---------- Achievements + certifications ----------
const ICONS = {
  research: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M8 7h8M8 11h6"/></svg>',
  trophy: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3a3 3 0 0 1-3 4M7 5H4a3 3 0 0 0 3 4"/></svg>'
};

// "View certificate" link (opens in a new tab)
const certLink = (file) =>
  file ? `<a class="cert-link" href="${file}" target="_blank" rel="noopener">View certificate ↗</a>` : '';

// Hide links whose local file is not in the folder yet (async + fetch HEAD request)
async function hideMissingCertificates() {
  const links = [...document.querySelectorAll('.cert-link')].filter((a) => !/^https?:/.test(a.getAttribute('href')));
  await Promise.all(links.map(async (a) => {
    try {
      const res = await fetch(a.getAttribute('href'), { method: 'HEAD' });
      if (!res.ok) a.remove();
    } catch (e) {
      a.remove();
    }
  }));
}

export function renderAchievements() {
  document.getElementById('achievement-list').innerHTML = achievements
    .map(({ featured, tag, title, place, text, file }) => `
      <article class="achievement ${featured ? 'featured' : ''}">
        <div class="ach-icon">${featured ? ICONS.research : ICONS.trophy}</div>
        <div>
          <h3>${title}</h3>
          <p class="meta">${tag} · ${place}</p>
          <p>${text}</p>
          ${certLink(file)}
        </div>
      </article>`)
    .join('');

  document.getElementById('cert-list').innerHTML = certifications
    .map(({ name, by, file }) => `<li><div><b>${name}</b><small>${by}</small></div>${certLink(file)}</li>`)
    .join('');

  hideMissingCertificates();
}
