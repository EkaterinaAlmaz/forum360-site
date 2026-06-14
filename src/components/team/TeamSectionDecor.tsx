export function TeamSectionDecor() {
  const stroke = "#222426";

  return (
    <div className="team-decor" aria-hidden="true">
      <svg className="team-decor__svg team-decor__tl" viewBox="0 0 220 220">
        <path
          d="M0 112H112V220"
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.16"
        />
        <rect
          x="72"
          y="112"
          width="96"
          height="96"
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.18"
        />
        <g fill={stroke} opacity="0.18">
          <circle cx="88" cy="144" r="1.5" />
          <circle cx="100" cy="144" r="1.5" />
          <circle cx="112" cy="144" r="1.5" />
          <circle cx="124" cy="144" r="1.5" />
          <circle cx="88" cy="156" r="1.5" />
          <circle cx="100" cy="156" r="1.5" />
          <circle cx="112" cy="156" r="1.5" />
          <circle cx="124" cy="156" r="1.5" />
          <circle cx="88" cy="168" r="1.5" />
          <circle cx="100" cy="168" r="1.5" />
          <circle cx="112" cy="168" r="1.5" />
          <circle cx="124" cy="168" r="1.5" />
        </g>
        <circle cx="156" cy="144" r="3" fill={stroke} opacity="0.72" />
      </svg>
      <svg className="team-decor__svg team-decor__tr" viewBox="0 0 120 120">
        <rect
          x="20"
          y="20"
          width="44"
          height="44"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.35"
        />
        <g fill={stroke} opacity="0.25">
          <circle cx="78" cy="32" r="1.5" />
          <circle cx="88" cy="32" r="1.5" />
          <circle cx="98" cy="32" r="1.5" />
          <circle cx="78" cy="42" r="1.5" />
          <circle cx="88" cy="42" r="1.5" />
          <circle cx="98" cy="42" r="1.5" />
        </g>
        <path
          d="M10 100 Q60 20 110 60"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.2"
        />
        <circle cx="60" cy="48" r="2" fill={stroke} opacity="0.5" />
      </svg>
      <svg className="team-decor__svg team-decor__bl" viewBox="0 0 120 120">
        <rect
          x="24"
          y="56"
          width="40"
          height="40"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.3"
        />
        <g fill={stroke} opacity="0.3">
          <circle cx="36" cy="68" r="1.5" />
          <circle cx="46" cy="68" r="1.5" />
          <circle cx="56" cy="68" r="1.5" />
          <circle cx="36" cy="78" r="1.5" />
          <circle cx="46" cy="78" r="1.5" opacity="0.9" />
          <circle cx="56" cy="78" r="1.5" />
        </g>
      </svg>
      <svg className="team-decor__svg team-decor__br" viewBox="0 0 80 40">
        <rect
          x="4"
          y="8"
          width="28"
          height="28"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.3"
        />
        <g fill={stroke} opacity="0.35">
          <circle cx="48" cy="22" r="1.5" />
          <circle cx="58" cy="22" r="1.5" />
          <circle cx="68" cy="22" r="1.5" />
          <circle cx="78" cy="22" r="1.5" />
        </g>
      </svg>
    </div>
  );
}
