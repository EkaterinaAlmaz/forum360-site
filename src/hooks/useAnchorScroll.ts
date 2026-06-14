import { useCallback } from "react";

const ANCHOR_GAP = 14;

function getHeaderHeight(): number {
  const header = document.querySelector<HTMLElement>(".site-header");
  return header?.getBoundingClientRect().height ?? 0;
}

function getAnchor(target: HTMLElement): HTMLElement {
  if (target.id === "hero") return target;
  return target.querySelector<HTMLElement>(".section-head") ?? target;
}

function scrollToExact(top: number): void {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: "auto" });
  window.requestAnimationFrame(() => {
    root.style.scrollBehavior = previousScrollBehavior;
  });
}

export function useAnchorScroll() {
  const scrollToTarget = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return;

      if (target.id === "hero") {
        scrollToExact(0);
        return;
      }

      const anchor = getAnchor(target);
      const top =
        anchor.getBoundingClientRect().top +
        window.scrollY -
        getHeaderHeight() -
        ANCHOR_GAP;

      scrollToExact(top);
    },
    [],
  );

  const handleAnchorClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const hash = e.currentTarget.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      window.history.pushState(null, "", hash);
    },
    [scrollToTarget],
  );

  return { scrollToTarget, handleAnchorClick };
}
