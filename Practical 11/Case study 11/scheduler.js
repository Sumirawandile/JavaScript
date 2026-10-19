// scheduler.js : the logic (no HTML in here, only data in and data out)

import { schedule } from ".data.js";
import { toDate } from ".time.js";

// All classes on the same weekday as `date`, with real start/end Date objects
export function classesOn(date) {
  return schedule
    .filter((c) => c.day === date.getDay())
    .map((c) => ({ ...c, start: toDate(date, c.start), end: toDate(date, c.end) }))
    .sort((a, b) => a.start - b.start);
}

// What is happening at time `now`?
export function getStatus(now) {
  const today = classesOn(now).map((c) => ({
    ...c,
    state: now >= c.end ? "done" : now >= c.start ? "live" : "upcoming",
  }));

  const current = today.find((c) => c.state === "live") || null;
  let next = today.find((c) => c.state === "upcoming") || null;

  // Nothing left today? Look ahead up to a week for the next class.
  for (let i = 1; !next && i <= 7; i++) {
    const day = new Date(now);
    day.setDate(day.getDate() + i);
    next = classesOn(day)[0] || null;
  }
  return { today, current, next };
}

// The very next moment something starts or ends today (used for the setTimeout alert)
export function nextBoundary(now) {
  const events = [];
  classesOn(now).forEach((c) => {
    events.push({ at: c.start, text: `${c.subject} has started (${c.room})` });
    events.push({ at: c.end,   text: `${c.subject} is over` });
  });
  const later = events.filter((e) => e.at > now).sort((a, b) => a.at - b.at);
  if (!later.length) return null;

  // Back-to-back classes: one class ends exactly when the next starts, so join them into one alert
  const same = later.filter((e) => e.at.getTime() === later[0].at.getTime());
  return { at: later[0].at, text: same.map((e) => e.text).join("  |  ") };
}