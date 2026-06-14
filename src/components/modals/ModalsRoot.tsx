import { lazy, Suspense } from "react";

const CaseModal = lazy(() =>
  import("@/components/cases/CaseModal").then((m) => ({ default: m.CaseModal })),
);
const ProjectsModal = lazy(() =>
  import("@/components/cases/ProjectsModal").then((m) => ({
    default: m.ProjectsModal,
  })),
);
const TeamMemberModal = lazy(() =>
  import("@/components/team/TeamMemberModal").then((m) => ({
    default: m.TeamMemberModal,
  })),
);

export function ModalsRoot() {
  return (
    <Suspense fallback={null}>
      <CaseModal />
      <ProjectsModal />
      <TeamMemberModal />
    </Suspense>
  );
}
