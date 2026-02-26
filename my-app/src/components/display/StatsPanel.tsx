import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CATEGORIES } from "../../lib/categories";
import {
  weeklyStackedData,
  monthlyStackedData,
  yearlyStackedData,
  computePersonalBests,
} from "../../lib/statsUtils";
import {
  getWeekStart,
  getMonthStart,
  getMonthEnd,
  getYearStart,
  getYearEnd,
  shiftDate,
} from "../../lib/timeUtils";

type Tab = "week" | "month" | "year" | "bests";

interface StatsPanelProps {
  date: string;
}

/** Custom tooltip that hides categories with 0 hours. */
function FilteredTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload) return null;

  const nonZero = payload.filter((p) => p.value > 0);
  if (nonZero.length === 0) return null;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-xs shadow-lg">
      <div className="text-gray-300 mb-1">{label}</div>
      {nonZero.map((p) => (
        <div key={p.name} className="flex items-center gap-2 py-px">
          <div
            className="w-2 h-2 rounded-sm shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-gray-300 flex-1">{p.name}</span>
          <span className="text-gray-400 font-mono ml-2">{p.value.toFixed(1)}h</span>
        </div>
      ))}
    </div>
  );
}

/** Shared stacked area chart used by Week, Month, and Year views. */
function StackedChart({
  data,
  xKey,
  yLabel,
  height = 400,
}: {
  data: Record<string, number | string>[];
  xKey: string;
  yLabel: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <XAxis dataKey={xKey} tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <YAxis
          tick={{ fontSize: 10, fill: "#9ca3af" }}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            style: { fill: "#9ca3af", fontSize: 12 },
          }}
        />
        <Tooltip content={<FilteredTooltip />} />
        {CATEGORIES.map((cat) => (
          <Area
            key={cat.code}
            type="monotone"
            dataKey={cat.name}
            stackId="1"
            fill={cat.color}
            stroke={cat.color}
            fillOpacity={0.8}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function StatsPanel({ date }: StatsPanelProps) {
  const [tab, setTab] = useState<Tab>("week");

  const weekStart = getWeekStart(date);
  const weekEnd = shiftDate(weekStart, 6);
  const monthStart = getMonthStart(date);
  const monthEnd = getMonthEnd(date);
  const yearStart = getYearStart(date);
  const yearEnd = getYearEnd(date);

  // Pick the date range based on tab
  const rangeStart = tab === "week" ? weekStart : tab === "month" ? monthStart : yearStart;
  const rangeEnd = tab === "week" ? weekEnd : tab === "month" ? monthEnd : yearEnd;

  const entries = useQuery(api.timeEntries.getDateRange, {
    startDate: tab === "bests" ? "2000-01-01" : rangeStart,
    endDate: tab === "bests" ? "2099-12-31" : rangeEnd,
  });

  const tabs: Tab[] = ["week", "month", "year", "bests"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-gray-200"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {entries === undefined ? (
        <div className="text-gray-400 text-sm">Loading statistics...</div>
      ) : tab === "week" ? (
        <WeekView entries={entries} weekStart={weekStart} />
      ) : tab === "month" ? (
        <MonthView entries={entries} />
      ) : tab === "year" ? (
        <YearView entries={entries} />
      ) : (
        <BestsView entries={entries} />
      )}
    </div>
  );
}

function WeekView({
  entries,
  weekStart,
}: {
  entries: { date: string; codes: number[]; labels: string[] }[];
  weekStart: string;
}) {
  const data = useMemo(() => weeklyStackedData(entries, weekStart), [entries, weekStart]);

  const hasAnyData = entries.length > 0;
  if (!hasAnyData) {
    return <div className="text-gray-400 text-sm">No data for this week.</div>;
  }

  return <StackedChart data={data} xKey="date" yLabel="Hours" />;
}

function MonthView({
  entries,
}: {
  entries: { date: string; codes: number[]; labels: string[] }[];
}) {
  const data = useMemo(() => monthlyStackedData(entries), [entries]);

  if (data.length === 0) {
    return <div className="text-gray-400 text-sm">No data for this month.</div>;
  }

  return <StackedChart data={data} xKey="date" yLabel="Hours" />;
}

function YearView({
  entries,
}: {
  entries: { date: string; codes: number[]; labels: string[] }[];
}) {
  const data = useMemo(() => yearlyStackedData(entries), [entries]);

  if (data.length === 0) {
    return <div className="text-gray-400 text-sm">No data for this year.</div>;
  }

  return <StackedChart data={data} xKey="month" yLabel="Avg Hours/Day" />;
}

function BestsView({
  entries,
}: {
  entries: { date: string; codes: number[]; labels: string[] }[];
}) {
  const bests = useMemo(() => computePersonalBests(entries), [entries]);

  if (bests.length === 0) {
    return <div className="text-gray-400 text-sm">No data yet for personal bests.</div>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2">
      {bests.map((best, i) => (
        <div
          key={i}
          className="flex justify-between items-center px-3 py-2 bg-gray-800/50 rounded text-sm"
        >
          <span className="text-gray-300">{best.label}</span>
          <span className="text-gray-400 font-mono text-xs">{best.value}</span>
        </div>
      ))}
    </div>
  );
}
