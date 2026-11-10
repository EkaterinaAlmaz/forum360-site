"""Prepare the six supplied case studies locally; leave source files unchanged.

Run with Python and Pillow. Output assets are picked up by copy-public-assets.mjs.
"""

import hashlib
import html
import io
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
import zipfile

from PIL import Image, ImageCms, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "6 новых кейсов"
ASSETS = ROOT / "assets" / "cases"
PROJECTS = [
    ("rso", "1. Мост дружбы РСО", "Межрегиональный форум «Мосты дружбы РСО»",
     "ОБУ «Областной Дворец молодежи» · г. Курск"),
    ("lipetsk", "2. Казачий слет Липецк", "Всероссийский слёт казачьей молодёжи «Готов к труду и обороне»",
     "ФГБНУ «Институт изучения детства, семьи и воспитания» · Липецкая область"),
    ("yavdele", "3. Я в деле", "Региональный финал программы «Я в деле»",
     "ФГБОУ ДПО «Институт развития профессионального образования» · г. Москва"),
    ("mordovia", "4. Выездной лагерь Мордовия", "Выездной лагерь для работающей молодёжи «Смена 2.0»",
     "ГБУ «Мордовский республиканский молодёжный центр» · Республика Мордовия"),
    ("dobro", "5. Стажировка Краснодар", "Региональная стажировка команд «Добро.Центров»",
     "ГКУ Краснодарского края «Молодежный центр добровольчества (волонтерства)» · г. Краснодар"),
    ("surgut", "6. Семинар Сургут", "Школа общественного актива Сургутского района",
     "Администрация Сургутского района · г. Сургут"),
]


def read_copy(folder):
    docs = list(folder.glob("*.docx"))
    if len(docs) != 1:
        raise ValueError(f"Expected one description in {folder}")
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    with zipfile.ZipFile(docs[0]) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
    paragraphs = [
        "".join(t.text or "" for t in p.findall(".//w:t", ns)).strip()
        for p in document.findall(".//w:p", ns)
    ]
    paragraphs = [p for p in paragraphs if p]
    short = paragraphs.index("Краткое описание")
    detail = paragraphs.index("Подробное описание")
    links = [p[p.index("https://zakupki.gov.ru/"):].strip() for p in paragraphs
             if "https://zakupki.gov.ru/" in p]
    if len(links) != 1:
        raise ValueError(f"Expected one EIS URL in {docs[0]}")
    as_html = lambda rows: "".join(f"<p>{html.escape(p, quote=False)}</p>" for p in rows)
    return as_html(paragraphs[short + 1:detail]), as_html(paragraphs[detail + 1:]), links[0]


def prepare():
    cases = {}
    packs = {}
    report = []
    for case_id, folder_name, title, meta in PROJECTS:
        folder = SOURCE / folder_name
        body, detail, eis = read_copy(folder)
        cases[case_id] = {"title": title, "meta": meta, "body": body, "bodyDetail": detail, "eis": eis}
        destination = ASSETS / case_id
        destination.mkdir(parents=True, exist_ok=True)
        sources = sorted((folder / "Фотографии").iterdir(), key=lambda p: int(p.stem))
        filenames = []
        for index, source in enumerate(sources, 1):
            original = source.read_bytes()
            extension = ".jpg" if case_id == "surgut" else ".webp"
            target = destination / f"{index}{extension}"
            if case_id == "surgut":
                # These portrait JPEGs are already compact. Keep the exact original bytes.
                target.write_bytes(original)
            else:
                with Image.open(io.BytesIO(original)) as opened:
                    icc = opened.info.get("icc_profile")
                    image = ImageOps.exif_transpose(opened).convert("RGB")
                    if icc:
                        profile = ImageCms.ImageCmsProfile(io.BytesIO(icc))
                        if "srgb" not in ImageCms.getProfileDescription(profile).lower():
                            image = ImageCms.profileToProfile(image, profile, ImageCms.createProfile("sRGB"), outputMode="RGB")
                    image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
                    image.save(target, "WEBP", quality=82, method=4)
            with Image.open(target) as checked:
                checked.load()
                dimensions = checked.size
            filenames.append(target.name)
            report.append({"case": case_id, "source": str(source.relative_to(ROOT)),
                           "source_sha256": hashlib.sha256(original).hexdigest(),
                           "original_bytes": len(original), "output_bytes": target.stat().st_size,
                           "dimensions": dimensions, "output": str(target.relative_to(ROOT))})
        packs[case_id] = {"folder": case_id, "files": filenames}
        print(f"{case_id}: {len(filenames)} photos prepared", flush=True)
    serialize = lambda value: json.dumps(value, ensure_ascii=False, indent=2)
    generated = (
        '// Prepared from the supplied Word descriptions by scripts/prepare-new-cases.py.\n'
        'import type { Case, CaseId, CasePhotoPack } from "@/types/case";\n\n'
        f'export const newCases: Record<CaseId, Case> = {serialize(cases)};\n\n'
        f'export const newCasePhotos: Record<CaseId, CasePhotoPack> = {serialize(packs)};\n'
    )
    (ROOT / "src" / "data" / "newCases.ts").write_text(generated, encoding="utf-8")
    report_path = ROOT / "test-results" / "case-assessment" / "prepared-assets.json"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(serialize(report), encoding="utf-8")
    print(f"Total: {sum(p['original_bytes'] for p in report):,} -> {sum(p['output_bytes'] for p in report):,} bytes", flush=True)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    prepare()
