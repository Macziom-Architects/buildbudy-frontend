export const GARDEN_CATEGORIES = [
  {
    slug: "plants-seeds",
    label: "Plants & Seeds",
    description: "Indoor, outdoor & vegetable seeds",
    icon: "🌱",
    iconBg: "#dcfce7",
    accentText: "#14532d",
  },
  {
    slug: "pots-planters",
    label: "Pots & Planters",
    description: "Ceramic, terracotta & hanging pots",
    icon: "🪴",
    iconBg: "#fdf2e9",
    accentText: "#9a3412",
  },
  {
    slug: "garden-tools",
    label: "Garden Tools",
    description: "Spades, rakes, pruners & hoes",
    icon: "⛏️",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "irrigation",
    label: "Irrigation & Watering",
    description: "Drip kits, hose pipes & sprinklers",
    icon: "💦",
    iconBg: "#eff6ff",
    accentText: "#1e40af",
  },
  {
    slug: "fertilizers",
    label: "Fertilizers & Soil",
    description: "Compost, cocopeat & liquid nutrients",
    icon: "🌿",
    iconBg: "#f0fdf4",
    accentText: "#166534",
  },
  {
    slug: "outdoor-decor",
    label: "Outdoor Decor",
    description: "Garden lights, statues & water features",
    icon: "🏡",
    iconBg: "#fef9c3",
    accentText: "#713f12",
  },
  {
    slug: "grow-bags",
    label: "Grow Bags & Trays",
    description: "Fabric pots, seedling trays & net pots",
    icon: "🎒",
    iconBg: "#ecfdf5",
    accentText: "#065f46",
  },
  {
    slug: "pest-control",
    label: "Pest & Disease Control",
    description: "Neem oil, fungicides & insecticides",
    icon: "🐛",
    iconBg: "#fce7f3",
    accentText: "#9d174d",
  },
];

export function getGardenCategoryBySlug(slug) {
  return GARDEN_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterGardenBySlug(products, slug) {
  const garden = products.filter(
    (p) => p.category === "garden" || p.category === "outdoor"
  );
  switch (slug) {
    case "plants-seeds":
      return garden.filter((p) => /plant|seed|sapling|bulb|herb/i.test(p.name));
    case "pots-planters":
      return garden.filter((p) =>
        /pot|planter|container|trough|bowl|vase/i.test(p.name)
      );
    case "garden-tools":
      return garden.filter((p) =>
        /spade|rake|pruner|hoe|trowel|shovel|cultivator|fork/i.test(p.name)
      );
    case "irrigation":
      return garden.filter((p) =>
        /drip|sprinkler|hose|irrigation|watering can|nozzle/i.test(p.name)
      );
    case "fertilizers":
      return garden.filter((p) =>
        /fertilizer|compost|soil|cocopeat|nutrient|manure|vermi/i.test(p.name)
      );
    case "outdoor-decor":
      return garden.filter((p) =>
        /decor|statue|fountain|garden light|ornament|bird|wind/i.test(p.name)
      );
    case "grow-bags":
      return garden.filter((p) =>
        /grow bag|fabric pot|seedling|tray|net pot|plug/i.test(p.name)
      );
    case "pest-control":
      return garden.filter((p) =>
        /neem|pesticide|fungicide|insecticide|herbicide|pest|disease/i.test(p.name)
      );
    default:
      return garden;
  }
}
