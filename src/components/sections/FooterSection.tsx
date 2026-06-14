import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/context/contentContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function formatMoscowTime(): string {
  const fmt = new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "short",
    timeStyle: "medium",
  });
  return `UTC+03:00 — ${fmt.format(new Date())}`;
}

export function FooterSection() {
  const isMobileContact = useMediaQuery("(max-width: 880px)");
  const { content } = useSiteContent();
  const [time, setTime] = useState(formatMoscowTime);

  useEffect(() => {
    const id = window.setInterval(() => setTime(formatMoscowTime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="site-footer" id="contacts">
      <Reveal className="footer-main" as="div">
        <div className="footer-col">
          <h3 className="footer-brand">{content.footer.brand}</h3>
          <p className="footer-desc">{content.footer.description}</p>
          <div className="footer-cta">
            {isMobileContact ? (
              <a
                className="footer-contact footer-contact--link mono"
                href={`tel:${content.footer.phone.replace(/[^\d+]/g, "")}`}
              >
                {content.footer.phone}
              </a>
            ) : (
              <span className="footer-contact mono">{content.footer.phone}</span>
            )}
            {isMobileContact ? (
              <a
                className="footer-contact footer-contact--link mono"
                href={`mailto:${content.footer.email}`}
              >
                {content.footer.email}
              </a>
            ) : (
              <span className="footer-contact mono">{content.footer.email}</span>
            )}
          </div>
        </div>
        <div className="footer-col footer-col--mono">
          <h4 className="mono footer-heading">{content.footer.systemHeading}</h4>
          <p>{content.footer.legalName}</p>
          <p>{content.footer.inn}</p>
          <p>{content.footer.address}</p>
          <p>
            <a href={`mailto:${content.footer.email}`}>{content.footer.email}</a>
          </p>
        </div>
        <div className="footer-col footer-deco mono" aria-hidden="true">
          <div className="footer-chart">
            <svg
              viewBox="0 0 120 60"
              preserveAspectRatio="none"
              className="footer-chart-svg"
            >
              <path
                d="M0,45 L20,40 L40,50 L60,25 L80,30 L100,10 L120,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                opacity="0.5"
              />
            </svg>
            <span className="footer-chart-cap">{content.footer.chartCaption}</span>
          </div>
        </div>
      </Reveal>
      <Reveal className="footer-strip" as="div">
        <span className="footer-status">
          <span className="footer-dot" />
          {content.footer.statusLabel}
        </span>
        <span id="footer-time">{time}</span>
        <span>{content.footer.secureLabel}</span>
      </Reveal>
    </footer>
  );
}
