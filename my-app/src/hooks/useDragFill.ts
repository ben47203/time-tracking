import { useCallback, useRef, useState } from "react";

interface DragFillState {
  isDragging: boolean;
  sourceIndex: number | null;
  sourceValue: number;
  dragRange: [number, number] | null;
}

interface UseDragFillOptions {
  onFillRange: (start: number, end: number, value: number) => void;
}

export function useDragFill({ onFillRange }: UseDragFillOptions) {
  const [state, setState] = useState<DragFillState>({
    isDragging: false,
    sourceIndex: null,
    sourceValue: 0,
    dragRange: null,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const startDrag = useCallback(
    (index: number, value: number, e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      const newState: DragFillState = {
        isDragging: true,
        sourceIndex: index,
        sourceValue: value,
        dragRange: [index, index],
      };
      setState(newState);
      stateRef.current = newState;
    },
    [],
  );

  const updateDrag = useCallback(
    (currentIndex: number) => {
      const s = stateRef.current;
      if (!s.isDragging || s.sourceIndex === null) return;
      const start = Math.min(s.sourceIndex, currentIndex);
      const end = Math.max(s.sourceIndex, currentIndex);
      const newState = { ...s, dragRange: [start, end] as [number, number] };
      setState(newState);
      stateRef.current = newState;
    },
    [],
  );

  const endDrag = useCallback(() => {
    const s = stateRef.current;
    if (s.isDragging && s.dragRange) {
      onFillRange(s.dragRange[0], s.dragRange[1], s.sourceValue);
    }
    const newState: DragFillState = {
      isDragging: false,
      sourceIndex: null,
      sourceValue: 0,
      dragRange: null,
    };
    setState(newState);
    stateRef.current = newState;
  }, [onFillRange]);

  const isInDragRange = useCallback(
    (index: number): boolean => {
      if (!state.dragRange) return false;
      return index >= state.dragRange[0] && index <= state.dragRange[1];
    },
    [state.dragRange],
  );

  return {
    isDragging: state.isDragging,
    dragRange: state.dragRange,
    startDrag,
    updateDrag,
    endDrag,
    isInDragRange,
  };
}
