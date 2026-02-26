import { useEffect, useState } from "react";

interface ColumnLayout {
  columnCount: number;
  blocksPerColumn: number;
}

/** Display page layout — fewer columns, more visual. */
function getDisplayLayout(width: number): ColumnLayout {
  if (width < 768) {
    return { columnCount: 4, blocksPerColumn: 72 };
  }
  return { columnCount: 6, blocksPerColumn: 48 };
}

/** Log page layout — more columns, denser. */
function getLogLayout(width: number): ColumnLayout {
  if (width < 768) {
    return { columnCount: 4, blocksPerColumn: 72 };
  }
  // Desktop: 8 columns of 36 blocks (3 hours each)
  return { columnCount: 8, blocksPerColumn: 36 };
}

function useLayout(
  getter: (width: number) => ColumnLayout,
): ColumnLayout {
  const [layout, setLayout] = useState<ColumnLayout>(() =>
    getter(typeof window !== "undefined" ? window.innerWidth : 1024),
  );

  useEffect(() => {
    function handleResize() {
      setLayout(getter(window.innerWidth));
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getter]);

  return layout;
}

export function useColumnLayout(): ColumnLayout {
  return useLayout(getDisplayLayout);
}

export function useLogColumnLayout(): ColumnLayout {
  return useLayout(getLogLayout);
}

/**
 * Split 288 blocks into column index arrays based on layout.
 */
export function splitIntoColumns(
  columnCount: number,
  blocksPerColumn: number,
): number[][] {
  return Array.from({ length: columnCount }, (_, col) => {
    const start = col * blocksPerColumn;
    return Array.from({ length: blocksPerColumn }, (_, i) => start + i);
  });
}
