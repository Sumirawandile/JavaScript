// =========================================================
// tools.js – the 5 mini apps in the Toolkit section
// =========================================================
import { escapeHTML, toast } from './ui.js';

// ---------- Tabs (PRACTICAL 12: jQuery events + effects) ----------
export function initTabs() {
  $('.tab').on('click', function () {
    const id = $(this).data('tab');
    $('.tab').removeClass('active').attr('aria-selected', 'false');
    $(this).addClass('active').attr('aria-selected', 'true');
    $('.panel').removeClass('active').hide();
    $(`#tab-${id}`).addClass('active').fadeIn(250);
  });
}

// =========================================================
// PRACTICAL 3 – Grade calculator
// Control structures (for...of, if/else if, switch) + form validation
// =========================================================
export function initGrade() {
  const form = document.getElementById('grade-form');
  const out = document.getElementById('grade-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const marks = [];
    let valid = true;

    for (const input of form.querySelectorAll('.mark')) {
      const raw = input.value.trim();
      const mark = Number(raw);
      if (raw === '' || isNaN(mark) || mark < 0 || mark > 100) {
        input.classList.add('invalid');
        valid = false;
      } else {
        input.classList.remove('invalid');
        marks.push({ subject: input.dataset.subject, mark });
      }
    }

    if (!valid) {
      out.innerHTML = '<p class="bad">Please enter marks between 0 and 100 for every subject.</p>';
      return;
    }

    const total = marks.reduce((sum, m) => sum + m.mark, 0);
    const avg = total / marks.length;

    let grade, point;
    if (avg >= 90) { grade = 'O'; point = 10; }
    else if (avg >= 80) { grade = 'A+'; point = 9; }
    else if (avg >= 70) { grade = 'A'; point = 8; }
    else if (avg >= 60) { grade = 'B+'; point = 7; }
    else if (avg >= 50) { grade = 'B'; point = 6; }
    else if (avg >= 40) { grade = 'C'; point = 5; }
    else { grade = 'F'; point = 0; }

    let remark;
    switch (grade) {
      case 'O': remark = 'Outstanding performance'; break;
      case 'A+':
      case 'A': remark = 'Excellent work'; break;
      case 'F': remark = 'Needs improvement'; break;
      default: remark = 'Good, keep improving';
    }

    const failed = marks.filter((m) => m.mark < 40);

    out.innerHTML = `
      <div class="result-card">
        <div class="result-head">
          <div class="grade-pill ${grade === 'F' ? 'fail' : ''}">${grade}</div>
          <div>
            <h3>${remark}</h3>
            <p>Total ${total} / ${marks.length * 100} · Average ${avg.toFixed(2)}% · Grade point ${point}</p>
          </div>
        </div>
        <ul class="sub-list">
          ${marks.map(({ subject, mark }) => `
            <li><span>${subject}</span>
              <span class="bar"><i class="${mark < 40 ? 'low' : ''}" style="width:${mark}%"></i></span>
              <span class="${mark < 40 ? 'bad' : 'good'}">${mark}</span></li>`).join('')}
        </ul>
        ${failed.length ? `<p class="bad" style="margin-top:10px">Backlog in: ${failed.map((f) => f.subject).join(', ')}</p>` : ''}
      </div>`;
  });
}

// =========================================================
// PRACTICAL 4 – Palindrome checker
// Function types, scope, closure, try...catch
// =========================================================

// 1. Function declaration
function cleanText(str) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// 2. Function expression
const reverseString = function (str) {
  return str.split('').reverse().join('');
};

// 3. Arrow function
const isPalindrome = (str) => {
  const cleaned = cleanText(str);
  return cleaned === reverseString(cleaned);
};

// 4. Closure: "count" stays private but remembered between calls
function makeCounter() {
  let count = 0;
  return () => ++count;
}

export function initPalindrome() {
  const form = document.getElementById('pal-form');
  const input = document.getElementById('pal-input');
  const out = document.getElementById('pal-result');
  const countEl = document.getElementById('pal-count');
  const nextCheck = makeCounter();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const value = input.value;
      if (!value.trim()) throw new Error('Please type a word or sentence first.');
      if (!cleanText(value)) throw new Error('Add at least one letter or number.');

      const result = isPalindrome(value);
      countEl.textContent = nextCheck();
      out.innerHTML = `
        <div class="result-card">
          <p class="${result ? 'good' : 'bad'}">"${escapeHTML(value)}" ${result ? 'is a palindrome' : 'is not a palindrome'}.</p>
          <p class="hint">Cleaned: <code>${cleanText(value)}</code> · Reversed: <code>${reverseString(cleanText(value))}</code></p>
        </div>`;
    } catch (err) {
      out.innerHTML = `<p class="bad">${err.message}</p>`;
    } finally {
      console.log('Palindrome check finished');
    }
  });
}

