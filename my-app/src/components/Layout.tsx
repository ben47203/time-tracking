import { Link, Outlet, useLocation } from "react-router";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/time-tracking", label: "Time Tracking" },
  { to: "/log", label: "Log" },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <span className="text-lg font-semibold text-gray-100">
            benjbryant.com
          </span>
          <div className="flex gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? "text-blue-400 font-medium"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
