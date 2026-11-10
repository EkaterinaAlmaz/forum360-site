import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";
import { assetUrl } from "@/lib/assetUrl";

export function LetterModal() {
  const { content } = useSiteContent();
  const { state, openLetter, closeLetter } = useModal();
  const letters = content.letters.items;
  const index = state.type === "letter" ? letters.findIndex((item) => item.id === state.letterId) : -1;
  const letter = letters[index];
  const viewportRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [failed, setFailed] = useState(false);
  const letterId = letter?.id;

  useEffect(() => {
    setZoom(1);
    setFailed(false);
    viewportRef.current?.scrollTo(0, 0);
  }, [letterId]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || !letterId) return;
    const update = () => setSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [letterId]);

  useEffect(() => {
    if (index < 0 || letters.length < 2) return;
    // Warm adjacent documents only after the viewer opens, keeping the section light.
    for (const step of [-1, 1]) {
      const adjacent = letters[(index + step + letters.length) % letters.length];
      const image = new Image();
      image.decoding = "async";
      image.src = assetUrl(adjacent.image);
    }
  }, [index, letters]);

  useEffect(() => {
    if (index < 0) return;
    const onKey = (event: KeyboardEvent) => {
      if (zoom !== 1 || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
      event.preventDefault();
      const step = event.key === "ArrowLeft" ? -1 : 1;
      openLetter(letters[(index + step + letters.length) % letters.length].id);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, letters, openLetter, zoom]);

  if (!letter) return null;
  const fit = Math.min(Math.max(1, size.width - 32) / letter.width, Math.max(1, size.height - 32) / letter.height, 1);
  const width = Math.round(letter.width * fit * zoom);
  const height = Math.round(letter.height * fit * zoom);
  const move = (step: number) => openLetter(letters[(index + step + letters.length) % letters.length].id);

  return (
    <Modal open onClose={closeLetter} labelledBy="letter-viewer-title" className="modal modal--letter" panelClassName="letter-panel">
      <div className="letter-viewer__header">
        <div className="letter-viewer__heading">
          <span className="letter-viewer__eyebrow mono">{content.letters.title}</span>
          <h2 id="letter-viewer-title">{letter.title}</h2>
        </div>
        <a className="letter-viewer__original mono" href={assetUrl(letter.original)} target="_blank" rel="noopener noreferrer">Оригинал ↗</a>
        <button className="letter-viewer__close" type="button" data-close-modal aria-label="Закрыть письмо" onClick={closeLetter}>×</button>
      </div>
      <div className="letter-viewer__viewport" ref={viewportRef}>
        {failed ? (
          <p className="letter-viewer__error">Не удалось загрузить письмо. <a href={assetUrl(letter.original)} target="_blank" rel="noopener noreferrer">Открыть исходный файл</a></p>
        ) : (
          <div className="letter-viewer__stage" style={{ width: width + 32, height: height + 32 }}>
            <button
              className={`letter-viewer__image-button${zoom > 1 ? " is-zoomed" : ""}`}
              type="button"
              style={{ width, height }}
              aria-label={zoom > 1 ? "Уместить письмо на экране" : "Увеличить письмо"}
              onClick={() => setZoom((current) => current > 1 ? 1 : 2)}
            >
              <img key={letter.id} src={assetUrl(letter.image)} alt={`Благодарственное письмо — ${letter.title}`} width={letter.width} height={letter.height} draggable={false} onError={() => setFailed(true)} />
            </button>
          </div>
        )}
      </div>
      <div className="letter-viewer__footer">
        <button className="letters-arrow" type="button" aria-label="Предыдущее письмо" disabled={letters.length < 2} onClick={() => move(-1)}>←</button>
        <span className="letter-viewer__counter mono" aria-live="polite">{index + 1} / {letters.length}</span>
        <div className="letter-viewer__zoom">
          <button type="button" aria-label="Уменьшить письмо" disabled={zoom <= 1} onClick={() => setZoom((current) => Math.max(1, current - 0.5))}>−</button>
          <button className="letter-viewer__fit mono" type="button" aria-label="По размеру экрана" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
          <button type="button" aria-label="Увеличить масштаб письма" disabled={zoom >= 3} onClick={() => setZoom((current) => Math.min(3, current + 0.5))}>+</button>
        </div>
        <button className="letters-arrow" type="button" aria-label="Следующее письмо" disabled={letters.length < 2} onClick={() => move(1)}>→</button>
      </div>
    </Modal>
  );
}
