import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CATEGORIES } from "../../lib/categories";
import {
  dayCategoryTotals,
  totalsToChartData,
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
  parseDate,
} from "../../lib/timeUtils";

type Tab = "week" | "month" | "year" | "bests";

interface StatsPanelProps {
  date: string;
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
  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = shiftDate(weekStart, i);
      const entry = entries.find((e) => e.date === d);
      const totals = entry ? dayCategoryTotals(entry.codes) : new Map();
      const chartData = totalsToChartData(totals);
      const dayName = parseDate(d).toLocaleDateString("en-GB", {
        weekday: "short",
      });
      return { date: d, dayName, chartData, hasData: chartData.length > 0 };
    });
  }, [entries, weekStart]);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-1">
          <span className="text-xs text-gray-400">
            {day.dayName} {day.date.slice(8)}
          </span>
          {day.hasData ? (
            <PieChart width={120} height={120}>
              <Pie
                data={day.chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={50}
                paddingAngle={1}
              >
                {day.chartData.map((d, idx) => (
                  <Cell key={idx} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}h` : ""}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "6px",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          ) : (
            <div className="w-[120px] h-[120px] flex items-center justify-center text-gray-600 text-xs">
              No data
            </div>
          )}
        </div>
      ))}
    </div>
  );
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

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Hours", angle: -90, position: "insideLeft", style: { fill: "#9ca3af", fontSize: 12 } }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}h` : ""}
        />
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

function YearView({
  entries,
}: {
  entries: { date: string; codes: number[]; labels: string[] }[];
}) {
  const data = useMemo(() => yearlyStackedData(entries), [entries]);

  if (data.length === 0) {
    return <div className="text-gray-400 text-sm">No data for this year.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data}>
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} label={{ value: "Avg Hours/Day", angle: -90, position: "insideLeft", style: { fill: "#9ca3af", fontSize: 12 } }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          formatter={(value: number | undefined) => value != null ? `${value.toFixed(1)}h` : ""}
        />
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
