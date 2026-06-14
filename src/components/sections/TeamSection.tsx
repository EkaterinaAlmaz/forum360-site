import { TeamCircle } from "@/components/team/TeamCircle";
import { TeamSectionDecor } from "@/components/team/TeamSectionDecor";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/context/contentContext";

export function TeamSection() {
  const { content } = useSiteContent();

  return (
    <section className="section team-section" id="team" aria-labelledby="team-title">
      <TeamSectionDecor />
      <div className="section-head">
        <span className="section-num mono">{content.team.sectionNumber}</span>
        <h2 className="section-title" id="team-title">
          {content.team.title}
        </h2>
        <p className="team-tagline">{content.team.tagline}</p>
      </div>
      <p className="section-sub section-sub--mobile mono">
        {content.team.mobileHint}
      </p>
      <Reveal className="team-wrapper">
        <TeamCircle />
      </Reveal>
    </section>
  );
}
