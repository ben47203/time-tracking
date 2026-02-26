import { memo, useMemo } from "react";
import { blockToTime, BLOCKS_PER_HOUR } from "../../lib/timeUtils";
import { TimeBlock } from "./TimeBlock";

interface MergedBlock {
  startIndex: number;
  code: number;
  label?: string;
  span: number;
}

interface TimeColumnProps {
  startIndex: number;
  codes: number[];
  labels: string[];
  blockHeight: number;
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
  blockHeight,
}: TimeColumnProps) {
  const merged = useMemo(
    () => mergeBlocks(codes, labels, startIndex),
    [codes, labels, startIndex],
  );

  const hoursInColumn = codes.length / BLOCKS_PER_HOUR;
  const startHour = Math.floor(startIndex / BLOCKS_PER_HOUR);
  const hourHeight = BLOCKS_PER_HOUR * blockHeight;
  const lastBlockIndex = startIndex + codes.length - 1;

  return (
    <div className="flex flex-col min-w-0">
      <div className="text-[9px] text-gray-500 font-mono mb-0.5">
        {blockToTime(startIndex)} – {blockToTime(lastBlockIndex)}
      </div>
      <div className="flex gap-px">
        {/* Hour labels */}
        <div className="flex flex-col shrink-0">
          {Array.from({ length: hoursInColumn }, (_, h) => (
            <div
              key={h}
              className="text-[9px] text-gray-600 font-mono text-right pr-0.5 leading-none"
              style={{ height: `${hourHeight}px` }}
            >
              {String(startHour + h).padStart(2, "0")}
            </div>
          ))}
        </div>
        {/* Blocks — fixed height container, flex distributes space */}
        <div
          className="flex flex-col gap-px flex-1 min-w-0"
          style={{ height: `${codes.length * blockHeight}px` }}
        >
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
