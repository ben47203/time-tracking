import { useMemo } from "react";
import { useColumnLayout } from "../../hooks/useColumnLayout";
import { TimeColumn } from "./TimeColumn";

interface TimeTableProps {
  codes: number[];
  labels: string[];
}

/**
 * Target: fit entire day in ~600px of vertical space.
 * 6 cols × 48 blocks → 48 * h = 600 → h ≈ 12px
 * 4 cols × 72 blocks → 72 * h = 600 → h ≈ 8px
 */
function getBlockHeight(blocksPerColumn: number): number {
  if (blocksPerColumn <= 48) return 12;
  return 8;
}

export function TimeTable({ codes, labels }: TimeTableProps) {
  const { columnCount, blocksPerColumn } = useColumnLayout();
  const blockHeight = getBlockHeight(blocksPerColumn);

  const columns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, i) => {
      const start = i * blocksPerColumn;
      return {
        startIndex: start,
        codes: codes.slice(start, start + blocksPerColumn),
        labels: labels.slice(start, start + blocksPerColumn),
      };
    });
  }, [codes, labels, columnCount, blocksPerColumn]);

  return (
    <div
      className="grid gap-3"
      style={{
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
      }}
    >
      {columns.map((col) => (
        <TimeColumn
          key={col.startIndex}
          startIndex={col.startIndex}
          codes={col.codes}
          labels={col.labels}
          blockHeight={blockHeight}
        />
      ))}
    </div>
  );
}
