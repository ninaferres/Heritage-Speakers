import { ConnectAvailabilityBlock } from '../api/client';

/** Default local hour (24h) each coarse availability block represents, for turning a block
 * choice into one concrete bookable time. */
export const BLOCK_HOUR: Record<ConnectAvailabilityBlock, number> = {
  morning: 9,
  afternoon: 15,
  evening: 19,
};

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/** "weekday" or "weekend" for a yyyy-mm-dd date string, evaluated as a plain calendar date
 * (no timezone math needed here — a Saturday is a Saturday everywhere). */
export function dayTypeOf(dateStr: string): 'weekday' | 'weekend' {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return day === 0 || day === 6 ? 'weekend' : 'weekday';
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
