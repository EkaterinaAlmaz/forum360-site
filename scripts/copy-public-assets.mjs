import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function replaceDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  copyDir(src, dest);
}

function isNewer(src, dest) {
  if (!fs.existsSync(dest)) return true;
  try {
    return fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;
  } catch {
    return true;
  }
}

const force = process.argv.includes("--force");

function shouldCopyAssets() {
  if (force || process.env.FORCE_COPY_ASSETS === "1") return true;
  const probeSrc = path.join(root, "assets/logo.svg");
  const probeDest = path.join(root, "public/assets/logo.svg");
  return isNewer(probeSrc, probeDest);
}

const mappings = [
  ["assets", "public/assets", "merge"],
  ["Фото для кейсов/4 семинара", "public/assets/cases/seminars-4", "replace"],
  ["Фото для кейсов/2 семинара", "public/assets/cases/seminars-2", "replace"],
  ["Фото для кейсов/Туризм", "public/assets/cases/tourism", "replace"],
  ["Фото для кейсов/Молодой город", "public/assets/cases/molodoy-city", "replace"],
  ["Элементы круга/png", "public/assets/team/photos", "merge"],
];

const fileCopies = [
  ["znachok-02.svg", "public/favicon.svg"],
  ["znachok_4x.png", "public/favicon.png"],
];

if (!shouldCopyAssets()) {
  console.log("assets up to date — skip copy (set FORCE_COPY_ASSETS=1 to refresh)");
} else {
  for (const [srcRel, destRel, mode] of mappings) {
    const src = path.join(root, srcRel);
    const dest = path.join(root, destRel);
    if (!fs.existsSync(src)) {
      console.warn("skip (missing):", srcRel);
      continue;
    }
    if (mode === "replace") replaceDir(src, dest);
    else copyDir(src, dest);
    console.log("copied:", srcRel, "->", destRel);
  }

  for (const [srcRel, destRel] of fileCopies) {
    const src = path.join(root, srcRel);
    const dest = path.join(root, destRel);
    if (!fs.existsSync(src)) {
      console.warn("skip (missing):", srcRel);
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    console.log("copied:", srcRel, "->", destRel);
  }
}

if (fs.existsSync(path.join(root, "nojekyll"))) {
  fs.copyFileSync(path.join(root, "nojekyll"), path.join(root, "public/nojekyll"));
}
