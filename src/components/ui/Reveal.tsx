import type { ReactNode } from "react";
import { useInViewReveal } from "@/hooks/useInViewReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "footer";
};

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const [ref, visible] = useInViewReveal<HTMLDivElement>();
  const classes = ["reveal", visible ? "is-visible" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={classes}>
      {children}
    </Tag>
  );
}
