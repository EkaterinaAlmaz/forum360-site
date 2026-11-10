import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";
import { assetUrl } from "@/lib/assetUrl";

const number = (value: number) => String(value).padStart(2, "0");

export function LettersSection() {
  const { content } = useSiteContent();
  const { openLetter } = useModal();
  const railRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({ first: 0, visible: 1, atEnd: false });
  const copy = content.letters;

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      const card = rail.firstElementChild as HTMLElement | null;
      if (!card) return;
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      const visible = Math.min(copy.items.length, Math.max(1, Math.floor((rail.clientWidth + gap) / step + 0.01)));
      setPosition({
        first: Math.min(Math.round(rail.scrollLeft / step), Math.max(0, copy.items.length - visible)),
        visible,
        atEnd: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2,
      });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    rail.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      rail.removeEventListener("scroll", update);
    };
  }, [copy.items.length]);

  const move = (direction: number) => {
    const rail = railRef.current;
    const card = rail?.firstElementChild;
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    rail.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  if (copy.items.length === 0) return null;
  const last = Math.min(position.first + position.visible, copy.items.length);

  return (
    <section className="section letters-section" id="thanks" aria-labelledby="letters-title">
      <div className="section-head section-head--row">
        <div>
          <span className="section-num mono">{copy.sectionNumber}</span>
          <h2 className="section-title" id="letters-title">{copy.title}</h2>
        </div>
      </div>
      <div role="region" aria-roledescription="карусель" aria-label="Благодарственные письма">
        <ul
          className="letters-rail"
          id="letters-rail"
          ref={railRef}
          tabIndex={0}
          aria-label="Письма заказчиков"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            } else if (event.key === "Home" || event.key === "End") {
              event.preventDefault();
              railRef.current?.scrollTo({ left: event.key === "Home" ? 0 : railRef.current.scrollWidth, behavior: "auto" });
            }
          }}
        >
          {copy.items.map((letter) => (
            <li className="letter-card" key={letter.id}>
              <button
                className="letter-card__button"
                type="button"
                data-letter={letter.id}
                aria-label={`Открыть письмо: ${letter.title}`}
                onClick={() => openLetter(letter.id)}
              >
                <img src={assetUrl(letter.preview)} alt={`Благодарственное письмо — ${letter.title}`} loading="lazy" decoding="async" width={letter.width} height={letter.height} />
              </button>
            </li>
          ))}
        </ul>
        {copy.items.length > position.visible && <div className="letters-controls">
          <span className="letters-counter mono" aria-live="polite" aria-atomic="true">
            {number(position.first + 1)}{last > position.first + 1 ? ` — ${number(last)}` : ""}
            <span> / {number(copy.items.length)}</span>
          </span>
          <div className="letters-arrows">
            <button type="button" className="letters-arrow" aria-label={copy.previous} aria-controls="letters-rail" disabled={position.first === 0} onClick={() => move(-1)}>←</button>
            <button type="button" className="letters-arrow" aria-label={copy.next} aria-controls="letters-rail" disabled={position.atEnd} onClick={() => move(1)}>→</button>
          </div>
        </div>}
      </div>
    </section>
  );
}
