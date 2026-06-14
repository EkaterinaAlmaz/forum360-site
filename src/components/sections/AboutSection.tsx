import { AboutGeoArt } from "@/components/about/AboutGeoArt";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/context/contentContext";
import { useAnchorScroll } from "@/hooks/useAnchorScroll";

export function AboutSection() {
  const { handleAnchorClick } = useAnchorScroll();
  const { content } = useSiteContent();

  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="section-head">
        <span className="section-num mono">{content.about.sectionNumber}</span>
        <h2 className="section-title" id="about-title">
          {content.about.title}
        </h2>
      </div>
      <Reveal className="about-panel">
        <div className="about-panel__content">
          <div className="about-text" lang="ru">
            {content.about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <a
            href={content.about.ctaHref}
            className="btn btn--ghost about-cta"
            onClick={handleAnchorClick}
          >
            {content.about.ctaText}
            <span className="about-cta__icon" aria-hidden="true">
              {content.about.ctaIcon}
            </span>
          </a>
        </div>
        <div className="about-panel__visual" aria-hidden="true">
          <AboutGeoArt />
        </div>
      </Reveal>
    </section>
  );
}
