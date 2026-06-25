export const PAINT_CATEGORIES = [
  {
    slug: "interior",
    label: "Interior Paint",
    description: "Emulsions, distempers & eggshell",
    icon: "🏠",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "exterior",
    label: "Exterior Paint",
    description: "Weather-shield & textured finishes",
    icon: "🌧️",
    iconBg: "#dbeafe",
    accentText: "#1e40af",
  },
  {
    slug: "spray-paints",
    label: "Spray Paints",
    description: "Aerosol & industrial spray finishes",
    icon: "💨",
    iconBg: "#f0fdf4",
    accentText: "#166534",
  },
  {
    slug: "waterproofing",
    label: "Waterproofing",
    description: "Dr. Fixit, crack fillers & roof coatings",
    icon: "💧",
    iconBg: "#ecfeff",
    accentText: "#155e75",
  },
  {
    slug: "wood-finishes",
    label: "Wood Finishes",
    description: "PU coatings, varnish & wood stains",
    icon: "🪵",
    iconBg: "#fdf2e9",
    accentText: "#92400e",
  },
  {
    slug: "thinners-solvents",
    label: "Thinners & Solvents",
    description: "Acetone, thinner & paint reducers",
    icon: "🧪",
    iconBg: "#e8f8f5",
    accentText: "#0e6655",
  },
  {
    slug: "tools-accessories",
    label: "Brushes & Rollers",
    description: "Paint brushes, rollers & sanding sheets",
    icon: "🖌️",
    iconBg: "#fff7ed",
    accentText: "#c2410c",
  },
  {
    slug: "all-paint",
    label: "All Paint",
    description: "Browse the full paint range",
    icon: "🎨",
    iconBg: "#fce7f3",
    accentText: "#9d174d",
  },
];

export function getPaintCategoryBySlug(slug) {
  return PAINT_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterPaintBySlug(products, slug) {
  const paint = products.filter((p) => p.routeCategory === "paint");
  switch (slug) {
    case "interior":
      return paint.filter(
        (p) =>
          p.category === "interior-paints" ||
          /interior|emulsion|distemper|plastic paint|eggshell|royale|tractor/i.test(p.name)
      );
    case "exterior":
      return paint.filter(
        (p) =>
          p.category === "exterior-paints" ||
          /exterior|weather|apex|acrylic|facade/i.test(p.name)
      );
    case "spray-paints":
      return paint.filter(
        (p) =>
          p.category === "spray-paints" ||
          /spray paint|aerosol/i.test(p.name)
      );
    case "waterproofing":
      return products.filter(
        (p) =>
          p.category === "waterproofing-crack-fillers" ||
          p.category === "water-proofing" ||
          /waterproof|dr.*fixit|crack filler|repair pro/i.test(p.name)
      );
    case "wood-finishes":
      return paint.filter(
        (p) =>
          p.category === "polish-varnish" ||
          /wood|varnish|stain|polish|lacquer|teak|PU|pu coat/i.test(p.name)
      );
    case "thinners-solvents":
      return paint.filter(
        (p) => /thinner|solvent|acetone|reducer|mineral turpentine/i.test(p.name)
      );
    case "tools-accessories":
      return paint.filter(
        (p) =>
          p.category === "painting-tools" ||
          p.category === "paint-tools" ||
          /brush|roller|tray|paint.*pad|sanding|sand.*sheet|masking tape|scraper/i.test(p.name)
      );
    case "all-paint":
    default:
      return paint;
  }
}
