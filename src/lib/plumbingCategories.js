export const PLUMBING_CATEGORIES = [
  {
    slug: "cpvc-pipes",
    label: "CPVC Pipes & Fittings",
    description: "Hot & cold water CPVC systems",
    icon: "🔵",
    iconBg: "#dbeafe",
    accentText: "#1d4ed8",
  },
  {
    slug: "sanitary-fittings",
    label: "Sanitary Fittings",
    description: "Straps, valves & clamps",
    icon: "🔧",
    iconBg: "#e2e8f0",
    accentText: "#334155",
  },
  {
    slug: "wash-basins",
    label: "Wash Basins & Faucets",
    description: "Basin mixers, taps & accessories",
    icon: "🚰",
    iconBg: "#e0f2fe",
    accentText: "#0369a1",
  },
  {
    slug: "showers",
    label: "Showers & Bath",
    description: "Overhead showers & bath fixtures",
    icon: "🚿",
    iconBg: "#ecfeff",
    accentText: "#155e75",
  },
  {
    slug: "toilets",
    label: "Toilet Fixtures",
    description: "WC seats, cisterns & flush valves",
    icon: "🪠",
    iconBg: "#faf5ff",
    accentText: "#6b21a8",
  },
  {
    slug: "drainage",
    label: "Drainage & Waste",
    description: "Waste pipes, drain covers & traps",
    icon: "⬇️",
    iconBg: "#f0fdf4",
    accentText: "#166534",
  },
  {
    slug: "valves",
    label: "Valves & Stopcocks",
    description: "Ball, gate & butterfly valves",
    icon: "🔩",
    iconBg: "#f1f5f9",
    accentText: "#475569",
  },
  {
    slug: "all-plumbing",
    label: "All Plumbing",
    description: "Browse all plumbing products",
    icon: "💧",
    iconBg: "#eff6ff",
    accentText: "#1e40af",
  },
];

export function getPlumbingCategoryBySlug(slug) {
  return PLUMBING_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterPlumbingBySlug(products, slug) {
  const plumbing = products.filter((p) => p.routeCategory === "plumbing");
  switch (slug) {
    case "cpvc-pipes":
      return products.filter(
        (p) =>
          p.category === "cpvc-pipes-fittings" ||
          /cpvc|upvc|pvc.*pipe|pipe.*fitting|elbow|tee|reducer|coupling/i.test(p.name)
      );
    case "sanitary-fittings":
      return products.filter(
        (p) =>
          p.category === "sanitary-bath-fittings" ||
          /strap|clamp|fitting|nipple|connector|union|adaptor/i.test(p.name)
      );
    case "wash-basins":
      return products.filter(
        (p) =>
          p.category === "wash-basins-faucets" ||
          /basin|faucet|tap|mixer|lever.*tap|bib cock/i.test(p.name)
      );
    case "showers":
      return products.filter(
        (p) =>
          p.category === "showers-bath-fixtures" ||
          /shower|overhead|hand.*held|bath.*fixture/i.test(p.name)
      );
    case "toilets":
      return products.filter(
        (p) =>
          p.category === "wc-toilet-fixtures" ||
          /toilet|wc|cistern|flush|commode|seat/i.test(p.name)
      );
    case "drainage":
      return products.filter(
        (p) =>
          p.category === "drainage-plumbing-accessories" ||
          /drain|waste.*pipe|bottle trap|p-trap|s-trap|drain cover/i.test(p.name)
      );
    case "valves":
      return plumbing.filter(
        (p) => /valve|ball valve|stopcock|gate valve|butterfly/i.test(p.name)
      );
    case "all-plumbing":
    default:
      return plumbing;
  }
}
