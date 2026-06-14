import { QUARTER_ASSETS, TEAM_HIT_PATHS } from "@/data/teamHits";
import { assetUrl } from "@/lib/assetUrl";
import { useSiteContent } from "@/context/contentContext";
import { useTeamInteraction } from "@/hooks/useTeamInteraction";
import { TeamTooltip } from "@/components/team/TeamTooltip";
import type { MemberId } from "@/types/member";

const MEMBER_IDS = Object.keys(QUARTER_ASSETS) as MemberId[];

function isNode(value: EventTarget | null): value is Node {
  return value instanceof Node;
}

export function TeamCircle() {
  const team = useTeamInteraction();
  const { content } = useSiteContent();
  const members = content.team.members;

  return (
    <div
      className={team.circleClassName}
      id="teamCircle"
      role="group"
      aria-label="Команда ФОРУМ 360: четыре руководителя"
      onPointerLeave={(e) => {
        if (team.isTouchTeamMode) return;
        const related = isNode(e.relatedTarget) ? e.relatedTarget : null;
        if (related && e.currentTarget.contains(related)) return;
        const tooltip = e.currentTarget.querySelector(
          ".tooltip.tooltip--in-circle",
        );
        if (related && tooltip?.contains(related)) return;
        team.scheduleLeave();
      }}
    >
      {MEMBER_IDS.map((id) => (
        <div
          key={id}
          className={team.quarterClass(id)}
          data-member={id}
        >
          <img
            className="team-quarter__svg"
            src={QUARTER_ASSETS[id].src}
            alt=""
            width={1000}
            height={1000}
            decoding="async"
          />
        </div>
      ))}
      <img
        className="team-circle-center"
        src={assetUrl("assets/team/team-center.svg")}
        alt=""
        width={1000}
        height={1000}
        decoding="async"
      />
      <svg
        className="team-circle-hits"
        viewBox="0 0 1000 1000"
        role="group"
        aria-label="Интерактивные секторы команды"
        focusable="false"
      >
        {TEAM_HIT_PATHS.map(({ member, d }) => {
          const data = members[member];
          return (
            <path
              key={member}
              data-member={member}
              d={d}
              tabIndex={team.isTouchTeamMode ? -1 : 0}
              role="button"
              aria-label={data ? `${data.name} — ${data.role}` : member}
              onPointerEnter={() => {
                if (!team.isTouchTeamMode) team.activateMember(member);
              }}
              onFocus={() => {
                if (!team.isTouchTeamMode) team.activateMember(member);
              }}
              onPointerLeave={() => {
                if (
                  !team.isTouchTeamMode &&
                  team.activeMember === member &&
                  document.activeElement !==
                    document.querySelector(
                      `.team-circle-hits path[data-member="${member}"]`,
                    )
                ) {
                  team.scheduleLeave();
                }
              }}
              onClick={(e) => {
                if (!team.isTouchTeamMode) return;
                e.preventDefault();
                e.stopPropagation();
                team.activateMember(member);
              }}
              onBlur={() => {
                if (!team.isTouchTeamMode && team.activeMember === member) {
                  team.clearActive();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  team.activateMember(member);
                }
                if (e.key === "Escape") {
                  (e.currentTarget as SVGPathElement).blur();
                  team.clearActive();
                }
              }}
            />
          );
        })}
      </svg>
      <TeamTooltip
        className={team.tooltipClassName}
        data={team.activeData}
        descHtml={team.tooltipHtml}
        expanded={team.tooltipExpanded}
        onToggleDetail={team.toggleTooltipDetail}
        onPointerEnter={team.cancelLeave}
        onPointerLeave={team.scheduleLeave}
      />
    </div>
  );
}
