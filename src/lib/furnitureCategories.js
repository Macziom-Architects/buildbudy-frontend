export const FURNITURE_CATEGORIES = [
  {
    slug: "sofas",
    label: "Sofas & Seating",
    description: "3-seaters, L-shapes & recliners",
    icon: "🛋️",
    iconBg: "#fef3c7",
    accentText: "#92400e",
  },
  {
    slug: "beds",
    label: "Beds & Mattresses",
    description: "King, queen & single beds",
    icon: "🛏️",
    iconBg: "#ede9fe",
    accentText: "#5b21b6",
  },
  {
    slug: "tables",
    label: "Tables & Desks",
    description: "Dining, study & coffee tables",
    icon: "🪑",
    iconBg: "#fdf2e9",
    accentText: "#92400e",
  },
  {
    slug: "chairs",
    label: "Chairs",
    description: "Office, dining & accent chairs",
    icon: "💺",
    iconBg: "#ecfdf5",
    accentText: "#065f46",
  },
  {
    slug: "wardrobes",
    label: "Wardrobes & Cabinets",
    description: "Sliding, hinged & walk-in",
    icon: "🚪",
    iconBg: "#f1f5f9",
    accentText: "#334155",
  },
  {
    slug: "office",
    label: "Office Furniture",
    description: "Workstations, cabinets & ergonomic",
    icon: "🖥️",
    iconBg: "#eff6ff",
    accentText: "#1e40af",
  },
  {
    slug: "shelving",
    label: "Shelving & Storage",
    description: "Bookshelves, racks & wall units",
    icon: "📚",
    iconBg: "#fff7ed",
    accentText: "#c2410c",
  },
  {
    slug: "outdoor",
    label: "Outdoor Furniture",
    description: "Garden sets, benches & swings",
    icon: "🌿",
    iconBg: "#f0fdf4",
    accentText: "#166534",
  },
];

export function getFurnitureCategoryBySlug(slug) {
  return FURNITURE_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterFurnitureBySlug(products, slug) {
  const furniture = products.filter((p) => p.category === "furniture");
  switch (slug) {
    case "sofas":
      return furniture.filter((p) => /sofa|couch|sectional|recliner|loveseat/i.test(p.name));
    case "beds":
      return furniture.filter((p) => /bed|mattress|cot|headboard|divan/i.test(p.name));
    case "tables":
      return furniture.filter((p) => /table|desk|counter|workbench/i.test(p.name));
    case "chairs":
      return furniture.filter((p) => /chair|stool|ottoman|pouffe/i.test(p.name));
    case "wardrobes":
      return furniture.filter((p) => /wardrobe|cabinet|almirah|cupboard|closet/i.test(p.name));
    case "office":
      return furniture.filter((p) =>
        /office|workstation|ergonomic|executive|study/i.test(p.name)
      );
    case "shelving":
      return furniture.filter((p) =>
        /shelf|shelving|bookshelf|rack|unit|display/i.test(p.name)
      );
    case "outdoor":
      return furniture.filter((p) =>
        /outdoor|garden|patio|terrace|balcony|bench|swing/i.test(p.name)
      );
    default:
      return furniture;
  }
}
