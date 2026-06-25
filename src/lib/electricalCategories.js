export const ELECTRICAL_CATEGORIES = [
  {
    slug: "switches-sockets",
    label: "Switches & Sockets",
    description: "Modular switches, sockets & USB outlets",
    icon: "🔌",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "wires-cables",
    label: "Wires & Cables",
    description: "FR wires, armoured cables & conduits",
    icon: "🔋",
    iconBg: "#dbeafe",
    accentText: "#1d4ed8",
  },
  {
    slug: "mcbs-dbs",
    label: "MCBs & Distribution Boards",
    description: "Circuit breakers, RCCBs & DB boxes",
    icon: "⚡",
    iconBg: "#fef9c3",
    accentText: "#713f12",
  },
  {
    slug: "fans",
    label: "Fans & Ventilation",
    description: "Ceiling, exhaust & table fans",
    icon: "💨",
    iconBg: "#e0f2fe",
    accentText: "#0369a1",
  },
  {
    slug: "lights-fixtures",
    label: "Lights & Fixtures",
    description: "LED bulbs, panels & batten lights",
    icon: "💡",
    iconBg: "#fefce8",
    accentText: "#a16207",
  },
  {
    slug: "conduits-accessories",
    label: "Conduits & Accessories",
    description: "PVC conduits, bends & junction boxes",
    icon: "🔧",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "earthing-safety",
    label: "Earthing & Safety",
    description: "Earthing rods, strips & lightning protection",
    icon: "🛡️",
    iconBg: "#fee2e2",
    accentText: "#7f1d1d",
  },
  {
    slug: "meters-testers",
    label: "Meters & Testers",
    description: "Energy meters, multimeters & clamp meters",
    icon: "📊",
    iconBg: "#f0fdf4",
    accentText: "#166534",
  },
  {
    slug: "all-electrical",
    label: "All Electrical",
    description: "Browse all electrical products",
    icon: "🔆",
    iconBg: "#eff6ff",
    accentText: "#1e40af",
  },
];

export function getElectricalCategoryBySlug(slug) {
  return ELECTRICAL_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterElectricalBySlug(products, slug) {
  const electrical = products.filter((p) => p.routeCategory === "electrical");
  switch (slug) {
    case "switches-sockets":
      return products.filter(
        (p) =>
          p.category === "switches-sockets" ||
          /switch|socket|outlet|modular|usb.*port|plate/i.test(p.name)
      );
    case "wires-cables":
      return products.filter(
        (p) =>
          p.category === "wires-cables" ||
          /wire|cable|conduit|fr.*wire|armoured|flexible/i.test(p.name)
      );
    case "mcbs-dbs":
      return products.filter(
        (p) =>
          p.category === "mcbs-dbs" ||
          /mcb|rccb|rcbo|elcb|distribution board|db box|isolator|circuit breaker/i.test(p.name)
      );
    case "fans":
      return electrical.filter(
        (p) => /fan|ceiling fan|exhaust|ventilation/i.test(p.name)
      );
    case "lights-fixtures":
      return electrical.filter(
        (p) => /led|bulb|panel light|batten|tube light|downlight|spotlight|lamp/i.test(p.name)
      );
    case "conduits-accessories":
      return products.filter(
        (p) =>
          p.category === "conduits-accessories" ||
          /conduit|junction box|bend|coupling|clip|saddle/i.test(p.name)
      );
    case "earthing-safety":
      return electrical.filter(
        (p) => /earth|earthing|lightning|surge|strip|rod/i.test(p.name)
      );
    case "meters-testers":
      return electrical.filter(
        (p) => /meter|tester|multimeter|clamp|energy meter|kwh/i.test(p.name)
      );
    case "all-electrical":
    default:
      return electrical;
  }
}
