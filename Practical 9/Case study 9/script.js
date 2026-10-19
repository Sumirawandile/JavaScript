/* Preference Manager
   - Preferences go to localStorage OR sessionStorage (user's choice)
   - Session demo note + page-load counter use sessionStorage
   - Total visits use localStorage */

const DEFAULTS = { name: "", theme: "classic", size: "md" };
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ---------- Safe helpers ----------
function read(area, key) {
  try { return JSON.parse(area.getItem(key)); } catch { return null; }
}
function write(area, key, value) {
  try { area.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

// ---------- State ----------
let mode = localStorage.getItem("mode") || "local";
let prefs = { ...DEFAULTS, ...(read(sessionStorage, "prefs") || read(localStorage, "prefs") || {}) };

const area = () => (mode === "local" ? localStorage : sessionStorage);

// ---------- Apply to page ----------
function apply() {
  document.documentElement.setAttribute("data-theme", prefs.theme);
  document.documentElement.setAttribute("data-size", prefs.size);
  $("#greeting").textContent = prefs.name ? `Hello, ${prefs.name}!` : "Hello, Guest!";

  $$('input[name="theme"]').forEach((r) => (r.checked = r.value === prefs.theme));
  $$('input[name="size"]').forEach((r) => (r.checked = r.value === prefs.size));
  $$('input[name="mode"]').forEach((r) => (r.checked = r.value === mode));
  if (document.activeElement !== $("#name")) $("#name").value = prefs.name;
}

// ---------- Save ----------
let timer;
function save() {
  const other = mode === "local" ? sessionStorage : localStorage;
  other.removeItem("prefs");
  const ok = write(area(), "prefs", prefs);
  localStorage.setItem("mode", mode);

  const where = mode === "local" ? "localStorage" : "sessionStorage";
  $("#note").textContent = ok ? `Saved to ${where}` : "Could not save (storage blocked)";
  clearTimeout(timer);
  timer = setTimeout(() => ($("#note").textContent = ""), 2000);
}

// ---------- Form events ----------
$$('input[name="theme"]').forEach((r) =>
  r.addEventListener("change", () => { prefs.theme = r.value; apply(); save(); }));

$$('input[name="size"]').forEach((r) =>
  r.addEventListener("change", () => { prefs.size = r.value; apply(); save(); }));

$$('input[name="mode"]').forEach((r) =>
  r.addEventListener("change", () => { mode = r.value; save(); }));

$("#name").addEventListener("input", (e) => {
  prefs.name = e.target.value.trim();
  $("#greeting").textContent = prefs.name ? `Hello, ${prefs.name}!` : "Hello, Guest!";
  save();
});

$("#reset").addEventListener("click", () => {
  localStorage.removeItem("prefs");
  sessionStorage.removeItem("prefs");
  localStorage.removeItem("mode");
  mode = "local";
  prefs = { ...DEFAULTS };
  apply();
  $("#note").textContent = "All preferences cleared";
});

// ---------- Session demo ----------
const draft = $("#draft");
draft.value = sessionStorage.getItem("draft") || "";
draft.addEventListener("input", () => sessionStorage.setItem("draft", draft.value));

function countVisits() {
  const loads = (Number(sessionStorage.getItem("loads")) || 0) + 1;
  sessionStorage.setItem("loads", loads);
  const visits = (Number(localStorage.getItem("visits")) || 0) + 1;
  localStorage.setItem("visits", visits);
  $("#loads").textContent = loads;
  $("#visits").textContent = visits;
}

// ---------- Sync with other tabs ----------
window.addEventListener("storage", (e) => {
  if (e.key === "prefs" || e.key === "mode") {
    mode = localStorage.getItem("mode") || "local";
    prefs = { ...DEFAULTS, ...(read(sessionStorage, "prefs") || read(localStorage, "prefs") || {}) };
    apply();
  }
});

// ---------- Start ----------
apply();
countVisits();