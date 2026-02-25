import { useCallback, useState } from "react";
import { shiftDate, today } from "../lib/timeUtils";

export function useDateNav(initialDate?: string) {
  const [date, setDate] = useState(initialDate ?? today());

  const prev = useCallback(() => {
    setDate((d) => shiftDate(d, -1));
  }, []);

  const next = useCallback(() => {
    setDate((d) => shiftDate(d, 1));
  }, []);

  return { date, setDate, prev, next };
}
