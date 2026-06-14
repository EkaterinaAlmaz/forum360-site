import { useSiteContent } from "@/context/contentContext";
import { useModal } from "@/context/modalContext";
import type { CaseId } from "@/types/case";

type CaseRowProps = {
  caseId: CaseId;
  index: number;
  variant?: "featured" | "all";
};

export function CaseRow({ caseId, index, variant = "featured" }: CaseRowProps) {
  const { openCase, isProjectsOpen } = useModal();
  const { content } = useSiteContent();
  const c = content.cases.items[caseId];
  if (!c) return null;

  const number = String(index + 1).padStart(2, "0");
  const compactMeta = c.meta.replace(/\s*·\s*/g, " · ");

  const open = () => openCase(caseId, isProjectsOpen);

  return (
    <div
      className={`cases-row cases-row--data${variant === "all" ? " cases-row--all" : ""}`}
      role="button"
      tabIndex={0}
      data-case={caseId}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest(".eis-link")) return;
        open();
      }}
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        if ((e.target as HTMLElement).closest(".eis-link")) return;
        e.preventDefault();
        open();
      }}
    >
      <span className="mono" role="cell">
        {number}
      </span>
      <span role="cell">
        <strong>{c.title}</strong>
      </span>
      <span role="cell" className="cases-loc">
        {compactMeta}
      </span>
      <span role="cell">
        <a
          className="eis-link"
          href={c.eis}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          {content.cases.tableLabels.eis}
        </a>
      </span>
    </div>
  );
}
