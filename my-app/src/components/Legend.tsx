import { CATEGORIES } from "../lib/categories";

export function Legend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {CATEGORIES.map((cat) => (
        <div key={cat.code} className="flex items-center gap-1.5">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: cat.color }}
          />
          <span className="text-xs text-gray-400">{cat.name}</span>
        </div>
      ))}
    </div>
  );
}
