import { CasesSectionDecor } from "@/components/cases/CasesSectionDecor";
import { CasesTable } from "@/components/cases/CasesTable";
import { Reveal } from "@/components/ui/Reveal";
import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";

export function CasesSection() {
  const { openProjects } = useModal();
  const { content } = useSiteContent();

  return (
    <section className="section cases-section" id="cases" aria-labelledby="cases-title">
      <CasesSectionDecor />
      <div className="section-head section-head--row">
        <div>
          <span className="section-num mono">{content.cases.sectionNumber}</span>
          <h2 className="section-title" id="cases-title">
            {content.cases.title}
          </h2>
        </div>
        <button
          type="button"
          className="cases-all-link cases-all-btn mono"
          id="casesAllBtn"
          onClick={openProjects}
        >
          {content.cases.allProjectsLabel}
        </button>
      </div>
      <Reveal>
        <CasesTable variant="featured" />
      </Reveal>
    </section>
  );
}
