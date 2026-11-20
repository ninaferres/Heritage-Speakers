export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

export const DAY_LABEL: Record<DayKey, { es: string; en: string }> = {
  mon: { es: 'Lunes', en: 'Monday' },
  tue: { es: 'Martes', en: 'Tuesday' },
  wed: { es: 'Miércoles', en: 'Wednesday' },
  thu: { es: 'Jueves', en: 'Thursday' },
  fri: { es: 'Viernes', en: 'Friday' },
  sat: { es: 'Sábado', en: 'Saturday' },
  sun: { es: 'Domingo', en: 'Sunday' },
};

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** Maps a yyyy-mm-dd date string to our Monday-first day key, as a plain calendar date (no
 * timezone math needed — a Tuesday is a Tuesday everywhere). */
export function dayKeyOf(dateStr: string): DayKey {
  const [y, m, d] = dateStr.split('-').map(Number);
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday, 1 = Monday, ...
  return DAY_KEYS[(jsDay + 6) % 7];
}

/** The next `count` dates (as yyyy-mm-dd strings), starting today. */
export function upcomingDates(count: number): string[] {
  const out: string[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

/**
 * Converts a "wall-clock" date + hour, as read in `timeZone`, into the UTC instant it
 * corresponds to — e.g. (2026-11-25, 19, "Europe/Madrid") -> the UTC instant that reads as
 * 19:00 in Madrid that day (18:00 UTC in winter, 17:00 UTC in summer, DST handled automatically).
 *
 * Standard "double conversion" trick: format a naive UTC guess back through the target zone to
 * read off its real UTC offset at that specific date, then correct for it. No date library
 * needed since Intl.DateTimeFormat already knows each zone's historical/future DST rules.
 */
export function zonedTimeToUtcIso(dateStr: string, hour: number, timeZone: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const naiveUtcMs = Date.UTC(y, m - 1, d, hour, 0, 0);

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
    .formatToParts(new Date(naiveUtcMs))
    .reduce((acc, p) => {
      acc[p.type] = p.value;
      return acc;
    }, {} as Record<string, string>);

  const asIfUtcMs = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    parts.hour === '24' ? 0 : Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  const offsetMs = asIfUtcMs - naiveUtcMs;
  return new Date(naiveUtcMs - offsetMs).toISOString();
}

/** Formats an ISO instant as a short, readable local time in the given timezone, e.g. "Wed, Nov 25, 19:00". */
export function formatInZone(iso: string, timeZone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}
