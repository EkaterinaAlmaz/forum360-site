import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { defaultContent } from "@/content/defaultContent";
import { applyRussianTypography } from "@/content/typography";
import type { SiteContent } from "@/types/content";

type ContentContextValue = {
  content: SiteContent;
  loading: boolean;
  error: string | null;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function mergeContent(input: unknown): SiteContent {
  if (!isObject(input)) return defaultContent;
  const next = input as Partial<SiteContent>;
  return applyRussianTypography({
    ...defaultContent,
    ...next,
    hero: { ...defaultContent.hero, ...next.hero },
    about: { ...defaultContent.about, ...next.about },
    team: {
      ...defaultContent.team,
      ...next.team,
      members: {
        ...defaultContent.team.members,
        ...(next.team?.members ?? {}),
      },
      memberOrder: next.team?.memberOrder ?? defaultContent.team.memberOrder,
    },
    cases: {
      ...defaultContent.cases,
      ...next.cases,
      tableLabels: {
        ...defaultContent.cases.tableLabels,
        ...(next.cases?.tableLabels ?? {}),
      },
      modalLabels: {
        ...defaultContent.cases.modalLabels,
        ...(next.cases?.modalLabels ?? {}),
      },
      items: {
        ...defaultContent.cases.items,
        ...(next.cases?.items ?? {}),
      },
      photos: {
        ...defaultContent.cases.photos,
        ...(next.cases?.photos ?? {}),
      },
      caseOrder: next.cases?.caseOrder ?? defaultContent.cases.caseOrder,
    },
    footer: { ...defaultContent.footer, ...next.footer },
  });
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const content = useMemo(() => applyRussianTypography(defaultContent), []);

  const value = useMemo(
    () => ({ content, loading: false, error: null }),
    [content],
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useSiteContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within ContentProvider");
  return ctx;
}
