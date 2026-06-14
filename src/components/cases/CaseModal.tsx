import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";
import { useCaseGallery } from "@/hooks/useCaseGallery";
import type { CasePhoto } from "@/types/case";

const EMPTY_PHOTOS: CasePhoto[] = [];

export function CaseModal() {
  const { state, closeCase } = useModal();
  const { content } = useSiteContent();
  const open = state.type === "case";
  const caseId = open ? state.caseId : null;
  const c = caseId ? content.cases.items[caseId] : null;
  const gallery = useCaseGallery(
    caseId,
    c?.title ?? "",
    caseId ? (content.cases.photos[caseId] ?? EMPTY_PHOTOS) : EMPTY_PHOTOS,
  );
  const touchStartX = useRef<number | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const stepRef = useRef(gallery.step);
  stepRef.current = gallery.step;

  useEffect(() => {
    setDetailOpen(false);
  }, [caseId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepRef.current(-1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepRef.current(1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open || !caseId || !c) return null;

  const bodyHtml = detailOpen ? c.bodyDetail : c.body;
  const showBody = Boolean(bodyHtml);
  const showDetailToggle = Boolean(c.bodyDetail);
  const labels = content.cases.modalLabels;

  return (
    <Modal
      open={open}
      onClose={closeCase}
      labelledBy="modalTitle"
      className="modal"
      panelClassName={`modal-panel${detailOpen ? " is-detail-open" : ""}`}
    >
      <button
        type="button"
        className="modal-close mono"
        data-close-modal
        aria-label={labels.close}
        onClick={closeCase}
      >
        ×
      </button>
      <div className={`modal-layout${detailOpen ? " is-detail-open" : ""}`}>
        <div className="modal-visual">
          <div
            className={`modal-viewport${gallery.loading ? " is-loading" : ""}`}
            id="modalViewport"
            aria-busy={gallery.loading}
            aria-live="polite"
            onTouchStart={(e) => {
              if (e.changedTouches.length)
                touchStartX.current = e.changedTouches[0].clientX;
            }}
            onTouchEnd={(e) => {
              if (touchStartX.current == null || !e.changedTouches.length) return;
              const dx = e.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) < 48) return;
              gallery.step(dx > 0 ? -1 : 1);
            }}
          >
            <div
              className="modal-gallery-loader"
              aria-hidden={gallery.loading ? "false" : "true"}
            />
            <button
              type="button"
              className="modal-nav modal-nav--prev"
              aria-label={labels.previousPhoto}
              onClick={() => gallery.step(-1)}
            >
              ‹
            </button>
            <img
              className="modal-gallery-img"
              src={gallery.src || undefined}
              alt={gallery.alt}
              decoding="async"
            />
            <button
              type="button"
              className="modal-nav modal-nav--next"
              aria-label={labels.nextPhoto}
              onClick={() => gallery.step(1)}
            >
              ›
            </button>
          </div>
          <div className="modal-gallery-toolbar mono">
            <span>{gallery.countLabel}</span>
            <span className="modal-gallery-hint">{labels.galleryHint}</span>
          </div>
        </div>
        <div className={`modal-aside${detailOpen ? " is-detail-open" : ""}`}>
          <div className="modal-aside-head">
            <h2 className="modal-title" id="modalTitle">
              {c.title}
            </h2>
            <p className="modal-meta mono">{c.meta}</p>
          </div>
          {showBody ? (
            <div
              className="modal-body"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : null}
          <div className="modal-aside-actions">
            {showDetailToggle ? (
              <button
                type="button"
                className="modal-detail-btn mono"
                aria-expanded={detailOpen}
                onClick={() => setDetailOpen((v) => !v)}
              >
                {detailOpen ? labels.detailClose : labels.detailOpen}
              </button>
            ) : null}
            <a
              className="btn btn--primary modal-eis"
              href={c.eis}
              target="_blank"
              rel="noopener noreferrer"
            >
              {labels.openEis}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
