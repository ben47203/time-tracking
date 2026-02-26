import { memo, useCallback, useRef } from "react";
import { getCategoryColor, UNSET_COLOR } from "../../lib/categories";

interface CodeCellProps {
  index: number;
  value: number;
  inDragRange: boolean;
  isFirst: boolean;
  isLast: boolean;
  onValueChange: (index: number, value: number) => void;
  onDragStart: (index: number, value: number, e: React.PointerEvent) => void;
  onClick: (index: number, shiftKey: boolean) => void;
  onNavigate: (index: number, direction: "up" | "down") => void;
}

export const CodeCell = memo(function CodeCell({
  index,
  value,
  inDragRange,
  isFirst,
  isLast,
  onValueChange,
  onDragStart,
  onClick,
  onNavigate,
}: CodeCellProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseInt(raw, 10);
      if (raw === "") {
        onValueChange(index, 0);
      } else if (!isNaN(num) && num >= 0 && num <= 16) {
        onValueChange(index, num);
      }
    },
    [index, onValueChange],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onClick(index, e.shiftKey);
    },
    [index, onClick],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        onNavigate(index, "down");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        onNavigate(index, "up");
      } else if (e.key === "Backspace" && value === 0) {
        e.preventDefault();
        onNavigate(index, "up");
      }
    },
    [index, value, onNavigate],
  );

  const bgColor = value > 0 ? getCategoryColor(value) : undefined;
  const rounding = isFirst && isLast
    ? "rounded-sm"
    : isFirst
      ? "rounded-t-sm"
      : isLast
        ? "rounded-b-sm"
        : "";

  return (
    <div className="relative group flex-1 leading-[0]" onClick={handleClick}>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        data-code-index={index}
        value={value || ""}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full h-5 block text-center text-[11px] border-b border-gray-700/40 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:z-10 relative ${rounding} ${
          inDragRange
            ? "ring-1 ring-blue-400 z-10"
            : ""
        }`}
        style={{
          backgroundColor: bgColor ?? UNSET_COLOR,
        }}
      />
      {/* Drag handle */}
      <div
        className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(index, value, e);
        }}
      />
    </div>
  );
});
