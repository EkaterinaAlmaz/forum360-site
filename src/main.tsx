import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "@/App";
import "@/styles/globals.css";

function ScrollResetOnReload() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const navEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const isReload = navEntry?.type === "reload";
    if (!isReload) return;
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ScrollResetOnReload />
    <App />
  </StrictMode>,
);
