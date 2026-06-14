import { useEffect } from "react";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

type AppLayoutProps = {
  children: ReactNode;
  footer: ReactNode;
  modals: ReactNode;
};

export function AppLayout({ children, footer, modals }: AppLayoutProps) {
  const { scrollToTarget } = useAnchorScroll();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      window.requestAnimationFrame(() => scrollToTarget(target));
    };

    const timer = window.setTimeout(scrollToHash, 80);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [scrollToTarget]);

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main className="main" id="main-content">
        {children}
      </main>
      {footer}
      {modals}
    </>
  );
}
