export const LIGHTING_CATEGORIES = [
  {
    slug: "ceiling-lights",
    label: "Ceiling Lights",
    description: "Flush mounts, chandeliers & fans",
    icon: "💡",
    iconBg: "#fef9c3",
    accentText: "#713f12",
  },
  {
    slug: "led-bulbs",
    label: "LED Bulbs",
    description: "B22, E27 & CFL replacements",
    icon: "🔆",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "panel-lights",
    label: "Panel & Downlights",
    description: "Recessed, surface & slim panels",
    icon: "⬜",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "outdoor",
    label: "Outdoor Lighting",
    description: "Floodlights, wall packs & streetlights",
    icon: "🔦",
    iconBg: "#eff6ff",
    accentText: "#1e40af",
  },
  {
    slug: "smart-lights",
    label: "Smart Lights",
    description: "Wi-Fi, Alexa & Google Home",
    icon: "📱",
    iconBg: "#f0fdf4",
    accentText: "#065f46",
  },
  {
    slug: "decorative",
    label: "Decorative Lamps",
    description: "Table lamps, floor lamps & pendants",
    icon: "🕯️",
    iconBg: "#fdf2e9",
    accentText: "#9a3412",
  },
  {
    slug: "strip-lights",
    label: "Strip & Rope Lights",
    description: "RGB, warm white & waterproof strips",
    icon: "〰️",
    iconBg: "#fae8ff",
    accentText: "#86198f",
  },
  {
    slug: "industrial",
    label: "Industrial Lighting",
    description: "High-bay, UFO & work lights",
    icon: "🏭",
    iconBg: "#e2e8f0",
    accentText: "#334155",
  },
];

export function getLightingCategoryBySlug(slug) {
  return LIGHTING_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterLightingBySlug(products, slug) {
  const lighting = products.filter(
    (p) => p.category === "lighting" || p.category === "electricals"
  );
  switch (slug) {
    case "ceiling-lights":
      return lighting.filter((p) =>
        /ceiling|chandelier|fan light|flush mount/i.test(p.name)
      );
    case "led-bulbs":
      return lighting.filter((p) =>
        /led|bulb|lamp|cfl|tube light|batten/i.test(p.name)
      );
    case "panel-lights":
      return lighting.filter((p) =>
        /panel|downlight|recessed|slim|surface mount/i.test(p.name)
      );
    case "outdoor":
      return lighting.filter((p) =>
        /outdoor|flood|wall pack|street|garden light|post/i.test(p.name)
      );
    case "smart-lights":
      return lighting.filter((p) =>
        /smart|wifi|alexa|google|rgb|colour changing/i.test(p.name)
      );
    case "decorative":
      return lighting.filter((p) =>
        /table lamp|floor lamp|pendant|chandelier|lantern|decor/i.test(p.name)
      );
    case "strip-lights":
      return lighting.filter((p) =>
        /strip|rope|ribbon|neon flex|led tape/i.test(p.name)
      );
    case "industrial":
      return lighting.filter((p) =>
        /high.bay|ufo|high bay|work light|industrial|warehouse/i.test(p.name)
      );
    default:
      return lighting;
  }
}
