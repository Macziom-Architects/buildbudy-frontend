export const TOOLS_CATEGORIES = [
  {
    slug: "electrical-tools",
    label: "Electrical Tools",
    description: "Testers, meters & electrical equipment",
    icon: "⚡",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "hand-tools",
    label: "Hand Tools",
    description: "Pliers, keys, screwdrivers & more",
    icon: "🤜",
    iconBg: "#e8e8e8",
    accentText: "#2c3e50",
  },
  {
    slug: "cutting",
    label: "Cutting Tools",
    description: "Blades, saws & disc grinders",
    icon: "🪚",
    iconBg: "#fee2e2",
    accentText: "#7f1d1d",
  },
  {
    slug: "measuring",
    label: "Measuring Tools",
    description: "Tapes, levels, calipers & testers",
    icon: "📏",
    iconBg: "#fef9c3",
    accentText: "#713f12",
  },
  {
    slug: "drilling",
    label: "Drills & Drilling",
    description: "Drill machines, bits & rotary hammers",
    icon: "🔩",
    iconBg: "#d6eaf8",
    accentText: "#154360",
  },
  {
    slug: "plumbing-tools",
    label: "Plumbing Tools",
    description: "Pipe wrenches, cutters & sealants",
    icon: "🚿",
    iconBg: "#e0f2fe",
    accentText: "#0369a1",
  },
  {
    slug: "masonry-tools",
    label: "Masonry Tools",
    description: "Trowels, floats & finishing tools",
    icon: "🔨",
    iconBg: "#fef3c7",
    accentText: "#78350f",
  },
  {
    slug: "safety-gear",
    label: "Safety Gear",
    description: "Helmets, gloves, goggles & masks",
    icon: "🦺",
    iconBg: "#fed7aa",
    accentText: "#7c2d12",
  },
  {
    slug: "power-tools",
    label: "Power Tools",
    description: "Drills, grinders & circular saws",
    icon: "🔌",
    iconBg: "#dbeafe",
    accentText: "#1e3a8a",
  },
  {
    slug: "all-tools",
    label: "All Tools",
    description: "Browse the full tool range",
    icon: "🧰",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
];

export function getToolsCategoryBySlug(slug) {
  return TOOLS_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterToolsBySlug(products, slug) {
  const tools = products.filter((p) => p.routeCategory === "tools");
  switch (slug) {
    case "electrical-tools":
      return tools.filter(
        (p) =>
          p.category === "electrical-tools" ||
          /tester|meter|clamp meter|multimeter|voltage|detector/i.test(p.name)
      );
    case "hand-tools":
      return tools.filter(
        (p) =>
          p.category === "hand-tools" ||
          /plier|key set|allen key|spanner|chisel|file|punch|screwdriver/i.test(p.name)
      );
    case "cutting":
      return tools.filter(
        (p) =>
          p.category === "tools-cutting" ||
          /saw|blade|cutter|disc|grinder|circular/i.test(p.name)
      );
    case "measuring":
      return tools.filter(
        (p) =>
          p.category === "measuring-tools" ||
          /measur|tape|level|caliper|ruler|square|tester/i.test(p.name)
      );
    case "drilling":
      return tools.filter(
        (p) =>
          p.category === "drilling-cutting-grinding" ||
          /drill|rotary|hammer.*drill|bit set/i.test(p.name)
      );
    case "plumbing-tools":
      return tools.filter(
        (p) =>
          p.category === "plumbing-tools" ||
          /pipe.*wrench|tube cutter|plumbing|thread seal/i.test(p.name)
      );
    case "masonry-tools":
      return tools.filter(
        (p) =>
          p.category === "masonry-tools" ||
          /trowel|float|mason|brick|screed|joint/i.test(p.name)
      );
    case "safety-gear":
      return tools.filter(
        (p) =>
          /safety|helmet|glove|goggle|mask|respirator|boot|harness|vest/i.test(p.name)
      );
    case "power-tools":
      return tools.filter(
        (p) =>
          /power|drill machine|grinder|circular saw|jigsaw|impact/i.test(p.name)
      );
    case "all-tools":
    default:
      return tools;
  }
}
