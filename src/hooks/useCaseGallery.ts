import { useCallback, useEffect, useRef, useState } from "react";
import type { CaseId, CasePhoto } from "@/types/case";

const preloadCache = new Set<string>();

function preloadImage(url: string) {
  if (!url || preloadCache.has(url)) return;
  preloadCache.add(url);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
}

export function useCaseGallery(
  caseId: CaseId | null,
  title: string,
  photos: CasePhoto[] = [],
) {
  const [urls, setUrls] = useState<string[]>([]);
  const [alts, setAlts] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState("");
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!caseId) {
      setUrls([]);
      setAlts([]);
      setIndex(0);
      setSrc("");
      setLoading(false);
      return;
    }
    setUrls(photos.map((photo) => photo.src).filter(Boolean));
    setAlts(photos.map((photo) => photo.alt ?? ""));
    setIndex(0);
    requestIdRef.current += 1;
  }, [caseId, photos]);

  const updateView = useCallback(() => {
    const n = urls.length;
    if (n === 0) {
      setSrc("");
      setLoading(false);
      return;
    }

    const normalized = ((index % n) + n) % n;
    const url = urls[normalized];
    const requestId = ++requestIdRef.current;
    setLoading(true);

    const nextImage = new Image();
    nextImage.decoding = "async";
    nextImage.loading = "eager";
    nextImage.src = url;
    nextImage.onload = () => {
      if (requestId !== requestIdRef.current) return;
      setSrc(url);
      setLoading(false);
    };
    nextImage.onerror = () => {
      if (requestId !== requestIdRef.current) return;
      setSrc("");
      setLoading(false);
    };

    preloadImage(urls[(normalized + 1) % n]);
    preloadImage(urls[(normalized - 1 + n) % n]);
  }, [index, urls]);

  useEffect(() => {
    updateView();
  }, [updateView]);

  const step = useCallback(
    (delta: number) => {
      if (urls.length === 0) return;
      setIndex((i) => i + delta);
    },
    [urls.length],
  );

  const normalized =
    urls.length > 0 ? ((index % urls.length) + urls.length) % urls.length : 0;
  const alt =
    urls.length > 0
      ? alts[normalized] || `${title} — фото ${normalized + 1} из ${urls.length}`
      : "";
  const countLabel = urls.length > 0 ? `${normalized + 1} / ${urls.length}` : "";

  return { urls, index, step, loading, src, alt, countLabel };
}
