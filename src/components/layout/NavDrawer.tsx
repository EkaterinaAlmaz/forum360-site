import { NAV_LINKS } from "@/data/navigation";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

type NavDrawerProps = {
  open: boolean;
  onClose: () => void;
  activeSection: string;
};

export function NavDrawer({ open, onClose, activeSection }: NavDrawerProps) {
  const { scrollToTarget } = useAnchorScroll();

  return (
    <div
      className={`nav-drawer${open ? " is-open" : ""}`}
      id="site-nav-menu"
    >
      <nav className="site-nav site-nav--drawer" aria-label="Мобильное меню">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={activeSection === link.id ? "is-active" : undefined}
            aria-current={activeSection === link.id ? "true" : undefined}
            onClick={(e) => {
              const hash = e.currentTarget.getAttribute("href");
              const target = hash
                ? document.querySelector<HTMLElement>(hash)
                : null;
              if (!hash || !target) return;
              e.preventDefault();
              onClose();
              window.history.pushState(null, "", hash);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => scrollToTarget(target));
              });
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
