import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/navigation";

const ACTIVE_GAP = 14;

function getHeaderHeight(): number {
  const header = document.querySelector<HTMLElement>(".site-header");
  return header?.getBoundingClientRect().height ?? 0;
}

function getAnchor(section: HTMLElement): HTMLElement {
  if (section.id === "hero") return section;
  return section.querySelector<HTMLElement>(".section-head") ?? section;
}

export function useActiveSection(): string {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.id);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n));

    if (nodes.length === 0) return;

    let frame = 0;

    const updateActive = () => {
      frame = 0;

      if (window.scrollY <= 2) {
        setActive("hero");
        return;
      }

      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      if (maxScroll - window.scrollY <= 2) {
        setActive(nodes[nodes.length - 1].id);
        return;
      }

      const marker = getHeaderHeight() + ACTIVE_GAP;
      let nextId = nodes[0].id;
      let bestDistance = Number.POSITIVE_INFINITY;

      nodes.forEach((node) => {
        const anchor = getAnchor(node);
        const distance = Math.abs(anchor.getBoundingClientRect().top - marker);
        if (distance < bestDistance) {
          bestDistance = distance;
          nextId = node.id;
        }
      });

      setActive((current) => (current === nextId ? current : nextId));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, []);

  return active;
}
