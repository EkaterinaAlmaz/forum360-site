/**
 * Builds assets/logo.svg from Лого-07.svg.
 * White underlay clipped to plaque trapezoid (no white triangle at the slant).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "Лого-07.svg");
const destPath = path.join(root, "assets/logo.svg");

const src = fs.readFileSync(sourcePath, "utf8");

const st2Match = src.match(/<path class="st2" d="([\s\S]*?)"/);
const g360Match = src.match(/<g>\s*<g>([\s\S]*?)<\/g>\s*<\/g>\s*<\/g>/);

if (!st2Match) {
  console.error("st2 path not found in Лого-07.svg");
  process.exit(1);
}

const plaqueD = "M840,419.59H1.38v160.81h868.47L840,419.59z";

function splitSubpaths(d) {
  return d
    .split(/(?=M)/i)
    .map((p) => p.trim())
    .filter(Boolean);
}

function dedupeSubpaths(parts) {
  const seen = new Set();
  return parts.filter((p) => {
    if (seen.has(p)) return false;
    seen.add(p);
    return true;
  });
}

const fullD = dedupeSubpaths(
  splitSubpaths(st2Match[1].replace(/\s+/g, " ").trim())
).join(" ");

const g360 = g360Match ? g360Match[1].trim() : "";

const VB_W = 911;
const VB_H = 160.81;

const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" preserveAspectRatio="xMinYMin meet" aria-hidden="true">
  <defs>
    <clipPath id="logo-plaque">
      <path d="${plaqueD}"/>
    </clipPath>
  </defs>
  <g transform="translate(-1.38, -419.59)">
    <rect fill="#FFFFFF" clip-path="url(#logo-plaque)" x="1.38" y="419.59" width="868.47" height="160.81"/>
    <path fill="#6D0C32" fill-rule="nonzero" d="${fullD}"/>
    <g fill="#222426">
${g360}
    </g>
  </g>
</svg>
`;

fs.writeFileSync(destPath, svg);
console.log("assets/logo.svg <= Лого-07.svg");
