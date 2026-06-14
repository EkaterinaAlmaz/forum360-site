import { CaseRow } from "@/components/cases/CaseRow";
import { useSiteContent } from "@/context/contentContext";
import type { CaseId } from "@/types/case";

type CasesTableProps = {
  variant?: "featured" | "all";
  ids?: CaseId[];
};

export function CasesTable({ variant = "featured", ids }: CasesTableProps) {
  const { content } = useSiteContent();
  const ordered =
    ids ??
    content.cases.caseOrder
      .filter((id) => Boolean(content.cases.items[id]))
      .slice(0, variant === "featured" ? 4 : undefined);
  const labels = content.cases.tableLabels;

  return (
    <div
      className={`cases-table${variant === "all" ? " cases-table--all" : ""}`}
      role="table"
      aria-label={variant === "all" ? labels.allAria : labels.featuredAria}
    >
      <div className="cases-row cases-row--head mono" role="row">
        <span role="columnheader">#</span>
        <span role="columnheader">{labels.project}</span>
        <span role="columnheader">{labels.meta}</span>
        <span role="columnheader">{labels.eis}</span>
      </div>
      {ordered.map((id, i) => (
        <CaseRow key={id} caseId={id} index={i} variant={variant} />
      ))}
    </div>
  );
}
