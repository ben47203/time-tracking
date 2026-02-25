import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { AuthGuard } from "../components/auth/AuthGuard";
import { LogTable } from "../components/log/LogTable";

export function LogPage() {
  return (
    <AuthGuard>
      <LogPageContent />
    </AuthGuard>
  );
}

function LogPageContent() {
  const { signOut } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Log Time</h1>
        {isAuthenticated && (
          <button
            onClick={() => void signOut()}
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
      <LogTable />
    </div>
  );
}
