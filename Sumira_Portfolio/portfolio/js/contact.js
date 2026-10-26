// =========================================================
// contact.js – contact form
// PRACTICAL 6: regex validation
// PRACTICAL 8: form fields + input / blur / submit events (live checks)
// PRACTICAL 9: sessionStorage keeps a draft, localStorage keeps sent messages
// =========================================================
import { toast } from './ui.js';

const DRAFT_KEY = 'contact-draft';

const rules = {
  name:    { test: (v) => /^[A-Za-z][A-Za-z\s.'-]{1,49}$/.test(v.trim()),             error: 'Use letters only (2–50 characters).',      ok: 'Looks good' },
  email:   { test: (v) => /^[\w.+-]+@[\w-]+(\.[\w-]+)*\.[A-Za-z]{2,}$/.test(v.trim()), error: 'Enter a valid email, e.g. name@domain.com', ok: 'Valid email' },
  phone:   { test: (v) => v.trim() === '' || /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.trim()), error: 'Enter a 10-digit Indian mobile number.',  ok: 'Valid number' },
  subject: { test: (v) => v !== '',                                                     error: 'Please choose a subject.',                 ok: '' },
  message: { test: (v) => v.trim().length >= 20,                                        error: 'Message must be at least 20 characters.',  ok: 'Thanks for the detail' }
};

function validate(field, force = false) {
  const rule = rules[field.name];
  const wrap = field.closest('.field');
  const msg = wrap.querySelector('.msg');
  const value = field.value;
  const ok = rule.test(value);

  // Don't shout at empty fields while the user is still typing elsewhere
  if (!force && value === '') {
    wrap.classList.remove('valid', 'invalid');
    msg.textContent = '';
    return ok;
  }
  wrap.classList.toggle('invalid', !ok);
  wrap.classList.toggle('valid', ok && value !== '');
  msg.textContent = ok ? (value !== '' ? rule.ok : '') : rule.error;
  return ok;
}

export function initContact() {
  const form = document.getElementById('contact-form');
  const fields = Object.keys(rules).map((name) => form.elements[name]);
  const counter = document.getElementById('char-count');
  const message = form.elements.message;

  const updateCounter = () => { counter.textContent = `${message.value.length} / 500`; };

  // Restore draft (sessionStorage survives a refresh, not a closed tab)
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
    if (draft) {
      fields.forEach((f) => { if (draft[f.name]) f.value = draft[f.name]; });
      toast('Your unsent message draft was restored');
    }
  } catch (e) { /* ignore */ }
  updateCounter();

  const saveDraft = () => {
    const data = Object.fromEntries(fields.map((f) => [f.name, f.value]));
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  };

  // Live checks while typing
  form.addEventListener('input', (e) => {
    if (!rules[e.target.name]) return;
    validate(e.target);
    if (e.target === message) updateCounter();
    saveDraft();
  });

  // Check when leaving a field
  fields.forEach((f) => f.addEventListener('blur', () => { if (f.value !== '') validate(f, true); }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allValid = fields.map((f) => validate(f, true)).every(Boolean);

    if (!allValid) {
      toast('Please fix the highlighted fields', 'error');
      form.querySelector('.field.invalid :is(input, select, textarea)')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    data.sentAt = new Date().toLocaleString('en-IN');
    console.table(data);

    try {
      const sent = JSON.parse(localStorage.getItem('messages') || '[]');
      sent.push(data);
      localStorage.setItem('messages', JSON.stringify(sent));
      sessionStorage.removeItem(DRAFT_KEY);
    } catch (err) { /* ignore */ }

    form.reset();
    fields.forEach((f) => {
      f.closest('.field').classList.remove('valid', 'invalid');
      f.closest('.field').querySelector('.msg').textContent = '';
    });
    updateCounter();
    toast(`Thank you, ${data.name.trim().split(' ')[0]}! Your message has been recorded.`, 'success');
  });
}
