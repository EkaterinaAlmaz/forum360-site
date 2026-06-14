import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 0.14;

export function useInViewReveal<T extends HTMLElement>(
  threshold = DEFAULT_THRESHOLD,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, visible];
}
