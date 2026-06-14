import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  className?: string;
  panelClassName?: string;
  children: ReactNode;
  backdropDataAttr?: string;
  closeDataAttr?: string;
};

export function Modal({
  open,
  onClose,
  labelledBy,
  className = "modal",
  panelClassName = "modal-panel",
  children,
  backdropDataAttr = "data-close-modal",
  closeDataAttr = "data-close-modal",
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const root = document.getElementById("root");

  useEffect(() => {
    if (!open || !root) return;
    root.setAttribute("aria-hidden", "true");
    return () => root.removeAttribute("aria-hidden");
  }, [open, root]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      const isCoarseTouch = window.matchMedia(
        "(hover: none) and (pointer: coarse)",
      ).matches;
      if (isCoarseTouch) return;
      const closeBtn = panelRef.current?.querySelector<HTMLElement>(
        `[${closeDataAttr}]`,
      );
      closeBtn?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      prev?.focus();
    };
  }, [open, onClose, closeDataAttr]);

  if (!open) return null;

  const dialog = (
    <div
      className={`${className} is-open`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy || titleId}
    >
      <div
        className="modal-backdrop"
        data-close-modal={
          backdropDataAttr === "data-close-modal" ? true : undefined
        }
        data-close-projects-modal={
          backdropDataAttr === "data-close-projects-modal" ? true : undefined
        }
        data-close-team-modal={
          backdropDataAttr === "data-close-team-modal" ? true : undefined
        }
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={panelClassName} ref={panelRef}>
        {children}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
