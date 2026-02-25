import { useMemo } from "react";
import { BLOCKS_PER_COLUMN, COLUMNS_COUNT } from "../../lib/timeUtils";
import { TimeColumn } from "./TimeColumn";

interface TimeTableProps {
  codes: number[];
  labels: string[];
}

export function TimeTable({ codes, labels }: TimeTableProps) {
  const columns = useMemo(() => {
    return Array.from({ length: COLUMNS_COUNT }, (_, i) => {
      const start = i * BLOCKS_PER_COLUMN;
      return {
        startIndex: start,
        codes: codes.slice(start, start + BLOCKS_PER_COLUMN),
        labels: labels.slice(start, start + BLOCKS_PER_COLUMN),
      };
    });
  }, [codes, labels]);

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4">
      {columns.map((col) => (
        <TimeColumn
          key={col.startIndex}
          startIndex={col.startIndex}
          codes={col.codes}
          labels={col.labels}
        />
      ))}
    </div>
  );
}
