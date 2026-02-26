import { memo } from "react";
import { getCategoryColor } from "../../lib/categories";

interface TimeBlockProps {
  code: number;
  label?: string;
  span: number;
}

export const TimeBlock = memo(function TimeBlock({
  code,
  label,
  span,
}: TimeBlockProps) {
  const color = getCategoryColor(code);

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-sm min-h-0"
      style={{
        backgroundColor: color,
        flex: span,
      }}
    >
      {label && span >= 2 && (
        <span className="text-[9px] leading-none text-white/80 px-0.5 truncate">
          {label}
        </span>
      )}
    </div>
  );
});
