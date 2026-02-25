export const BLOCKS_PER_DAY = 288;
export const MINUTES_PER_BLOCK = 5;
export const BLOCKS_PER_HOUR = 12;
export const BLOCKS_PER_COLUMN = 48; // 4 hours per column
export const COLUMNS_COUNT = 6; // 6 columns of 4 hours = 24 hours

/**
 * Convert block index (0-287) to "HH:MM" string.
 */
export function blockToTime(index: number): string {
  const totalMinutes = index * MINUTES_PER_BLOCK;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Convert "HH:MM" string to block index.
 */
export function timeToBlock(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * BLOCKS_PER_HOUR + Math.floor(m / MINUTES_PER_BLOCK);
}

/**
 * Format a date as "YYYY-MM-DD".
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Parse "YYYY-MM-DD" to Date (local time).
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get today's date string.
 */
export function today(): string {
  return formatDate(new Date());
}

/**
 * Shift a date string by N days.
 */
export function shiftDate(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * Format date for display: "Mon 25 Feb 2026"
 */
export function formatDateDisplay(dateStr: string): string {
  const date = parseDate(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Get the Monday of the week containing the given date.
 */
export function getWeekStart(dateStr: string): string {
  const date = parseDate(dateStr);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  date.setDate(date.getDate() + diff);
  return formatDate(date);
}

/**
 * Get first day of month for a date string.
 */
export function getMonthStart(dateStr: string): string {
  const date = parseDate(dateStr);
  return formatDate(new Date(date.getFullYear(), date.getMonth(), 1));
}

/**
 * Get last day of month for a date string.
 */
export function getMonthEnd(dateStr: string): string {
  const date = parseDate(dateStr);
  return formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
}

/**
 * Get first day of year for a date string.
 */
export function getYearStart(dateStr: string): string {
  const date = parseDate(dateStr);
  return formatDate(new Date(date.getFullYear(), 0, 1));
}

/**
 * Get last day of year for a date string.
 */
export function getYearEnd(dateStr: string): string {
  const date = parseDate(dateStr);
  return formatDate(new Date(date.getFullYear(), 11, 31));
}

/**
 * Create an empty codes array (288 zeros).
 */
export function emptyCodes(): number[] {
  return new Array(BLOCKS_PER_DAY).fill(0);
}

/**
 * Create an empty labels array (288 empty strings).
 */
export function emptyLabels(): string[] {
  return new Array(BLOCKS_PER_DAY).fill("");
}
