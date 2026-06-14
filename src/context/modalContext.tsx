import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CaseId } from "@/types/case";
import type { MemberId } from "@/types/member";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

export type ModalState =
  | { type: "none" }
  | { type: "case"; caseId: CaseId; reopenProjects?: boolean }
  | { type: "projects" }
  | { type: "team"; memberId: MemberId };

type ModalContextValue = {
  state: ModalState;
  openCase: (caseId: CaseId, fromProjects?: boolean) => void;
  closeCase: () => void;
  openProjects: () => void;
  closeProjects: () => void;
  openTeamMember: (memberId: MemberId) => void;
  closeTeamMember: () => void;
  isCaseOpen: boolean;
  isProjectsOpen: boolean;
  isTeamOpen: boolean;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ModalState>({ type: "none" });

  const isCaseOpen = state.type === "case";
  const isProjectsOpen = state.type === "projects";
  const isTeamOpen = state.type === "team";
  const isAnyOpen = state.type !== "none";

  useBodyScrollLock(isAnyOpen);

  const openCase = useCallback((caseId: CaseId, fromProjects = false) => {
    setState({ type: "case", caseId, reopenProjects: fromProjects });
  }, []);

  const closeCase = useCallback(() => {
    setState((prev) => {
      if (prev.type === "case" && prev.reopenProjects) {
        return { type: "projects" };
      }
      return { type: "none" };
    });
  }, []);

  const openProjects = useCallback(() => {
    setState({ type: "projects" });
  }, []);

  const closeProjects = useCallback(() => {
    setState((prev) => {
      if (prev.type === "case") return prev;
      return { type: "none" };
    });
  }, []);

  const openTeamMember = useCallback((memberId: MemberId) => {
    setState({ type: "team", memberId });
  }, []);

  const closeTeamMember = useCallback(() => {
    setState((prev) => {
      if (prev.type === "team") return { type: "none" };
      return prev;
    });
  }, []);

  const value = useMemo(
    () => ({
      state,
      openCase,
      closeCase,
      openProjects,
      closeProjects,
      openTeamMember,
      closeTeamMember,
      isCaseOpen,
      isProjectsOpen,
      isTeamOpen,
    }),
    [
      state,
      openCase,
      closeCase,
      openProjects,
      closeProjects,
      openTeamMember,
      closeTeamMember,
      isCaseOpen,
      isProjectsOpen,
      isTeamOpen,
    ],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
