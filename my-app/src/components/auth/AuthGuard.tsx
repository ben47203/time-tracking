import { useConvexAuth } from "convex/react";
import type { ReactNode } from "react";
import { SignIn } from "./SignIn";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignIn />;
  }

  return <>{children}</>;
}
