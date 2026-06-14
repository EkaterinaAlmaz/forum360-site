import { HeroProcessArt } from "@/components/hero/HeroProcessArt";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/context/contentContext";
import heroLogoUrl from "../../../assets/hero-logo.svg?url";

export function HeroSection() {
  const { content } = useSiteContent();

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      <Reveal className="hero__inner">
        <div className="hero__main">
          <div className="hero__brand">
            <img
              src={heroLogoUrl}
              alt=""
              className="hero__logo"
              decoding="async"
              aria-hidden="true"
            />
            <p className="hero__tagline" id="hero-title">
              {content.hero.tagline}
            </p>
          </div>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <HeroProcessArt content={content.hero} />
        </div>
      </Reveal>
    </section>
  );
}
