import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { emptyCodes, emptyLabels } from "../lib/timeUtils";
import { DatePicker } from "../components/DatePicker";
import { Legend } from "../components/Legend";
import { TimeTable } from "../components/display/TimeTable";
import { StatsPanel } from "../components/display/StatsPanel";
import { useDateNav } from "../hooks/useDateNav";

export function TimeTrackingPage() {
  const { date, prev, next } = useDateNav();
  const entry = useQuery(api.timeEntries.getByDate, { date });

  const codes = entry?.codes ?? emptyCodes();
  const labels = entry?.labels ?? emptyLabels();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold">Time Tracking</h1>
        <DatePicker date={date} onPrev={prev} onNext={next} />
      </div>

      <Legend codes={codes} />

      {entry === undefined ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : (
        <TimeTable codes={codes} labels={labels} />
      )}

      <div className="border-t border-gray-800 pt-6">
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <StatsPanel date={date} />
      </div>
    </div>
  );
}
