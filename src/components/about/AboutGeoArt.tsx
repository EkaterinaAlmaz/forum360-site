export function AboutGeoArt() {
  const stroke = "#eaeaea";

  return (
    <svg
      className="about-geo"
      viewBox="0 0 480 480"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="480" height="480" fill="transparent" />
      <g className="about-geo__layer about-geo__layer--plate">
        <rect x="206" y="36" width="96" height="408" fill={stroke} opacity="0.018" />
        <rect x="220" y="62" width="70" height="356" fill={stroke} opacity="0.022" />
      </g>
      <g className="about-geo__layer about-geo__layer--lines" stroke={stroke} strokeLinecap="round">
        <line x1="252" y1="246" x2="98" y2="62" strokeWidth="1.15" opacity="0.78" />
        <line x1="252" y1="246" x2="122" y2="394" strokeWidth="0.9" opacity="0.34" />
        <line x1="252" y1="246" x2="404" y2="94" strokeWidth="0.75" opacity="0.2" />
        <line x1="252" y1="246" x2="392" y2="320" strokeWidth="0.75" opacity="0.2" />
        <line x1="252" y1="246" x2="318" y2="416" strokeWidth="0.75" opacity="0.26" />
        <line x1="252" y1="246" x2="70" y2="374" strokeWidth="0.75" opacity="0.18" />
      </g>
      <g className="about-geo__layer about-geo__layer--ring">
        <circle
          cx="240"
          cy="240"
          r="126"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          strokeDasharray="2 7"
          opacity="0.32"
        />
        <circle
          cx="132"
          cy="232"
          r="88"
          fill="none"
          stroke={stroke}
          strokeWidth="0.75"
          opacity="0.22"
        />
      </g>
      <g className="about-geo__layer about-geo__layer--corner about-geo__layer--corner-tr">
        <rect
          x="348"
          y="48"
          width="44"
          height="44"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.5"
        />
      </g>
      <g className="about-geo__layer about-geo__layer--corner about-geo__layer--corner-bl">
        <rect
          x="88"
          y="388"
          width="44"
          height="44"
          fill="none"
          stroke={stroke}
          strokeWidth="1"
          opacity="0.5"
        />
      </g>
      <g
        className="about-geo__layer about-geo__layer--dots about-geo__layer--dots-tr"
        fill={stroke}
      >
        <circle cx="318" cy="108" r="1.5" />
        <circle cx="330" cy="108" r="1.5" />
        <circle cx="342" cy="108" r="1.5" />
        <circle cx="318" cy="120" r="1.5" />
        <circle cx="330" cy="120" r="1.5" />
        <circle cx="342" cy="120" r="1.5" />
        <circle cx="318" cy="132" r="1.5" />
        <circle cx="330" cy="132" r="1.5" />
        <circle cx="342" cy="132" r="1.5" />
      </g>
      <g
        className="about-geo__layer about-geo__layer--dots about-geo__layer--dots-bl"
        fill={stroke}
      >
        <circle cx="118" cy="348" r="1.5" />
        <circle cx="130" cy="348" r="1.5" />
        <circle cx="142" cy="348" r="1.5" />
        <circle cx="118" cy="360" r="1.5" />
        <circle cx="130" cy="360" r="1.5" />
        <circle cx="142" cy="360" r="1.5" />
        <circle cx="118" cy="372" r="1.5" />
        <circle cx="130" cy="372" r="1.5" />
        <circle cx="142" cy="372" r="1.5" />
      </g>
      <g className="about-geo__layer about-geo__layer--core">
        <circle cx="252" cy="246" r="4.5" fill={stroke} opacity="0.88" />
        <circle cx="252" cy="246" r="11" fill="none" stroke={stroke} strokeWidth="1" opacity="0.34" />
        <circle cx="108" cy="246" r="5" fill={stroke} opacity="0.86" />
      </g>
    </svg>
  );
}
