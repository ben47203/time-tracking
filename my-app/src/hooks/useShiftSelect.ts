import { useCallback, useRef } from "react";

interface UseShiftSelectOptions {
  onFillRange: (start: number, end: number, value: number) => void;
  getCellValue: (index: number) => number;
}

export function useShiftSelect({
  onFillRange,
  getCellValue,
}: UseShiftSelectOptions) {
  const lastClickedRef = useRef<number | null>(null);

  const handleClick = useCallback(
    (index: number, shiftKey: boolean) => {
      if (shiftKey && lastClickedRef.current !== null) {
        const start = Math.min(lastClickedRef.current, index);
        const end = Math.max(lastClickedRef.current, index);
        const value = getCellValue(lastClickedRef.current);
        onFillRange(start, end, value);
      }
      lastClickedRef.current = index;
    },
    [onFillRange, getCellValue],
  );

  return { handleClick };
}
