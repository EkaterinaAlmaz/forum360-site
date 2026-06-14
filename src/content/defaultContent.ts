import { CASE_PHOTOS } from "@/data/casePhotos";
import { CASE_ORDER, cases } from "@/data/cases";
import { MEMBER_ORDER, members } from "@/data/members";
import type { CaseId, CasePhoto } from "@/types/case";
import type { SiteContent } from "@/types/content";

const PHOTO_VERSION = "20260613";

function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\//, "")}`;
}

function buildStaticPhotos(caseId: CaseId): CasePhoto[] {
  const pack = CASE_PHOTOS[caseId];
  if (!pack) return [];
  return pack.files.map((file, index) => ({
    id: `${caseId}-${index + 1}`,
    src: `${withBase(`assets/cases/${pack.folder}/${file}`)}?v=${PHOTO_VERSION}`,
    alt: `${cases[caseId]?.title ?? caseId} — фото ${index + 1}`,
  }));
}

export const defaultContent: SiteContent = {
  version: 1,
  hero: {
    tagline: "Организация мероприятий по всей России в рамках 44-ФЗ",
    documentTitle: "Документация",
    processTitle: "Этапы проекта",
    processSteps: ["Подписание контракта", "Реализация", "Загрузка УПД"],
    metricLeftLabel: "Закрыто",
    metricLeftValue: "128",
    metricRightLabel: "В работе",
    metricRightValue: "23",
    contractTitle: "Исполнение контракта",
    contractStages: ["Поставка", "Отчётность", "Закрытие"],
    contractStatus: "В работе",
    lawLabel: "44-ФЗ",
  },
  about: {
    sectionNumber: "01",
    title: "О компании",
    paragraphs: [
      "Форум 360 — это молодая, но уже зарекомендовавшая себя команда профессионалов с 6-летним стажем в области государственных закупок. Мы не просто организовываем мероприятия по техническому заданию — мы активно прислушиваемся к пожеланиям заказчика и стремимся сделать всё возможное, чтобы заказчик остался полностью удовлетворён результатом.",
      "Кураторы проектов имеют опыт работы в организации форумов на 800+ человек с топовыми спикерами: Радиславом Гандапасом, Алексеем Ситниковым, Владимиром Якубой, Игорем Рызовым. Мы выигрываем тендеры по всей России. В каждом городе у нас есть свои представители, и мы лично приезжаем на мероприятие.",
    ],
    ctaText: "Перейти к нашим проектам",
    ctaHref: "#cases",
    ctaIcon: "↗",
  },
  team: {
    sectionNumber: "02",
    title: "Руководящий состав",
    tagline:
      "Специалисты, которые знают: чтобы качественно работать, нужно качественно отдыхать.",
    mobileHint:
      "Нажмите на сектор круга — карточка закрепится ниже",
    memberOrder: MEMBER_ORDER,
    members,
  },
  cases: {
    sectionNumber: "03",
    title: "Кейсы и портфолио",
    allProjectsLabel: "Все проекты",
    projectsModalTitle: "Все проекты",
    tableLabels: {
      featuredAria: "Реализованные контракты",
      allAria: "Все реализованные контракты",
      project: "Проект",
      meta: "Локация / заказчик",
      eis: "ЕИС",
    },
    modalLabels: {
      close: "Закрыть",
      previousPhoto: "Предыдущее фото",
      nextPhoto: "Следующее фото",
      galleryHint: "← → · свайп",
      detailOpen: "Подробнее о проекте",
      detailClose: "Краткое описание",
      openEis: "Открыть в ЕИС",
    },
    caseOrder: CASE_ORDER,
    items: cases,
    photos: CASE_ORDER.reduce<Record<CaseId, CasePhoto[]>>((acc, caseId) => {
      acc[caseId] = buildStaticPhotos(caseId);
      return acc;
    }, {}),
  },
  footer: {
    brand: "ФОРУМ 360",
    description: "Организация мероприятий по всей России в рамках 44-ФЗ",
    phone: "+7 918 086 86 00",
    email: "forum.360@yandex.ru",
    systemHeading: "// SYSTEM.INFO",
    legalName: "ООО «Форум 360»",
    inn: "ИНН 2310241828",
    address:
      "350002, Краснодарский край, г. Краснодар, ул. Северная, д. 490, помещ. 12/1",
    chartCaption: "METRICS / DELIVERY",
    statusLabel: "SYSTEM STATUS: ONLINE",
    secureLabel: "SECURE CONNECTION",
  },
};
