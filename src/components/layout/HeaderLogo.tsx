import type { MouseEvent } from "react";
import { assetUrl } from "@/lib/assetUrl";
import logoUrl from "../../../assets/logo.svg?url";

type HeaderLogoProps = {
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function HeaderLogo({ onClick }: HeaderLogoProps) {
  return (
    <a
      className="logo-link"
      href="#hero"
      aria-label="На главную"
      onClick={onClick}
    >
      <img
        src={logoUrl || assetUrl("assets/logo.svg")}
        alt="ФОРУМ 360"
        className="logo-img"
        decoding="async"
      />
    </a>
  );
}
