import type { CaseId, CasePhotoPack } from "@/types/case";

const numbered = (count: number) =>
  Array.from({ length: count }, (_, i) => `${i + 1}.webp`);

export const CASE_PHOTOS: Record<CaseId, CasePhotoPack> = {
  seminars4: {
    folder: "seminars-4",
    files: numbered(20),
  },
  seminars2: {
    folder: "seminars-2",
    files: numbered(20),
  },
  tourism: {
    folder: "tourism",
    files: numbered(25),
  },
  molodoy: {
    folder: "molodoy-city",
    files: numbered(28),
  },
};
