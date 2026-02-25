export interface Category {
  code: number;
  name: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { code: 1, name: "Sleep", color: "#1e293b" },
  { code: 2, name: "Daily Organisation", color: "#f59e0b" },
  { code: 3, name: "Paid Work", color: "#22c55e" },
  { code: 4, name: "University Study", color: "#3b82f6" },
  { code: 5, name: "UQIES", color: "#6366f1" },
  { code: 6, name: "Visulus", color: "#8b5cf6" },
  { code: 7, name: "Personal Work & Projects", color: "#14b8a6" },
  { code: 8, name: "Exercise", color: "#ef4444" },
  { code: 9, name: "Eating", color: "#f97316" },
  { code: 10, name: "Cooking and Cleaning", color: "#a3e635" },
  { code: 11, name: "Transport", color: "#64748b" },
  { code: 12, name: "Social", color: "#ec4899" },
  { code: 13, name: "Digital Social", color: "#f472b6" },
  { code: 14, name: "Bible and Prayer", color: "#fbbf24" },
  { code: 15, name: "Hobbies", color: "#06b6d4" },
  { code: 16, name: "Waste", color: "#78716c" },
];

export const UNSET_COLOR = "#374151"; // gray-700 for unset blocks

export function getCategoryByCode(code: number): Category | undefined {
  return CATEGORIES.find((c) => c.code === code);
}

export function getCategoryColor(code: number): string {
  return getCategoryByCode(code)?.color ?? UNSET_COLOR;
}
