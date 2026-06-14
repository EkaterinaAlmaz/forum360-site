export function CasesSectionDecor() {
  const stroke = "#eaeaea";

  return (
    <div className="cases-decor" aria-hidden="true">
      <svg className="cases-decor__svg cases-decor__tr" viewBox="0 0 240 260">
        <path
          d="M104 252 A150 150 0 0 1 236 36"
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          opacity="0.18"
        />
        <path
          d="M120 78H214V172"
          fill="none"
          stroke={stroke}
          strokeWidth="0.75"
          opacity="0.14"
        />
        <g fill={stroke} opacity="0.34">
          <circle cx="150" cy="28" r="1.5" />
          <circle cx="166" cy="28" r="1.5" />
          <circle cx="182" cy="28" r="1.5" />
          <circle cx="198" cy="28" r="1.5" />
          <circle cx="214" cy="28" r="1.5" />
          <circle cx="150" cy="44" r="1.5" />
          <circle cx="166" cy="44" r="1.5" />
          <circle cx="182" cy="44" r="1.5" />
          <circle cx="198" cy="44" r="1.5" />
          <circle cx="214" cy="44" r="1.5" />
          <circle cx="150" cy="60" r="1.5" />
          <circle cx="166" cy="60" r="1.5" />
          <circle cx="182" cy="60" r="1.5" />
          <circle cx="198" cy="60" r="1.5" />
          <circle cx="214" cy="60" r="1.5" />
        </g>
        <rect
          x="74"
          y="14"
          width="42"
          height="42"
          fill="none"
          stroke={stroke}
          strokeWidth="0.9"
          opacity="0.35"
        />
      </svg>
      <svg className="cases-decor__svg cases-decor__bl" viewBox="0 0 260 220">
        <path
          d="M12 206 A112 112 0 0 1 224 126"
          fill="none"
          stroke={stroke}
          strokeWidth="0.85"
          opacity="0.2"
        />
        <path
          d="M92 160H172V80"
          fill="none"
          stroke={stroke}
          strokeWidth="0.75"
          opacity="0.16"
        />
        <g fill={stroke} opacity="0.3">
          <circle cx="70" cy="166" r="1.5" />
          <circle cx="86" cy="166" r="1.5" />
          <circle cx="102" cy="166" r="1.5" />
          <circle cx="118" cy="166" r="1.5" />
          <circle cx="70" cy="182" r="1.5" />
          <circle cx="86" cy="182" r="1.5" />
          <circle cx="102" cy="182" r="1.5" />
          <circle cx="118" cy="182" r="1.5" />
        </g>
        <rect
          x="154"
          y="150"
          width="36"
          height="36"
          fill="none"
          stroke={stroke}
          strokeWidth="0.9"
          opacity="0.32"
        />
        <circle cx="154" cy="150" r="2.2" fill={stroke} opacity="0.72" />
      </svg>
      <svg className="cases-decor__svg cases-decor__br" viewBox="0 0 120 120">
        <path
          d="M8 72H72V8"
          fill="none"
          stroke={stroke}
          strokeWidth="0.75"
          opacity="0.15"
        />
        <rect
          x="64"
          y="34"
          width="36"
          height="36"
          fill="none"
          stroke={stroke}
          strokeWidth="0.9"
          opacity="0.34"
        />
        <g fill={stroke} opacity="0.34">
          <circle cx="18" cy="72" r="1.5" />
          <circle cx="34" cy="72" r="1.5" />
          <circle cx="50" cy="72" r="1.5" />
          <circle cx="66" cy="72" r="1.5" />
        </g>
        <circle cx="104" cy="72" r="2" fill={stroke} opacity="0.65" />
      </svg>
    </div>
  );
}
