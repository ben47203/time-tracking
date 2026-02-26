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
  // Only show label if block is tall enough for at least ~1 line of text (~14px)
  const showLabel = label && span >= 2;

  return (
    <div
      className="relative overflow-hidden rounded-sm min-h-0"
      style={{
        backgroundColor: color,
        flex: span,
      }}
    >
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center px-1 overflow-hidden">
          <span
            className="text-[9px] leading-tight text-white text-center overflow-hidden"
            style={{
              textShadow: "0 0 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)",
              display: "-webkit-box",
              WebkitLineClamp: Math.max(1, Math.floor(span / 2)),
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
            }}
          >
            {label}
          </span>
        </div>
      )}
    </div>
  );
});
