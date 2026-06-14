import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/data/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { NavDrawer } from "@/components/layout/NavDrawer";

const LIGHT_SURFACE_SECTION_IDS = ["team", "contacts"];

function useHeaderLightSurface() {
  const [onLightSurface, setOnLightSurface] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const marker = 1;
      const next = LIGHT_SURFACE_SECTION_IDS.some((id) => {
        const section = document.getElementById(id);
        if (!section) return false;
        const rect = section.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
      });

      setOnLightSurface((current) => (current === next ? current : next));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
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

  return onLightSurface;
}

export function SiteHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeSection = useActiveSection();
  const { handleAnchorClick } = useAnchorScroll();
  const isOnLightSection = useHeaderLightSurface();

  useBodyScrollLock(drawerOpen);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header
        className={`site-header${isOnLightSection ? " site-header--on-light" : ""}`}
      >
        <nav className="site-nav" aria-label="Основная навигация">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={activeSection === link.id ? "is-active" : undefined}
              onClick={handleAnchorClick}
              aria-current={activeSection === link.id ? "true" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={drawerOpen}
          aria-controls="site-nav-menu"
          aria-label={drawerOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setDrawerOpen((o) => !o)}
        />
      </header>
      {drawerOpen ? (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Закрыть меню"
          onClick={closeDrawer}
        />
      ) : null}
      <NavDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        activeSection={activeSection}
      />
    </>
  );
}
