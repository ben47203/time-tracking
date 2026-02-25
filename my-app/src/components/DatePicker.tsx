import { formatDateDisplay } from "../lib/timeUtils";

interface DatePickerProps {
  date: string;
  onPrev: () => void;
  onNext: () => void;
}

export function DatePicker({ date, onPrev, onNext }: DatePickerProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onPrev}
        className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
      >
        &larr;
      </button>
      <span className="text-sm font-medium text-gray-200 min-w-[180px] text-center">
        {formatDateDisplay(date)}
      </span>
      <button
        onClick={onNext}
        className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
      >
        &rarr;
      </button>
    </div>
  );
}
