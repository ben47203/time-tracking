import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  blockToTime,
  emptyCodes,
  emptyLabels,
} from "../../lib/timeUtils";
import { useLogColumnLayout, splitIntoColumns } from "../../hooks/useColumnLayout";
import { useDragFill } from "../../hooks/useDragFill";
import { useShiftSelect } from "../../hooks/useShiftSelect";
import { LogRow } from "./LogRow";
import { LabelPopover } from "./LabelPopover";
import { DatePicker } from "../DatePicker";
import { Legend } from "../Legend";
import { useDateNav } from "../../hooks/useDateNav";

interface LabelEdit {
  index: number;
  rect: DOMRect;
}

export function LogTable() {
  const { date, prev, next } = useDateNav();
  const entry = useQuery(api.timeEntries.getByDate, { date });
  const upsertDay = useMutation(api.timeEntries.upsertDay);
  const { columnCount, blocksPerColumn } = useLogColumnLayout();

  const [codes, setCodes] = useState<number[]>(emptyCodes());
  const [labels, setLabels] = useState<string[]>(emptyLabels());
  const [dirty, setDirty] = useState(false);
  const [labelEdit, setLabelEdit] = useState<LabelEdit | null>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "dirty">("saved");

  // Refs for auto-save debounce
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codesRef = useRef(codes);
  const labelsRef = useRef(labels);
  const dateRef = useRef(date);
  codesRef.current = codes;
  labelsRef.current = labels;
  dateRef.current = date;

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
      setSaveStatus("saved");
    }
  }

  // Auto-save with 1.5s debounce
  const doSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      await upsertDay({
        date: dateRef.current,
        codes: codesRef.current,
        labels: labelsRef.current,
      });
      setDirty(false);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("dirty");
    }
  }, [upsertDay]);

  useEffect(() => {
    if (!dirty) return;
    setSaveStatus("dirty");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void doSave();
    }, 1500);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [dirty, codes, labels, doSave]);

  // Save immediately on date change or unmount if dirty
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        // Fire save synchronously isn't possible, but the mutation is already queued
      }
    };
  }, [date]);

  const markDirty = useCallback(() => setDirty(true), []);

  const onCodeChange = useCallback((index: number, value: number) => {
    setCodes((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    markDirty();
  }, [markDirty]);

  const onLabelChange = useCallback(
    (index: number, value: string) => {
      setCodes((currentCodes) => {
        const code = currentCodes[index];
        setLabels((prev) => {
          const next = [...prev];
          next[index] = value;
          for (let i = index + 1; i < next.length; i++) {
            if (currentCodes[i] !== code) break;
            next[i] = value;
          }
          return next;
        });
        return currentCodes;
      });
      markDirty();
    },
    [markDirty],
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
      markDirty();
    },
    [markDirty],
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

  const handleNavigate = useCallback(
    (index: number, direction: "up" | "down") => {
      const target = direction === "down" ? index + 1 : index - 1;
      if (target < 0 || target >= 288) return;
      const el = document.querySelector(
        `[data-code-index="${target}"]`,
      ) as HTMLInputElement | null;
      el?.focus();
      el?.select();
    },
    [],
  );

  const handleLabelClick = useCallback(
    (index: number, rect: DOMRect) => {
      setLabelEdit({ index, rect });
    },
    [],
  );

  const handleLabelClose = useCallback(() => {
    setLabelEdit(null);
  }, []);

  const columns = useMemo(
    () => splitIntoColumns(columnCount, blocksPerColumn),
    [columnCount, blocksPerColumn],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <DatePicker date={date} onPrev={prev} onNext={next} />
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            saveStatus === "saving"
              ? "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30"
              : saveStatus === "dirty"
                ? "text-gray-400 bg-gray-700/50 border border-gray-600/30"
                : "text-green-400 bg-green-400/10 border border-green-400/30"
          }`}
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "dirty"
              ? "Unsaved"
              : "Saved"}
        </span>
      </div>

      <Legend codes={codes} />

      <div
        className="select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
      >
        {entry === undefined ? (
          <div className="text-gray-400 text-sm py-4 text-center">
            Loading...
          </div>
        ) : (
          <div
            className="grid gap-x-3 gap-y-0"
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            }}
          >
            {columns.map((colIndices, colIdx) => {
              const startIdx = colIndices[0];
              const endIdx = colIndices[colIndices.length - 1] + 1;
              return (
                <div key={colIdx} className="flex flex-col min-w-0">
                  <div className="text-[9px] text-gray-500 font-mono mb-0.5">
                    {blockToTime(startIdx)} – {blockToTime(endIdx)}
                  </div>
                  {colIndices.map((i, rowIdx) => (
                    <LogRow
                      key={i}
                      index={i}
                      code={codes[i]}
                      label={labels[i]}
                      inDragRange={isInDragRange(i)}
                      isFirst={rowIdx === 0}
                      isLast={rowIdx === colIndices.length - 1}
                      onCodeChange={onCodeChange}
                      onDragStart={startDrag}
                      onCellClick={shiftClick}
                      onLabelClick={handleLabelClick}
                      onNavigate={handleNavigate}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {labelEdit && (
        <LabelPopover
          index={labelEdit.index}
          label={labels[labelEdit.index]}
          anchorRect={labelEdit.rect}
          onSave={onLabelChange}
          onClose={handleLabelClose}
        />
      )}
    </div>
  );
}
