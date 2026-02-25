import { Link } from "react-router";

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center mt-20 gap-6">
      <h1 className="text-3xl font-bold text-gray-100">Time Tracking</h1>
      <p className="text-gray-400 text-center max-w-md">
        Track every 5-minute block of your day across 16 categories. Visualize
        how you spend your time with detailed statistics.
      </p>
      <div className="flex gap-4">
        <Link
          to="/time-tracking"
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
        >
          View Time Tracking
        </Link>
        <Link
          to="/log"
          className="px-6 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium transition-colors"
        >
          Log Time
        </Link>
      </div>
    </div>
  );
}
