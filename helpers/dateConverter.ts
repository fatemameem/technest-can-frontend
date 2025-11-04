// Build "YYYY-MM-DDTHH:mm:ss" with NO timezone ('Z')
// -> browsers interpret this as local time (cross-browser safe)
export function toLocalISO(dateStr: string, timeStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);

  let [hhmm, ampm] = timeStr.trim().split(/\s+/);   // "10:25" "AM"
  let [h, min] = hhmm.split(':').map(Number);
  ampm = ampm?.toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 1;
  if (ampm === 'AM' && h === 12) h = 0;

  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(m)}-${pad(d)}T${pad(h)}:${pad(min)}:00`;
}

export function monthAbbrFromLocalISO(localIso: string, tz = 'America/Toronto') {
  const date = new Date(localIso); // interpreted as local time
  return new Intl.DateTimeFormat('en-CA', { month: 'short', timeZone: tz })
    .format(date)
    .toUpperCase(); // "NOV"
}

export function weekdayAbbrFromLocalISO(localIso: string, tz = 'America/Toronto') {
  return new Intl.DateTimeFormat('en-CA', { weekday: 'short', timeZone: tz })
    .format(new Date(localIso))
    .toUpperCase();               // → "WED"
}

export function dayOfMonthFromLocalISO(localIso: string) {
  const d = new Date(localIso);
  return d.getDate();             // → 19
}

// If you need a single callout string:
export function calloutFromLocalISO(localIso: string, tz = 'America/Toronto') {
  const weekday = weekdayAbbrFromLocalISO(localIso, tz); // "WED"
  const month   = monthAbbrFromLocalISO(localIso, tz);   // "NOV"
  const day     = dayOfMonthFromLocalISO(localIso);      // 19
  return { weekday, month, day, label: `${weekday} ${month} ${day}` };
}

// Usage
const dateStr = '2025-11-19';
const timeStr = '10:25 AM';

const localIso = toLocalISO(dateStr, timeStr);           // "2025-11-19T10:25:00"
const month = monthAbbrFromLocalISO(localIso);           // "NOV"
// console.log({ localIso, month });
