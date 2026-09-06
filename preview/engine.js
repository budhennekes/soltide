// Solar approximation and atomic session ledger extracted from production.
// Lab namespace is intentionally isolated. No production migrations run.
const $ = id => document.getElementById(id);
let storageFailed = false;
const memoryStore = new Map();
const LS = {
  get(k, fb) { try { const v = memoryStore.has(k) ? memoryStore.get(k) : localStorage.getItem("soltide_first_light_" + k); const parsed = v == null ? fb : JSON.parse(v); return parsed == null ? fb : parsed; } catch { storageFailed = true; return fb; } },
  set(k, v) { const text = JSON.stringify(v); memoryStore.set(k, text); try { localStorage.setItem("soltide_first_light_" + k, text); return true; } catch { storageFailed = true; return false; } }

};


const rad = Math.PI / 180;
function dayOfYear(d) {
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(d.getFullYear(), 0, 0)) / 864e5);
}
function solarDeclination(d) {
  return -23.44 * rad * Math.cos(2 * Math.PI / 365 * (dayOfYear(d) + 10));
}
function equationOfTime(d) { // minutes
  const b = 2 * Math.PI * (dayOfYear(d) - 81) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}
function solarElevation(lat, lng, when) {
  const decl = solarDeclination(when);
  const utcHours = when.getUTCHours() + when.getUTCMinutes() / 60 + when.getUTCSeconds() / 3600;
  const solarTime = utcHours + lng / 15 + equationOfTime(when) / 60; // hours
  const hourAngle = (solarTime - 12) * 15 * rad;
  const latR = lat * rad;
  const sinEl = Math.sin(latR) * Math.sin(decl) + Math.cos(latR) * Math.cos(decl) * Math.cos(hourAngle);
  return Math.asin(Math.max(-1, Math.min(1, sinEl))) / rad; // degrees
}
function sunTimes(lat, lng, d) {
  // returns {sunrise, sunset, solarNoon} as Dates, or nulls (polar day/night)
  const decl = solarDeclination(d);
  const latR = lat * rad;
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
  const noonUTCh = 12 - lng / 15 - equationOfTime(d) / 60;
  const mkUTC = h => {
    const base = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    return new Date(base.getTime() + h * 36e5);
  };
  const solarNoon = mkUTC(noonUTCh);
  if (cosH < -1) return { sunrise: null, sunset: null, solarNoon, polar: "day" };
  if (cosH > 1)  return { sunrise: null, sunset: null, solarNoon, polar: "night" };
  const H = Math.acos(cosH) / rad / 15; // half day length in hours
  return { sunrise: mkUTC(noonUTCh - H), sunset: mkUTC(noonUTCh + H), solarNoon, polar: null };
}

/* ---------- formatting ---------- */
function fmtTime(d) {
  if (!d) return "—";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true }).replace(/\s?([AP]M)/i, (m, p) => " " + p.toUpperCase());
}
function fmtDur(ms) {
  const m = Math.max(0, Math.round(ms / 6e4));
  const h = Math.floor(m / 60), r = m % 60;
  if (h && r) return `${h}h ${r}m`;
  if (h) return `${h}h`;
  return `${r}m`;
}
const dayKey = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function fmtRange(a, b) {
  if (!a || !b) return "—";
  const sa = fmtTime(a), sb = fmtTime(b);
  const ma = sa.slice(-2), mb = sb.slice(-2);
  return ma === mb ? sa.slice(0, -3) + "–" + sb : sa + " – " + sb;
}


const record = v => v && typeof v === "object" && !Array.isArray(v) ? v : {};
function getMoments() { return record(LS.get("moments", {})); }
function todayMoments() { return getMoments()[dayKey(now())] || {}; }
function todaySunMin() { return record(ledger().days[dayKey(new Date())]); }
function todaySunTotal() { const v = todaySunMin().total; return Number.isFinite(v) && v > 0 ? v : 0; }
const displayMinutes = n => n > 0 && n < 1 ? "<1" : String(Math.floor(n));

// which guidance window (if any) contains the given moment right now
function currentSunWindow(day) {
  if (!day) return null;
  const t = now();

  if (day.mlStart && day.mlEnd && t >= day.mlStart && t <= day.mlEnd) return "morning";
  return null;
}
// One atomic ledger write records exact duration and clears the active session.
// Legacy totals are retained; a completed session cannot be counted again on reload.
function ledger() {
  const v = record(LS.get("ledger", null));
  return { days: record(v.days || LS.get("sunmin", {})), session: v.session || null };
}
function getSession() {
  const l = LS.get("ledger", null);
  const v = l ? record(l).session : LS.get("session", null);
  return v && Number.isFinite(v.start) && v.start > 0 && v.start <= Date.now() ? v : null;
}
function startSession() {
  if (getSession()) return;
  const l = ledger(); l.session = { start: Date.now() }; LS.set("ledger", l);
}
function sessionElapsedMs() { const s = getSession(); return s ? Math.max(0, Date.now() - s.start) : 0; }
function stopSession() {
  const session = getSession(); if (!session) return 0;
  const end = Date.now(), l = ledger();
  let cursor = session.start;
  while (cursor < end) {
    const date = new Date(cursor), next = new Date(date); next.setHours(24, 0, 0, 0);
    const until = Math.min(end, next.getTime()), key = dayKey(date);
    const old = record(l.days[key]);
    const total = Number.isFinite(old.total) && old.total > 0 ? old.total : 0;
    l.days[key] = { ...old, total: total + (until - cursor) / 60000 };
    cursor = until;
  }
  l.session = null; LS.set("ledger", l);
  return (end - session.start) / 60000;
}
