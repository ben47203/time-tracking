import { memo, useCallback } from "react";
import { getCategoryColor } from "../../lib/categories";

interface CodeCellProps {
  index: number;
  value: number;
  inDragRange: boolean;
  onValueChange: (index: number, value: number) => void;
  onDragStart: (index: number, value: number, e: React.PointerEvent) => void;
  onClick: (index: number, shiftKey: boolean) => void;
}

export const CodeCell = memo(function CodeCell({
  index,
  value,
  inDragRange,
  onValueChange,
  onDragStart,
  onClick,
}: CodeCellProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseInt(e.target.value, 10);
      if (e.target.value === "") {
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

  const bgColor = value > 0 ? getCategoryColor(value) : undefined;

  return (
    <div className="relative group" onClick={handleClick}>
      <input
        type="text"
        inputMode="numeric"
        value={value || ""}
        onChange={handleChange}
        className={`w-12 h-7 text-center text-sm rounded border text-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${
          inDragRange
            ? "border-blue-400 ring-1 ring-blue-400"
            : "border-gray-700"
        }`}
        style={{
          backgroundColor: bgColor ?? "#1f2937",
        }}
      />
      {/* Drag handle */}
      <div
        className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-blue-500 cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity"
        onPointerDown={(e) => {
          e.stopPropagation();
          onDragStart(index, value, e);
        }}
      />
    </div>
  );
});
