import { memo, useCallback } from "react";
import { blockToTime } from "../../lib/timeUtils";
import { CodeCell } from "./CodeCell";

interface LogRowProps {
  index: number;
  code: number;
  label: string;
  inDragRange: boolean;
  isFirst: boolean;
  isLast: boolean;
  onCodeChange: (index: number, value: number) => void;
  onDragStart: (index: number, value: number, e: React.PointerEvent) => void;
  onCellClick: (index: number, shiftKey: boolean) => void;
  onLabelClick: (index: number, rect: DOMRect) => void;
  onNavigate: (index: number, direction: "up" | "down") => void;
}

export const LogRow = memo(function LogRow({
  index,
  code,
  label,
  inDragRange,
  isFirst,
  isLast,
  onCodeChange,
  onDragStart,
  onCellClick,
  onLabelClick,
  onNavigate,
}: LogRowProps) {
  const handleLabelClick = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      onLabelClick(index, rect);
    },
    [index, onLabelClick],
  );

  return (
    <div
      className="flex items-center h-5"
      data-row-index={index}
    >
      <span className="text-[10px] text-gray-500 w-9 text-right pr-2.5 font-mono tabular-nums shrink-0 leading-5">
        {blockToTime(index)}
      </span>
      <CodeCell
        index={index}
        value={code}
        inDragRange={inDragRange}
        isFirst={isFirst}
        isLast={isLast}
        onValueChange={onCodeChange}
        onDragStart={onDragStart}
        onClick={onCellClick}
        onNavigate={onNavigate}
      />
      <button
        onClick={handleLabelClick}
        className={`w-5 h-5 flex items-center justify-center text-[10px] shrink-0 transition-colors ${
          label
            ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
            : "text-gray-600 hover:text-gray-400 hover:bg-gray-800"
        }`}
        title={label || "Add label"}
      >
        {label ? "L" : "+"}
      </button>
    </div>
  );
});
