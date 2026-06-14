export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function descToHtml(text: string): string {
  return text
    .split("\n\n")
    .map((p) => {
      const chunk = p.trim();
      if (!chunk) return "";

      if (
        /^(Ключевые задачи|Проекты и заказчики|Среди заказчиков)$/i.test(
          chunk,
        )
      ) {
        return `<div class="tooltip-kicker">${escapeHtml(chunk)}</div>`;
      }

      const lines = chunk
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      const isList =
        lines.length > 1 &&
        lines.every((l) => l.startsWith("• ") || l.startsWith("- "));

      if (isList) {
        return (
          '<ul class="tooltip-list">' +
          lines
            .map((l) => {
              const item = l.slice(1).trim();
              return `<li>${escapeHtml(item)}</li>`;
            })
            .join("") +
          "</ul>"
        );
      }

      return `<p>${escapeHtml(chunk.replace(/\n/g, " "))}</p>`;
    })
    .join("");
}

export function experienceToHtml(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text
    .split(/\n\n+/)
    .map((block) => {
      const b = block.trim();
      if (!b) return "";

      const lines = b
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      if (
        lines.length >= 2 &&
        lines.every((l) => /^[-–—]/.test(l))
      ) {
        return (
          '<ul class="tooltip-list">' +
          lines
            .map((l) => {
              const item = l.replace(/^[-–—]\s*/, "").trim();
              return `<li>${escapeHtml(item)}</li>`;
            })
            .join("") +
          "</ul>"
        );
      }

      if (
        lines.length === 1 &&
        /:$/.test(lines[0]) &&
        !/^[-–—]/.test(lines[0])
      ) {
        return `<div class="tooltip-kicker">${escapeHtml(lines[0])}</div>`;
      }

      const body = lines.join("\n");
      return `<p>${escapeHtml(body).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
}
