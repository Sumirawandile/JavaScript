// =========================================================
// theme.js – light / dark theme
// PRACTICAL 9: localStorage saves the user's preference
// =========================================================

const KEY = 'theme';

function getSaved() {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
}

function save(theme) {
  try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
}

function apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme(button, onChange) {
  // Use saved choice first, otherwise follow the system setting
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  apply(getSaved() || (prefersDark ? 'dark' : 'light'));

  button.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    apply(next);
    save(next);
    console.log(`Theme changed to ${next} and saved in localStorage`);
    if (onChange) onChange(next);
  });
}
