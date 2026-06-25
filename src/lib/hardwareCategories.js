export const HARDWARE_CATEGORIES = [
  {
    slug: "locks-hardware",
    label: "Locks & Hardware",
    description: "Door locks, handles & hinges",
    icon: "🔐",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "screws-fasteners",
    label: "Screws & Fasteners",
    description: "Screws, bolts, nails & anchors",
    icon: "🪛",
    iconBg: "#e2e8f0",
    accentText: "#334155",
  },
  {
    slug: "door-accessories",
    label: "Door Accessories",
    description: "Hinges, closers, bolts & stoppers",
    icon: "🚪",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "kitchen-hardware",
    label: "Kitchen Hardware",
    description: "Drawer channels, hinges & baskets",
    icon: "🍳",
    iconBg: "#fdf2e9",
    accentText: "#784212",
  },
  {
    slug: "adhesives",
    label: "Adhesives & Sealants",
    description: "Fevicol, epoxy, wood glue & sealants",
    icon: "🪣",
    iconBg: "#fee2e2",
    accentText: "#7f1d1d",
  },
  {
    slug: "tile-adhesives",
    label: "Tile Adhesives",
    description: "White & grey adhesive mortars",
    icon: "🔲",
    iconBg: "#f8f9fa",
    accentText: "#2c3e50",
  },
  {
    slug: "ceiling-tiles",
    label: "Ceiling Tiles",
    description: "Decorative panels & false ceiling",
    icon: "🏛️",
    iconBg: "#fef9e7",
    accentText: "#9a7d0a",
  },
  {
    slug: "tiles-accessories",
    label: "Tiles & Accessories",
    description: "Floor, wall & vitrified tiles",
    icon: "🟫",
    iconBg: "#fdf2e9",
    accentText: "#784212",
  },
  {
    slug: "wardrobe-fittings",
    label: "Wardrobe Fittings",
    description: "Sliding channels & wardrobe hardware",
    icon: "🗄️",
    iconBg: "#e8e8e8",
    accentText: "#424242",
  },
  {
    slug: "gypsum-boards",
    label: "Gypsum Boards",
    description: "Ceiling boards & POP panels",
    icon: "⬜",
    iconBg: "#f2f3f4",
    accentText: "#2c3e50",
  },
  {
    slug: "mesh-nets",
    label: "Mesh & Nets",
    description: "Chicken wire, GI mesh & safety nets",
    icon: "🕸️",
    iconBg: "#e8e8e8",
    accentText: "#424242",
  },
  {
    slug: "all-hardware",
    label: "All Hardware",
    description: "Browse everything in hardware",
    icon: "🔧",
    iconBg: "#dbeafe",
    accentText: "#1d4ed8",
  },
];

export function getCategoryBySlug(slug) {
  return HARDWARE_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function filterProductsBySlug(products, slug) {
  const hardware = products.filter((p) => p.routeCategory === "hardware");
  switch (slug) {
    case "locks-hardware":
      return hardware.filter((p) =>
        p.category === "lock-hardware" ||
        /lock|handle|hinge|knob|latch|cabinet hardware/i.test(p.name)
      );
    case "screws-fasteners":
      return products.filter((p) =>
        p.category === "screws-fasteners" ||
        /screw|bolt|nail|anchor|rivet|fastener|nut\s|washer/i.test(p.name)
      );
    case "door-accessories":
      return hardware.filter((p) =>
        p.category === "door-accessories" ||
        /door|closer|stopper|tower bolt|barrel bolt/i.test(p.name)
      );
    case "kitchen-hardware":
      return hardware.filter((p) =>
        p.category === "kitchen-system-accessories" ||
        p.category === "kitchen-hardware" ||
        p.category === "cabinet-drawer-hardware" ||
        /drawer|channel|basket|pull out|kitchen/i.test(p.name)
      );
    case "adhesives":
      return hardware.filter((p) =>
        p.category === "fevicol-adhesives" ||
        p.category === "epoxy-adhesive" ||
        p.category === "wood-adhesives" ||
        p.category === "sealants" ||
        /fevicol|adhesive|glue|epoxy|sealant|bond/i.test(p.name)
      );
    case "tile-adhesives":
      return products.filter((p) =>
        p.category === "tile-adhesives" ||
        /tile adhesive|laticrete|adhesive mortar/i.test(p.name)
      );
    case "ceiling-tiles":
      return products.filter((p) =>
        p.category === "ceiling-tiles-decorative-panels" ||
        /ceiling tile|decorative panel|false ceiling|ceiling panel/i.test(p.name)
      );
    case "tiles-accessories":
      return products.filter((p) =>
        p.category === "tiles-accessories" ||
        /tile.*accessory|tile spacer|grout|tile tool/i.test(p.name)
      );
    case "wardrobe-fittings":
      return hardware.filter((p) =>
        p.category === "wardrobe-sliding" ||
        p.category === "furniture-fittings" ||
        /wardrobe|sliding|furniture fitting/i.test(p.name)
      );
    case "gypsum-boards":
      return products.filter((p) =>
        p.category === "ceilings" ||
        p.category === "gypsum-pop-false-ceilings" ||
        /gypsum board|pop board|ceiling board|drywall/i.test(p.name)
      );
    case "mesh-nets":
      return products.filter((p) =>
        p.category === "construction-mesh-agro-nets" ||
        /mesh|gi net|chicken wire|agro net|wire net/i.test(p.name)
      );
    case "all-hardware":
    default:
      return hardware;
  }
}
