// time.js : clock helpers (with an optional "preview" time for testing)

let offsetMs = 0;   // 0 = real time; otherwise the clock runs from a chosen moment

export const getNow = () => new Date(Date.now() + offsetMs);
export const isSimulated = () => offsetMs !== 0;

export function setSimulated(date) { offsetMs = date.getTime() - Date.now(); }
export function clearSimulated()   { offsetMs = 0; }

export const pad = (n) => String(n).padStart(2, "0");

// 14:05:09
export const fmtClock = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

// 09:00
export const fmtTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// Sunday, 18 October 2026
export const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

// milliseconds -> "01:23:45" (or "1d 02:03:04" when longer than a day)
export function fmtDuration(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const days = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${days ? days + "d " : ""}${pad(h)}:${pad(m)}:${pad(s)}`;
}

// "10:30" + a date -> that time on the same date
export function toDate(base, hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m, 0, 0);
}