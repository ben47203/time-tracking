import { memo } from "react";
import { getCategoryColor } from "../../lib/categories";

interface TimeBlockProps {
  code: number;
  label?: string;
  /** Number of consecutive 5-min blocks this merged cell spans. */
  span: number;
}

export const TimeBlock = memo(function TimeBlock({
  code,
  label,
  span,
}: TimeBlockProps) {
  const color = getCategoryColor(code);
  const height = span * 20; // 20px per block

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-sm"
      style={{
        backgroundColor: color,
        height: `${height}px`,
        minHeight: `${height}px`,
      }}
    >
      {label && span >= 2 && (
        <span className="text-[10px] text-white/80 px-1 truncate">
          {label}
        </span>
      )}
    </div>
  );
});
