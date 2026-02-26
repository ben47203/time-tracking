import { memo } from "react";
import { getCategoryColor } from "../../lib/categories";

interface TimeBlockProps {
  code: number;
  label?: string;
  span: number;
  /** Pixels per 5-min block. */
  blockHeight: number;
}

export const TimeBlock = memo(function TimeBlock({
  code,
  label,
  span,
  blockHeight,
}: TimeBlockProps) {
  const color = getCategoryColor(code);
  const height = span * blockHeight;

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-sm"
      style={{
        backgroundColor: color,
        height: `${height}px`,
        minHeight: `${height}px`,
      }}
    >
      {label && span >= 2 && height >= 16 && (
        <span className="text-[9px] leading-none text-white/80 px-0.5 truncate">
          {label}
        </span>
      )}
    </div>
  );
});
