// =========================================================
// projects.js – project cards
// PRACTICAL 10: fetch() + async/await to load JSON
// PRACTICAL 4:  try...catch for errors
// PRACTICAL 5:  filter / map / Set
// PRACTICAL 6:  string search (toLowerCase + includes)
// =========================================================

let allProjects = [];
let activeCategory = 'All';

const card = ({ title, tagline, category, summary, tech, highlight, link }) => `
  <article class="project-card">
    <div class="project-top">
      <span class="project-cat">${category}</span>
      ${highlight ? `<span class="highlight">${highlight}</span>` : ''}
    </div>
    <h3>${title}</h3>
    <p class="tagline">${tagline}</p>
    <p class="summary">${summary}</p>
    <div class="tech-list">${tech.map((t) => `<span>${t}</span>`).join('')}</div>
    ${link ? `<a class="project-link" href="${link}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
  </article>`;

function render() {
  const grid = document.getElementById('project-grid');
  const query = document.getElementById('project-search').value.trim().toLowerCase();

  const list = allProjects.filter((p) => {
    const inCategory = activeCategory === 'All' || p.category === activeCategory;
    const text = [p.title, p.summary, p.tagline, ...p.tech].join(' ').toLowerCase();
    return inCategory && text.includes(query);
  });

  grid.innerHTML = list.length
    ? list.map(card).join('')
    : '<p class="empty">No projects match your search.</p>';

  document.getElementById('project-count').textContent =
    `Showing ${list.length} of ${allProjects.length} projects`;
}

function buildFilters() {
  const box = document.getElementById('project-filters');
  const categories = ['All', ...new Set(allProjects.map((p) => p.category))];
  box.innerHTML = categories
    .map((c) => `<button class="chip ${c === activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`)
    .join('');

  box.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    box.querySelectorAll('.chip').forEach((b) => b.classList.toggle('active', b === chip));
    render();
  });
}

export async function loadProjects() {
  const grid = document.getElementById('project-grid');
  grid.innerHTML = '<p class="loading">Loading projects…</p>';

  try {
    const response = await fetch('data/projects.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    allProjects = await response.json();

    buildFilters();
    render();
    document.getElementById('project-search').addEventListener('input', render);
    console.log(`fetch(): loaded ${allProjects.length} projects`);
  } catch (error) {
    console.error('Could not load projects:', error);
    grid.innerHTML = `<p class="error-box">Could not load projects (${error.message}).
      Open this site with VS Code Live Server, not by double-clicking the file.</p>`;
  }
}
