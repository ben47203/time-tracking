import { memo, useCallback } from "react";
import { blockToTime } from "../../lib/timeUtils";
import { CodeCell } from "./CodeCell";

interface LogRowProps {
  index: number;
  code: number;
  label: string;
  inDragRange: boolean;
  onCodeChange: (index: number, value: number) => void;
  onLabelChange: (index: number, value: string) => void;
  onDragStart: (index: number, value: number, e: React.PointerEvent) => void;
  onCellClick: (index: number, shiftKey: boolean) => void;
}

export const LogRow = memo(function LogRow({
  index,
  code,
  label,
  inDragRange,
  onCodeChange,
  onLabelChange,
  onDragStart,
  onCellClick,
}: LogRowProps) {
  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onLabelChange(index, e.target.value);
    },
    [index, onLabelChange],
  );

  return (
    <div
      className={`flex items-center gap-2 px-2 py-0.5 ${
        index % 12 === 0 ? "border-t border-gray-700" : ""
      }`}
      data-row-index={index}
    >
      <span className="text-xs text-gray-500 w-12 text-right font-mono tabular-nums">
        {blockToTime(index)}
      </span>
      <CodeCell
        index={index}
        value={code}
        inDragRange={inDragRange}
        onValueChange={onCodeChange}
        onDragStart={onDragStart}
        onClick={onCellClick}
      />
      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder=""
        className="flex-1 h-7 px-2 text-sm rounded bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
      />
    </div>
  );
});
