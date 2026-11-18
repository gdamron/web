// Arrow marks for links, drawn as strokes so their weight matches the
// semibold labels they follow (the font's own arrow glyphs are hairlines).
const shared = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Follows a link that leads further into the site.
export const LinkArrow = () => (
  <svg {...shared} className="link-arrow">
    <path d="M2 8h12M9 3l5 5-5 5" />
  </svg>
);

// Follows a link that opens another site.
export const ExternalArrow = ({ className = "" }: { className?: string }) => (
  <svg {...shared} className={`ext-arrow ${className}`}>
    <path d="M4 12l8-8M5.5 4H12v6.5" />
  </svg>
);