// =========================================================
// PRACTICAL 6 – Text analyzer (string methods + regex)
// =========================================================
export function initTextAnalyzer() {
  const ta = document.getElementById('text-input');
  const statsBox = document.getElementById('text-stats');
  const extractBox = document.getElementById('text-extract');

  const analyse = () => {
    const text = ta.value;
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
    const vowels = (text.match(/[aeiou]/gi) || []).length;

    const emails = text.match(/[\w.+-]+@[\w-]+(\.[\w-]+)*\.[a-z]{2,}/gi) || [];
    const urls = text.match(/https?:\/\/[^\s,]+[^\s,.]/g) || [];
    const phones = text.match(/\b[6-9]\d{9}\b/g) || [];

    // Most used words (longer than 3 letters)
    const freq = {};
    words
      .map((w) => w.toLowerCase().replace(/[^a-z]/g, ''))
      .filter((w) => w.length > 3)
      .forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 3);

    statsBox.innerHTML = [
      ['Characters', text.length],
      ['Words', words.length],
      ['Sentences', sentences],
      ['Vowels', vowels],
      ['Read time', `${Math.max(1, Math.ceil(words.length / 200))} min`]
    ].map(([label, val]) => `<div><strong>${val}</strong><span>${label}</span></div>`).join('');

    const tags = (arr) => arr.length ? arr.map((x) => `<span class="tag">${escapeHTML(x)}</span>`).join('') : 'None found';
    extractBox.innerHTML = `
      <p><b>Emails:</b>${tags(emails)}</p>
      <p><b>Links:</b>${tags(urls)}</p>
      <p><b>Phone numbers:</b>${tags(phones)}</p>
      <p><b>Top words:</b>${top.length ? top.map(([w, n]) => `<span class="tag">${w} (${n})</span>`).join('') : 'None'}</p>`;
  };

  ta.addEventListener('input', analyse);
  document.getElementById('btn-upper').addEventListener('click', () => { ta.value = ta.value.toUpperCase(); analyse(); });
  document.getElementById('btn-title').addEventListener('click', () => {
    ta.value = ta.value.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
    analyse();
  });
  document.getElementById('btn-reverse').addEventListener('click', () => { ta.value = ta.value.split('').reverse().join(''); analyse(); });
  document.getElementById('btn-clear').addEventListener('click', () => { ta.value = ''; analyse(); ta.focus(); });
  analyse();
}

// =========================================================
// PRACTICAL 7 + 9 – Task list (DOM traversal + localStorage)
// =========================================================
const TASK_KEY = 'portfolio-tasks';

export function initTodo() {
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const list = document.getElementById('todo-list');
  const countEl = document.getElementById('todo-count');

  let tasks;
  try { tasks = JSON.parse(localStorage.getItem(TASK_KEY)); } catch (e) { tasks = null; }
  if (!Array.isArray(tasks)) {
    tasks = [
      { id: 1, text: 'Prepare for JavaScript Lab viva', done: false },
      { id: 2, text: 'Push portfolio code to GitHub', done: true },
      { id: 3, text: 'Revise Operating Systems for GATE', done: false }
    ];
  }

  const save = () => {
    try { localStorage.setItem(TASK_KEY, JSON.stringify(tasks)); } catch (e) { /* ignore */ }
  };

  const render = () => {
    list.innerHTML = '';
    if (!tasks.length) {
      list.innerHTML = '<li class="empty">No tasks yet. Add one above.</li>';
    }
    tasks.forEach((task) => {
      const li = document.createElement('li');
      li.dataset.id = task.id;
      if (task.done) li.classList.add('done');
      li.innerHTML = `
        <input type="checkbox" ${task.done ? 'checked' : ''} aria-label="Mark as done">
        <span class="text"></span>
        <div class="actions"><button class="edit" type="button">Edit</button><button class="del" type="button">Delete</button></div>`;
      li.querySelector('.text').textContent = task.text;   // textContent = safe
      list.appendChild(li);
    });
    const left = tasks.filter((t) => !t.done).length;
    countEl.textContent = `${left} pending · ${tasks.length - left} done`;
    save();
  };

  // Add
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) { toast('Type a task first', 'error'); return; }
    tasks.push({ id: Date.now(), text, done: false });
    input.value = '';
    render();
  });

  // Edit / Save / Delete via event delegation + DOM traversal
  list.addEventListener('click', (e) => {
    const li = e.target.closest('li');
    if (!li || !li.dataset.id) return;
    const task = tasks.find((t) => t.id === Number(li.dataset.id));

    if (e.target.classList.contains('del')) {
      tasks = tasks.filter((t) => t !== task);
      render();
    } else if (e.target.classList.contains('edit')) {
      // Traversal: button → parent .actions → previous sibling .text
      const span = e.target.parentElement.previousElementSibling;
      const editor = document.createElement('input');
      editor.className = 'edit-input';
      editor.value = span.textContent;
      span.replaceWith(editor);
      editor.focus();
      e.target.textContent = 'Save';
      e.target.classList.replace('edit', 'save');
    } else if (e.target.classList.contains('save')) {
      const value = li.querySelector('.edit-input').value.trim();
      if (!value) { toast('Task cannot be empty', 'error'); return; }
      task.text = value;
      render();
    }
  });

  // Enter key saves an edit
  list.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.classList.contains('edit-input')) {
      e.target.closest('li').querySelector('.save').click();
    }
  });

  // Tick / untick
  list.addEventListener('change', (e) => {
    if (e.target.type !== 'checkbox') return;
    const task = tasks.find((t) => t.id === Number(e.target.closest('li').dataset.id));
    task.done = e.target.checked;
    render();
  });

  document.getElementById('todo-clear').addEventListener('click', () => {
    tasks = tasks.filter((t) => !t.done);
    render();
  });

  render();
}

