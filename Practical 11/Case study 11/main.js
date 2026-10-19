// main.js : connects the modules to the page and runs the timers

import { schedule, DAYS } from ".data.js";
import { getNow, setSimulated, clearSimulated, isSimulated,
         fmtClock, fmtTime, fmtDate, fmtDuration } from ".time.js";
import { getStatus, nextBoundary } from ".scheduler.js";

const $ = (id) => document.getElementById(id);
const STATE_LABEL = { done: "Done", live: "Live now", upcoming: "Upcoming" };

let alertId = null;     // setTimeout handle (next class start / end alert)
let toastId = null;     // setTimeout handle (hides the toast)
let weekKey = "";       // remembers when the weekly table needs redrawing

// ---------- Toast message (hidden again after 5 s with setTimeout) ----------
function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastId);
  toastId = setTimeout(() => el.classList.remove("show"), 5000);
}

// ---------- Draw the page ----------
function renderNow(now, current) {
  if (!current) {
    $("nowBody").innerHTML = `<h3>No class right now</h3><p class="cap">You are free.</p>`;
    return;
  }
  const pct = Math.min(100, ((now - current.start) / (current.end - current.start)) * 100);
  $("nowBody").innerHTML = `
    <h3>${current.subject}</h3>
    <p class="meta"><span class="badge ${current.type}">${current.type}</span>
      ${current.room} &middot; ${fmtTime(current.start)} &ndash; ${fmtTime(current.end)}</p>
    <div class="bar"><i style="width:${pct.toFixed(1)}%"></i></div>
    <p class="big">${fmtDuration(current.end - now)}</p>
    <p class="cap">remaining &middot; ${Math.round(pct)}% done</p>`;
}

function renderNext(now, next) {
  if (!next) { $("nextBody").innerHTML = `<h3>No upcoming classes</h3>`; return; }
  const sameDay = next.start.toDateString() === now.toDateString();
  const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
  const when = sameDay ? "Today"
    : next.start.toDateString() === tomorrow.toDateString() ? "Tomorrow"
    : DAYS[next.start.getDay()];
  $("nextBody").innerHTML = `
    <h3>${next.subject}</h3>
    <p class="meta"><span class="badge ${next.type}">${next.type}</span>
      ${next.room} &middot; ${when}, ${fmtTime(next.start)}</p>
    <p class="big">${fmtDuration(next.start - now)}</p>
    <p class="cap">until it starts</p>`;
}

function renderToday(today) {
  $("todayList").innerHTML = today.length
    ? today.map((c) => `
        <li class="slot ${c.state}">
          <span class="when">${fmtTime(c.start)} &ndash; ${fmtTime(c.end)}</span>
          <span class="what"><strong>${c.subject}</strong><small>${c.type} &middot; ${c.room}</small></span>
          <span class="state">${STATE_LABEL[c.state]}</span>
        </li>`).join("")
    : `<li class="empty">No classes today. Enjoy your day!</li>`;
}

function renderWeek(now, current) {
  // build only when the day or the live class changes (not every second)
  const key = now.getDay() + "-" + (current ? current.id : "none");
  if (key === weekKey) return;
  weekKey = key;

  const days = [1, 2, 3, 4, 5, 6];
  const perDay = days.map((d) => schedule.filter((c) => c.day === d).sort((a, b) => a.start.localeCompare(b.start)));
  const periods = Math.max(...perDay.map((l) => l.length));

  let html = "<thead><tr><th>Period</th>" +
    days.map((d) => `<th class="${d === now.getDay() ? "today" : ""}">${DAYS[d].slice(0, 3)}</th>`).join("") + "</tr></thead><tbody>";

  for (let p = 0; p < periods; p++) {
    html += `<tr><th scope="row">${p + 1}</th>`;
    days.forEach((d, i) => {
      const c = perDay[i][p];
      if (!c) { html += `<td class="none">&mdash;</td>`; return; }
      const cls = [d === now.getDay() ? "today" : "", current && current.id === c.id ? "live" : "", c.type].join(" ");
      html += `<td class="${cls}"><strong>${c.subject}</strong><small>${c.start} &ndash; ${c.end}</small></td>`;
    });
    html += "</tr>";
  }
  $("weekTable").innerHTML = html + "</tbody>";
}

// ---------- The main tick: runs every second with setInterval ----------
function tick() {
  const now = getNow();
  const { today, current, next } = getStatus(now);

  $("clock").textContent = fmtClock(now);
  $("date").textContent = fmtDate(now);
  document.title = current ? `${fmtClock(now)} | ${current.subject}` : `${fmtClock(now)} | Class Scheduler`;

  renderNow(now, current);
  renderNext(now, next);
  renderToday(today);
  renderWeek(now, current);
}

// ---------- One-off alert at the next class start/end with setTimeout ----------
function scheduleAlert() {
  clearTimeout(alertId);
  const ev = nextBoundary(getNow());
  if (!ev) return;
  alertId = setTimeout(() => {
    toast(ev.text);
    scheduleAlert();                       // then line up the following alert
  }, ev.at - getNow() + 50);
}

// ---------- Preview mode (pretend it is another day/time) ----------
function applyPreview(day, time) {
  const real = new Date();
  const d = new Date(real);
  d.setDate(real.getDate() + (day - real.getDay()));
  const [h, m, s = 0] = time.split(":").map(Number);
  d.setHours(h, m, s, 0);
  setSimulated(d);
  updateBanner();
  weekKey = "";
  scheduleAlert();
  tick();
}

function updateBanner() {
  $("previewBanner").hidden = !isSimulated();
  $("resetPreview").hidden = !isSimulated();
}

$("previewForm").addEventListener("submit", (e) => {
  e.preventDefault();
  applyPreview(Number($("previewDay").value), $("previewTime").value || "09:30");
});
$("resetPreview").addEventListener("click", () => {
  clearSimulated();
  updateBanner();
  weekKey = "";
  scheduleAlert();
  tick();
});

// ---------- Focus timer (its own setInterval, paused with clearInterval) ----------
let focusId = null;
let focusLeft = 25 * 60;

const showFocus = () => {
  const m = String(Math.floor(focusLeft / 60)).padStart(2, "0");
  const s = String(focusLeft % 60).padStart(2, "0");
  $("focusTime").textContent = `${m}:${s}`;
};
const stopFocus = () => { clearInterval(focusId); focusId = null; };
const resetFocus = () => { stopFocus(); focusLeft = Number($("focusMin").value) * 60; showFocus(); };

$("focusStart").addEventListener("click", () => {
  if (focusId) return;                              // already running
  focusId = setInterval(() => {
    focusLeft--;
    showFocus();
    if (focusLeft <= 0) { stopFocus(); toast("Focus session complete. Take a short break!"); }
  }, 1000);
});
$("focusPause").addEventListener("click", stopFocus);
$("focusReset").addEventListener("click", resetFocus);
$("focusMin").addEventListener("change", resetFocus);

// ---------- Start everything ----------
tick();
setInterval(tick, 1000);      // real-time updates: once every second
scheduleAlert();
showFocus();