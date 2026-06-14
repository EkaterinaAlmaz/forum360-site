const NBSP = "\u00a0";

const SHORT_WORDS = [
  "а",
  "в",
  "во",
  "и",
  "к",
  "ко",
  "о",
  "об",
  "обо",
  "от",
  "до",
  "из",
  "за",
  "на",
  "по",
  "с",
  "со",
  "у",
  "но",
  "не",
  "ни",
  "же",
  "ли",
  "бы",
  "для",
  "при",
  "над",
  "под",
  "без",
  "мы",
].sort((a, b) => b.length - a.length);

const SHORT_WORD_PATTERN = new RegExp(
  `(^|[\\s(\\[\\{«"“„'’—–-])(${SHORT_WORDS.join("|")})([ \\t\\r\\n]+)(?=[\\p{L}\\p{N}«"“„])`,
  "giu",
);

const ABBREVIATION_REPLACEMENTS: Array<[RegExp, string]> = [
  [/(?<!\p{L})г\.[ \t]+(?=\p{L})/giu, `г.${NBSP}`],
  [/(?<!\p{L})ул\.[ \t]+(?=\p{L})/giu, `ул.${NBSP}`],
  [/(?<!\p{L})д\.[ \t]+(?=\d)/giu, `д.${NBSP}`],
  [/(?<!\p{L})помещ\.[ \t]+(?=\d)/giu, `помещ.${NBSP}`],
];

const PHRASE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/ООО[ \t\u00a0]+«Форум[ \t\u00a0]+360»/g, `ООО${NBSP}«Форум${NBSP}360»`],
  [/Форум[ \t\u00a0]+360/g, `Форум${NBSP}360`],
  [/по[ \t\u00a0]+всей[ \t]+России/giu, `по${NBSP}всей${NBSP}России`],
  [/в[ \t\u00a0]+рамках[ \t]+44-ФЗ/giu, `в${NBSP}рамках${NBSP}44-ФЗ`],
  [/на[ \t\u00a0]+800\+[ \t]+человек/giu, `на${NBSP}800+${NBSP}человек`],
  [/Радиславом[ \t]+Гандапасом/g, `Радиславом${NBSP}Гандапасом`],
  [/Алексеем[ \t]+Ситниковым/g, `Алексеем${NBSP}Ситниковым`],
  [/Владимиром[ \t]+Якубой/g, `Владимиром${NBSP}Якубой`],
  [/Игорем[ \t]+Рызовым/g, `Игорем${NBSP}Рызовым`],
];

function applyTypographyToString(value: string): string {
  let next = value.replace(/[ \t\u00a0]+—[ \t]+/g, `${NBSP}—${NBSP}`);

  for (const [pattern, replacement] of ABBREVIATION_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }

  for (const [pattern, replacement] of PHRASE_REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }

  for (let i = 0; i < 6; i += 1) {
    const current = next.replace(SHORT_WORD_PATTERN, `$1$2${NBSP}`);
    if (current === next) break;
    next = current;
  }

  return next;
}

export function applyRussianTypography<T>(value: T): T {
  if (typeof value === "string") return applyTypographyToString(value) as T;

  if (Array.isArray(value)) {
    return value.map((item) => applyRussianTypography(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, applyRussianTypography(item)]),
    ) as T;
  }

  return value;
}
