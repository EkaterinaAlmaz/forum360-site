"""Prepare letter previews without changing the supplied originals."""

import json
from pathlib import Path
import shutil
import sys

from PIL import Image, ImageOps
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "letters"
SOURCES = [
    ("mordovia", "Выездной лагерь «Смена 2.0»",
     "Мордовский республиканский молодёжный центр",
     ROOT / "6 новых кейсов/Благодарственные письма добавить/письмо Мордовия.pdf"),
    ("molodoy", "Форум «Молодой город»",
     "Областной молодёжный центр Калужской области",
     ROOT / "Фото для кейсов/Молодой город/2.webp"),
    ("surgut", "Школа общественного актива Сургутского района",
     "Администрация Сургутского района",
     ROOT / "6 новых кейсов/Благодарственные письма добавить/Благодарность Сургут.pdf"),
]


def prepare():
    OUT.mkdir(parents=True, exist_ok=True)
    letters = []
    for letter_id, title, sender, source in SOURCES:
        original_name = f"{letter_id}{source.suffix}"
        shutil.copyfile(source, OUT / original_name)
        if source.suffix == ".pdf":
            pdf = pdfium.PdfDocument(str(source))
            if len(pdf) != 1:
                raise ValueError(f"Expected one page: {source}")
            page = pdf[0]
            width, height = page.get_size()
            image = page.render(scale=2560 / max(width, height)).to_pil().convert("RGB")
            page.close()
            pdf.close()
            image_name = f"{letter_id}-full.webp"
            image.save(OUT / image_name, "WEBP", quality=94, method=6)
        else:
            image = Image.open(source).convert("RGB")
            image_name = original_name
        preview = ImageOps.contain(image, (900, 1000), Image.Resampling.LANCZOS)
        preview_name = f"{letter_id}-preview.webp"
        preview.save(OUT / preview_name, "WEBP", quality=88, method=6)
        letters.append({"id": letter_id, "title": title, "sender": sender,
                        "preview": f"assets/letters/{preview_name}",
                        "image": f"assets/letters/{image_name}",
                        "original": f"assets/letters/{original_name}",
                        "width": image.width, "height": image.height})
        print(f"{letter_id}: {image.width}x{image.height}, original preserved", flush=True)
    data = ('// Prepared by scripts/prepare-letters.py. Add future letters here and in its source list.\n'
            'import type { ThankYouLetter } from "@/types/letter";\n\n'
            f'export const letters: ThankYouLetter[] = {json.dumps(letters, ensure_ascii=False, indent=2)};\n')
    (ROOT / "src/data/letters.ts").write_text(data, encoding="utf-8")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    prepare()
