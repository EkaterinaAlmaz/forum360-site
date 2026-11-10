// Prepared by scripts/prepare-letters.py. Add future letters here and in its source list.
import type { ThankYouLetter } from "@/types/letter";

export const letters: ThankYouLetter[] = [
  {
    "id": "mordovia",
    "title": "Выездной лагерь «Смена 2.0»",
    "sender": "Мордовский республиканский молодёжный центр",
    "preview": "assets/letters/mordovia-preview.webp",
    "image": "assets/letters/mordovia-full.webp",
    "original": "assets/letters/mordovia.pdf",
    "width": 1863,
    "height": 2560
  },
  {
    "id": "molodoy",
    "title": "Форум «Молодой город»",
    "sender": "Областной молодёжный центр Калужской области",
    "preview": "assets/letters/molodoy-preview.webp",
    "image": "assets/letters/molodoy.webp",
    "original": "assets/letters/molodoy.webp",
    "width": 2339,
    "height": 1653
  },
  {
    "id": "surgut",
    "title": "Школа общественного актива Сургутского района",
    "sender": "Администрация Сургутского района",
    "preview": "assets/letters/surgut-preview.webp",
    "image": "assets/letters/surgut-full.webp",
    "original": "assets/letters/surgut.pdf",
    "width": 1811,
    "height": 2560
  }
];
