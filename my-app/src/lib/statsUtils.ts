import { CATEGORIES } from "./categories";
import { MINUTES_PER_BLOCK, shiftDate, parseDate } from "./timeUtils";

interface TimeEntry {
  date: string;
  codes: number[];
  labels: string[];
}

/** Category totals for a single day: code -> total minutes. */
export function dayCategoryTotals(codes: number[]): Map<number, number> {
  const totals = new Map<number, number>();
  for (const code of codes) {
    if (code > 0) {
      totals.set(code, (totals.get(code) ?? 0) + MINUTES_PER_BLOCK);
    }
  }
  return totals;
}

/** Convert a totals map to an array of { name, value, color } for pie charts. */
export function totalsToChartData(
  totals: Map<number, number>,
): { name: string; value: number; color: string; code: number }[] {
  return CATEGORIES.filter((c) => totals.has(c.code)).map((c) => ({
    name: c.name,
    value: (totals.get(c.code) ?? 0) / 60, // hours
    color: c.color,
    code: c.code,
  }));
}

/** Weekly data: for each day in a 7-day range, total hours per category. */
export function weeklyStackedData(
  entries: TimeEntry[],
  weekStart: string,
): { date: string; [key: string]: number | string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = shiftDate(weekStart, i);
    const entry = entries.find((e) => e.date === d);
    const totals = entry ? dayCategoryTotals(entry.codes) : new Map<number, number>();
    const dayName = parseDate(d).toLocaleDateString("en-GB", { weekday: "short" });
    const row: { date: string; [key: string]: number | string } = {
      date: `${dayName} ${d.slice(8)}`,
    };
    for (const cat of CATEGORIES) {
      row[cat.name] = (totals.get(cat.code) ?? 0) / 60;
    }
    return row;
  });
}

/** Monthly data: for each day, total hours per category. */
export function monthlyStackedData(
  entries: TimeEntry[],
): { date: string; [key: string]: number | string }[] {
  return entries.map((entry) => {
    const totals = dayCategoryTotals(entry.codes);
    const row: { date: string; [key: string]: number | string } = {
      date: entry.date.slice(5), // "MM-DD"
    };
    for (const cat of CATEGORIES) {
      row[cat.name] = (totals.get(cat.code) ?? 0) / 60;
    }
    return row;
  });
}

/** Yearly data: for each month, average daily hours per category. */
export function yearlyStackedData(
  entries: TimeEntry[],
): { month: string; [key: string]: number | string }[] {
  // Group entries by month
  const byMonth = new Map<string, TimeEntry[]>();
  for (const entry of entries) {
    const month = entry.date.slice(0, 7); // "YYYY-MM"
    const list = byMonth.get(month) ?? [];
    list.push(entry);
    byMonth.set(month, list);
  }

  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, monthEntries]) => {
      const row: { month: string; [key: string]: number | string } = {
        month: month.slice(5), // "MM"
      };
      for (const cat of CATEGORIES) {
        let total = 0;
        for (const entry of monthEntries) {
          const dayTotal = entry.codes.filter((c) => c === cat.code).length;
          total += dayTotal;
        }
        row[cat.name] =
          Math.round(
            ((total * MINUTES_PER_BLOCK) / 60 / monthEntries.length) * 10,
          ) / 10;
      }
      return row;
    });
}

/** Personal bests: best day for each category, most productive day, streaks. */
export interface PersonalBest {
  label: string;
  value: string;
}

export function computePersonalBests(entries: TimeEntry[]): PersonalBest[] {
  if (entries.length === 0) return [];

  const bests: PersonalBest[] = [];

  // Best day for each category
  for (const cat of CATEGORIES) {
    let bestDate = "";
    let bestHours = 0;
    for (const entry of entries) {
      const count = entry.codes.filter((c) => c === cat.code).length;
      const hours = (count * MINUTES_PER_BLOCK) / 60;
      if (hours > bestHours) {
        bestHours = hours;
        bestDate = entry.date;
      }
    }
    if (bestHours > 0) {
      bests.push({
        label: `Best ${cat.name} Day`,
        value: `${bestHours.toFixed(1)}h on ${bestDate}`,
      });
    }
  }

  // Most productive day (most non-sleep, non-waste hours)
  const productiveCodes = new Set(
    CATEGORIES.filter((c) => c.code !== 1 && c.code !== 16).map((c) => c.code),
  );
  let bestProdDate = "";
  let bestProdHours = 0;
  for (const entry of entries) {
    const count = entry.codes.filter((c) => productiveCodes.has(c)).length;
    const hours = (count * MINUTES_PER_BLOCK) / 60;
    if (hours > bestProdHours) {
      bestProdHours = hours;
      bestProdDate = entry.date;
    }
  }
  if (bestProdHours > 0) {
    bests.push({
      label: "Most Productive Day",
      value: `${bestProdHours.toFixed(1)}h on ${bestProdDate}`,
    });
  }

  // Longest streak for each category (consecutive days with at least 1 block)
  const sortedEntries = [...entries].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  for (const cat of CATEGORIES) {
    let maxStreak = 0;
    let currentStreak = 0;
    let streakEnd = "";
    let prevDate: Date | null = null;

    for (const entry of sortedEntries) {
      const hasCategory = entry.codes.some((c) => c === cat.code);
      const entryDate = new Date(entry.date + "T00:00:00");

      if (hasCategory) {
        if (
          prevDate &&
          entryDate.getTime() - prevDate.getTime() === 86400000
        ) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
          streakEnd = entry.date;
        }
        prevDate = entryDate;
      } else {
        currentStreak = 0;
        prevDate = null;
      }
    }

    if (maxStreak > 1) {
      bests.push({
        label: `Longest ${cat.name} Streak`,
        value: `${maxStreak} days ending ${streakEnd}`,
      });
    }
  }

  return bests;
}
