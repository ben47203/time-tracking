import { useCallback, useEffect, useRef, useState } from "react";

interface LabelPopoverProps {
  index: number;
  label: string;
  anchorRect: DOMRect;
  onSave: (index: number, value: string) => void;
  onClose: () => void;
}

export function LabelPopover({
  index,
  label,
  anchorRect,
  onSave,
  onClose,
}: LabelPopoverProps) {
  const [value, setValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSave(index, value);
      onClose();
    },
    [index, value, onSave, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  // Position below the anchor, clamped to viewport
  const top = anchorRect.bottom + 4;
  const left = Math.min(anchorRect.left, window.innerWidth - 220);

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-2"
      style={{ top, left }}
    >
      <form onSubmit={handleSubmit} className="flex gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Label..."
          className="w-40 h-7 px-2 text-sm rounded bg-gray-900 border border-gray-700 text-gray-200 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-2 h-7 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
        >
          OK
        </button>
      </form>
    </div>
  );
}
