import { memo } from "react";
import { getCategoryByCode, getCategoryColor } from "../../lib/categories";

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
  const showLabel = label && span >= 2;
  const showCategory = !label && span >= 3 && code > 0;
  const categoryName = showCategory ? getCategoryByCode(code)?.name : undefined;
  const displayText = showLabel ? label : categoryName;
  const maxLines = Math.max(1, Math.floor(span / 2));

  return (
    <div
      className="relative overflow-hidden rounded-sm min-h-0"
      style={{
        backgroundColor: color,
        flex: span,
      }}
    >
      {displayText && (
        <div className="absolute inset-0 flex items-center justify-center px-1 overflow-hidden">
          <span
            className={`text-[9px] leading-tight text-center overflow-hidden ${
              showLabel ? "text-white" : "text-white/50 italic"
            }`}
            style={{
              textShadow: "0 0 4px rgba(0,0,0,0.7), 0 1px 2px rgba(0,0,0,0.5)",
              display: "-webkit-box",
              WebkitLineClamp: maxLines,
              WebkitBoxOrient: "vertical",
              wordBreak: "break-word",
            }}
          >
            {displayText}
          </span>
        </div>
      )}
    </div>
  );
});
