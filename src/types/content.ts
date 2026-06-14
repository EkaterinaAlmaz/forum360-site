import type { Case, CaseId, CasePhoto } from "@/types/case";
import type { Member, MemberId } from "@/types/member";

export type HeroContent = {
  tagline: string;
  documentTitle: string;
  processTitle: string;
  processSteps: string[];
  metricLeftLabel: string;
  metricLeftValue: string;
  metricRightLabel: string;
  metricRightValue: string;
  contractTitle: string;
  contractStages: string[];
  contractStatus: string;
  lawLabel: string;
};

export type AboutContent = {
  sectionNumber: string;
  title: string;
  paragraphs: string[];
  ctaText: string;
  ctaHref: string;
  ctaIcon: string;
};

export type TeamContent = {
  sectionNumber: string;
  title: string;
  tagline: string;
  mobileHint: string;
  memberOrder: MemberId[];
  members: Record<MemberId, Member>;
};

export type CasesContent = {
  sectionNumber: string;
  title: string;
  allProjectsLabel: string;
  projectsModalTitle: string;
  tableLabels: {
    featuredAria: string;
    allAria: string;
    project: string;
    meta: string;
    eis: string;
  };
  modalLabels: {
    close: string;
    previousPhoto: string;
    nextPhoto: string;
    galleryHint: string;
    detailOpen: string;
    detailClose: string;
    openEis: string;
  };
  caseOrder: CaseId[];
  items: Record<CaseId, Case>;
  photos: Record<CaseId, CasePhoto[]>;
};

export type FooterContent = {
  brand: string;
  description: string;
  phone: string;
  email: string;
  systemHeading: string;
  legalName: string;
  inn: string;
  address: string;
  chartCaption: string;
  statusLabel: string;
  secureLabel: string;
};

export type SiteContent = {
  version: 1;
  updatedAt?: string;
  hero: HeroContent;
  about: AboutContent;
  team: TeamContent;
  cases: CasesContent;
  footer: FooterContent;
};
