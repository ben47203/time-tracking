import { memo, useMemo } from "react";
import { blockToTime } from "../../lib/timeUtils";
import { TimeBlock } from "./TimeBlock";

interface MergedBlock {
  startIndex: number;
  code: number;
  label?: string;
  span: number;
}

interface TimeColumnProps {
  /** Global start index for this column (e.g. 0, 48, 96...) */
  startIndex: number;
  /** 48-element slice of codes */
  codes: number[];
  /** 48-element slice of labels */
  labels: string[];
}

function mergeBlocks(
  codes: number[],
  labels: string[],
  startIndex: number,
): MergedBlock[] {
  const blocks: MergedBlock[] = [];
  let i = 0;
  while (i < codes.length) {
    const code = codes[i];
    const label = labels[i];
    let span = 1;
    // Merge adjacent blocks with same code and label
    while (
      i + span < codes.length &&
      codes[i + span] === code &&
      labels[i + span] === label
    ) {
      span++;
    }
    blocks.push({ startIndex: startIndex + i, code, label, span });
    i += span;
  }
  return blocks;
}

export const TimeColumn = memo(function TimeColumn({
  startIndex,
  codes,
  labels,
}: TimeColumnProps) {
  const merged = useMemo(
    () => mergeBlocks(codes, labels, startIndex),
    [codes, labels, startIndex],
  );

  const startHour = Math.floor(startIndex / 12);
  const endHour = startHour + 4;

  return (
    <div className="flex flex-col">
      <div className="text-xs text-gray-500 font-mono mb-1">
        {blockToTime(startIndex)} – {blockToTime(startIndex + 47)}
      </div>
      <div className="flex gap-0.5">
        {/* Time labels column */}
        <div className="flex flex-col">
          {Array.from({ length: endHour - startHour }, (_, h) => (
            <div
              key={h}
              className="text-[10px] text-gray-600 font-mono text-right pr-1"
              style={{ height: "240px" }} // 12 blocks * 20px
            >
              {String(startHour + h).padStart(2, "0")}
            </div>
          ))}
        </div>
        {/* Colored blocks column */}
        <div className="flex flex-col gap-px flex-1">
          {merged.map((block) => (
            <TimeBlock
              key={block.startIndex}
              code={block.code}
              label={block.label}
              span={block.span}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
