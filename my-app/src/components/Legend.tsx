import { useMemo } from "react";
import { CATEGORIES } from "../lib/categories";
import { MINUTES_PER_BLOCK } from "../lib/timeUtils";

interface LegendProps {
  /** Today's 288-element codes array. If provided, shows hours + bar chart. */
  codes?: number[];
}

function LegendItem({
  name,
  color,
  hours,
  showHours,
}: {
  name: string;
  color: string;
  hours: number;
  showHours: boolean;
}) {
  return (
    <div className="flex items-center gap-1 h-5">
      <div
        className="w-2.5 h-2.5 rounded-sm shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-[10px] text-gray-400 truncate flex-1">{name}</span>
      {showHours && (
        <span className="text-[10px] text-gray-500 font-mono tabular-nums shrink-0">
          {hours > 0 ? `${hours.toFixed(1)}h` : "–"}
        </span>
      )}
    </div>
  );
}

export function Legend({ codes }: LegendProps) {
  const totals = useMemo(() => {
    if (!codes) return null;
    const map = new Map<number, number>();
    for (const code of codes) {
      if (code > 0) {
        map.set(code, (map.get(code) ?? 0) + MINUTES_PER_BLOCK);
      }
    }
    return map;
  }, [codes]);

  const maxMinutes = useMemo(() => {
    if (!totals) return 0;
    return Math.max(...totals.values(), 1);
  }, [totals]);

  const half = Math.ceil(CATEGORIES.length / 2);
  const col1 = CATEGORIES.slice(0, half);
  const col2 = CATEGORIES.slice(half);

  return (
    <div className="flex flex-col md:flex-row gap-2">
      {/* Legend — two columns on mobile, single on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-x-3 gap-y-0 shrink-0">
        {/* On mobile: interleave into 2 cols. On desktop: single column. */}
        <div className="flex flex-col gap-0 md:hidden">
          {col1.map((cat) => (
            <LegendItem
              key={cat.code}
              name={cat.name}
              color={cat.color}
              hours={(totals?.get(cat.code) ?? 0) / 60}
              showHours={!!totals}
            />
          ))}
        </div>
        <div className="flex flex-col gap-0 md:hidden">
          {col2.map((cat) => (
            <LegendItem
              key={cat.code}
              name={cat.name}
              color={cat.color}
              hours={(totals?.get(cat.code) ?? 0) / 60}
              showHours={!!totals}
            />
          ))}
        </div>
        {/* Desktop: single column, all items */}
        <div className="hidden md:flex flex-col gap-0">
          {CATEGORIES.map((cat) => (
            <LegendItem
              key={cat.code}
              name={cat.name}
              color={cat.color}
              hours={(totals?.get(cat.code) ?? 0) / 60}
              showHours={!!totals}
            />
          ))}
        </div>
      </div>

      {/* Bar chart — beside legend on desktop, below on mobile */}
      {totals && (
        <div className="flex-1 flex flex-col gap-0 min-w-0">
          {CATEGORIES.map((cat) => {
            const minutes = totals.get(cat.code) ?? 0;
            const pct = (minutes / maxMinutes) * 100;
            return (
              <div key={cat.code} className="flex items-center h-5 gap-1">
                <div className="flex-1 h-3 bg-gray-800/50 rounded-sm overflow-hidden">
                  {minutes > 0 && (
                    <div
                      className="h-full rounded-sm transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