// =========================================================
// PRACTICAL 2 + 5 – Bill splitter
// var / let / const, destructuring, template literals,
// array methods (reduce, map) and discount logic
// =========================================================
export function initBill() {
  var currency = '₹';                 // var: function-scoped (kept to show the difference)
  const GST_RATE = 0.05;              // const: never reassigned
  const COUPONS = { STUDENT10: 0.10, SIT15: 0.15 };
  let items = [                        // let: reassigned when items are removed
    { name: 'Pizza', price: 450, qty: 2 },
    { name: 'Cold Coffee', price: 120, qty: 3 },
    { name: 'Fries', price: 150, qty: 1 }
  ];

  const form = document.getElementById('bill-form');
  const list = document.getElementById('bill-items');
  const summary = document.getElementById('bill-summary');
  const couponInput = document.getElementById('coupon');
  const peopleInput = document.getElementById('people');

  const fmt = (n) => `${currency}${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const render = () => {
    list.innerHTML = items.length
      ? items.map(({ name, price, qty }, i) => `
          <li><span>${escapeHTML(name)} × ${qty}</span>
          <span>${fmt(price * qty)}<button class="remove" data-index="${i}" aria-label="Remove ${escapeHTML(name)}">×</button></span></li>`).join('')
      : '<li class="empty">Cart is empty. Add an item above.</li>';

    const subtotal = items.reduce((sum, { price, qty }) => sum + price * qty, 0);
    const bulkRate = subtotal >= 1000 ? 0.05 : 0;
    const code = couponInput.value.trim().toUpperCase();
    const couponRate = COUPONS[code] ?? 0;
    const discount = subtotal * (bulkRate + couponRate);
    const gst = (subtotal - discount) * GST_RATE;
    const total = subtotal - discount + gst;
    const people = Math.max(1, parseInt(peopleInput.value, 10) || 1);

    let couponNote = '';
    if (code && couponRate) couponNote = ` (${code} applied)`;
    else if (code) couponNote = ' (invalid code)';

    summary.innerHTML = `
      <div><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      <div><span>Bulk discount ${bulkRate ? '5%' : '(above ₹1,000)'}</span><span>− ${fmt(subtotal * bulkRate)}</span></div>
      <div><span>Coupon${couponNote}</span><span>− ${fmt(subtotal * couponRate)}</span></div>
      <div><span>GST 5%</span><span>+ ${fmt(gst)}</span></div>
      <div class="total"><span>Total</span><span>${fmt(total)}</span></div>
      <div><span>Each person pays (${people})</span><span class="per-head">${fmt(total / people)}</span></div>`;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);
    const qty = parseInt(document.getElementById('item-qty').value, 10);

    if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty < 1) {
      toast('Enter an item name, a price above 0 and a quantity of at least 1', 'error');
      return;
    }
    items.push({ name, price, qty });
    form.reset();
    document.getElementById('item-qty').value = 1;
    render();
  });

  list.addEventListener('click', (e) => {
    if (!e.target.classList.contains('remove')) return;
    const index = Number(e.target.dataset.index);
    items = items.filter((_, i) => i !== index);
    render();
  });

  couponInput.addEventListener('input', render);
  peopleInput.addEventListener('input', render);
  render();
}
