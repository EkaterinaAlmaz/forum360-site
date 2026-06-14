import type { Member } from "@/types/member";

type TeamTooltipProps = {
  className: string;
  data: Member | null;
  descHtml: string;
  expanded: boolean;
  onToggleDetail: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
};

export function TeamTooltip({
  className,
  data,
  descHtml,
  expanded,
  onToggleDetail,
  onPointerEnter,
  onPointerLeave,
}: TeamTooltipProps) {
  if (!data) return null;

  return (
    <div
      className={className}
      role="tooltip"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <h3 className="tooltip-name">{data.name}</h3>
      <span className="tooltip-role mono">{data.role}</span>
      <div
        className="tooltip-body"
        dangerouslySetInnerHTML={{ __html: descHtml }}
      />
      <div className="tooltip-stats">
        <div className="stat-item">
          <span className="stat-val">{data?.s1 ?? "—"}</span>
          <span className="stat-lab mono">Опыт</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{data?.s2 ?? "—"}</span>
          <span className="stat-lab mono">{data?.s2Lab ?? "Контракты"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">{data?.s3 ?? "—"}</span>
          <span className="stat-lab mono">{data?.s3Lab ?? "Сумма / метрика"}</span>
        </div>
      </div>
      <div className="tooltip-more-wrap">
        <button
          type="button"
          className="tooltip-more-btn mono"
          aria-expanded={expanded}
          hidden={!data?.experience}
          onPointerDown={(e) => {
            e.stopPropagation();
            onPointerEnter();
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleDetail();
          }}
        >
          {expanded ? "Краткое описание" : "Подробнее об опыте"}
        </button>
      </div>
    </div>
  );
}
