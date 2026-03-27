/**
 * Call-based shift tracking:
 * - Precheck: officer must complete 90 minutes before shift start.
 * - Book-on: window from 15 min before to 30 min after shift start.
 * - Check call: recurring windows during shift (site setting: on/off + interval).
 */

export interface PrecheckCall {
  /** ISO datetime – must be done by this time (90 min before shift start). */
  dueBy: string;
  completedAt?: string;
}

export interface BookOnCall {
  /** ISO datetime – window opens. */
  windowStart: string;
  /** ISO datetime – window closes. */
  windowEnd: string;
  completedAt?: string;
}

export interface CheckCallWindow {
  /** ISO datetime – window start for this check call. */
  windowStart: string;
  /** ISO datetime – window end. */
  windowEnd: string;
  completedAt?: string;
}

export interface SiteCheckCallSettings {
  enabled: boolean;
  /** Interval in minutes between check calls during the shift. */
  intervalMinutes: number;
}

/** Parse date (YYYY-MM-DD) and time (HH:mm) into Date in local time. */
function toDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`);
}

/** Add minutes to a date. */
function addMinutes(d: Date, minutes: number): Date {
  const out = new Date(d);
  out.setMinutes(out.getMinutes() + minutes);
  return out;
}

/** Format as ISO string (no Z, local). */
function toISOLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

export interface ShiftCallWindows {
  precheck: PrecheckCall;
  bookOn: BookOnCall;
  checkCalls: CheckCallWindow[];
}

/**
 * Compute precheck, book-on, and check-call windows for a shift.
 * - Precheck: due 90 minutes before shift start.
 * - Book-on: 15 min before to 30 min after shift start.
 * - Check calls: from shift start to end, every intervalMinutes (if site has check call enabled).
 */
export function computeShiftCalls(
  date: string,
  startTime: string,
  endTime: string,
  checkCallEnabled: boolean,
  checkCallIntervalMinutes: number
): ShiftCallWindows {
  const shiftStart = toDateTime(date, startTime);
  let shiftEnd = toDateTime(date, endTime);
  if (shiftEnd <= shiftStart) {
    shiftEnd = addMinutes(shiftEnd, 24 * 60);
  }

  const precheck: PrecheckCall = {
    dueBy: toISOLocal(addMinutes(shiftStart, -90)),
  };

  const bookOn: BookOnCall = {
    windowStart: toISOLocal(addMinutes(shiftStart, -15)),
    windowEnd: toISOLocal(addMinutes(shiftStart, 30)),
  };

  const checkCalls: CheckCallWindow[] = [];
  if (checkCallEnabled && checkCallIntervalMinutes > 0) {
    let t = new Date(shiftStart);
    while (t < shiftEnd) {
      const windowEnd = addMinutes(t, checkCallIntervalMinutes);
      checkCalls.push({
        windowStart: toISOLocal(t),
        windowEnd: toISOLocal(windowEnd),
      });
      t = windowEnd;
    }
  }

  return { precheck, bookOn, checkCalls };
}
