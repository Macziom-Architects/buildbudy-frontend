export const APPLIANCES_CATEGORIES = [
  {
    slug: "water-heaters",
    label: "Water Heaters",
    description: "Storage & instant geysers",
    icon: "🚿",
    iconBg: "#dbeafe",
    accentText: "#1e3a8a",
  },
  {
    slug: "air-conditioners",
    label: "Air Conditioners",
    description: "Split, window & portable ACs",
    icon: "❄️",
    iconBg: "#e0f2fe",
    accentText: "#075985",
  },
  {
    slug: "chimneys",
    label: "Kitchen Chimneys",
    description: "Auto-clean, filterless, wall-mount",
    icon: "🍳",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "generators",
    label: "Generators",
    description: "Petrol, diesel & inverter generators",
    icon: "⚡",
    iconBg: "#fef3c7",
    accentText: "#78350f",
  },
  {
    slug: "air-coolers",
    label: "Air Coolers",
    description: "Desert, tower & personal coolers",
    icon: "💨",
    iconBg: "#dbeafe",
    accentText: "#1e3a8a",
  },
  {
    slug: "pumps",
    label: "Water Pumps",
    description: "Centrifugal, submersible & booster",
    icon: "💧",
    iconBg: "#e0f2fe",
    accentText: "#075985",
  },
  {
    slug: "fans",
    label: "Fans",
    description: "Ceiling, exhaust & pedestal fans",
    icon: "🌀",
    iconBg: "#fefce8",
    accentText: "#713f12",
  },
  {
    slug: "kitchen",
    label: "Kitchen Appliances",
    description: "Mixer grinders, OTG & induction",
    icon: "🥘",
    iconBg: "#fef3c7",
    accentText: "#78350f",
  },
  {
    slug: "water-purifiers",
    label: "Water Purifiers",
    description: "RO, UV & copper purifiers",
    icon: "🫧",
    iconBg: "#e0f2fe",
    accentText: "#075985",
  },
  {
    slug: "industrial",
    label: "Industrial Appliances",
    description: "Compressors, welders & washers",
    icon: "🏭",
    iconBg: "#e8e8e8",
    accentText: "#2c3e50",
  },
];

export function getAppliancesCategoryBySlug(slug) {
  return APPLIANCES_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterAppliancesBySlug(products, slug) {
  switch (slug) {
    case "water-heaters":
      return products.filter((p) => p.category === "water-heater");
    case "air-conditioners":
      return products.filter((p) => p.category === "air-conditioner");
    case "chimneys":
      return products.filter((p) => p.category === "chimney");
    case "generators":
      return products.filter((p) => p.category === "generator");
    case "air-coolers":
      return products.filter((p) => p.category === "air-cooler");
    case "pumps":
      return products.filter((p) => p.category === "pump");
    case "fans":
      return products.filter(
        (p) => p.category === "ceiling-fan" || p.category === "electricals" && /fan/i.test(p.name)
      );
    case "kitchen":
      return products.filter((p) => p.category === "kitchen-appliance");
    case "water-purifiers":
      return products.filter((p) => p.category === "water-purifier");
    case "industrial":
      return products.filter((p) => p.category === "industrial-appliance");
    default:
      return products.filter((p) =>
        [
          "water-heater",
          "air-conditioner",
          "chimney",
          "generator",
          "air-cooler",
          "pump",
          "ceiling-fan",
          "kitchen-appliance",
          "water-purifier",
          "industrial-appliance",
        ].includes(p.category)
      );
  }
}
