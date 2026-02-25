import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  BLOCKS_PER_DAY,
  emptyCodes,
  emptyLabels,
} from "../../lib/timeUtils";
import { useDragFill } from "../../hooks/useDragFill";
import { useShiftSelect } from "../../hooks/useShiftSelect";
import { LogRow } from "./LogRow";
import { DatePicker } from "../DatePicker";
import { Legend } from "../Legend";
import { useDateNav } from "../../hooks/useDateNav";

export function LogTable() {
  const { date, prev, next } = useDateNav();
  const entry = useQuery(api.timeEntries.getByDate, { date });
  const upsertDay = useMutation(api.timeEntries.upsertDay);

  const [codes, setCodes] = useState<number[]>(emptyCodes());
  const [labels, setLabels] = useState<string[]>(emptyLabels());
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sync from server when entry or date changes
  const lastSyncedDate = useRef<string | null>(null);
  const lastSyncedId = useRef<string | null>(null);
  if (entry !== undefined) {
    const entryId = entry?._id ?? "empty";
    if (lastSyncedDate.current !== date || lastSyncedId.current !== entryId) {
      lastSyncedDate.current = date;
      lastSyncedId.current = entryId;
      setCodes(entry?.codes ?? emptyCodes());
      setLabels(entry?.labels ?? emptyLabels());
      setDirty(false);
    }
  }

  const onCodeChange = useCallback((index: number, value: number) => {
    setCodes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setDirty(true);
  }, []);

  const onLabelChange = useCallback(
    (index: number, value: string) => {
      setLabels((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
      setDirty(true);
    },
    [],
  );

  const fillRange = useCallback(
    (start: number, end: number, value: number) => {
      setCodes((prev) => {
        const next = [...prev];
        for (let i = start; i <= end; i++) {
          next[i] = value;
        }
        return next;
      });
      setDirty(true);
    },
    [],
  );

  const { isDragging, startDrag, updateDrag, endDrag, isInDragRange } =
    useDragFill({ onFillRange: fillRange });

  const getCellValue = useCallback(
    (index: number) => codes[index],
    [codes],
  );

  const { handleClick: shiftClick } = useShiftSelect({
    onFillRange: fillRange,
    getCellValue,
  });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const row = el?.closest("[data-row-index]");
      if (row) {
        const idx = parseInt(
          (row as HTMLElement).dataset.rowIndex!,
          10,
        );
        updateDrag(idx);
      }
    },
    [isDragging, updateDrag],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      await upsertDay({ date, codes, labels });
      setDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const indices = useMemo(
    () => Array.from({ length: BLOCKS_PER_DAY }, (_, i) => i),
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <DatePicker date={date} onPrev={prev} onNext={next} />
        <button
          onClick={handleSave}
          disabled={!dirty || saving}
          className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
            dirty
              ? "bg-blue-600 hover:bg-blue-500 text-white"
              : "bg-gray-800 text-gray-500 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving..." : dirty ? "Save" : "Saved"}
        </button>
      </div>

      <Legend />

      <div
        className="flex flex-col max-h-[70vh] overflow-y-auto select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
      >
        {entry === undefined ? (
          <div className="text-gray-400 text-sm py-4 text-center">
            Loading...
          </div>
        ) : (
          indices.map((i) => (
            <LogRow
              key={i}
              index={i}
              code={codes[i]}
              label={labels[i]}
              inDragRange={isInDragRange(i)}
              onCodeChange={onCodeChange}
              onLabelChange={onLabelChange}
              onDragStart={startDrag}
              onCellClick={shiftClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
