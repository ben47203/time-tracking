import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import "./index.css";
import { Layout } from "./components/Layout";
import { TimeTrackingPage } from "./pages/TimeTrackingPage";
import { LogPage } from "./pages/LogPage";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/time-tracking" replace /> },
      { path: "/time-tracking", element: <TimeTrackingPage /> },
      { path: "/log", element: <LogPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      <RouterProvider router={router} />
    </ConvexAuthProvider>
  </StrictMode>,
);
