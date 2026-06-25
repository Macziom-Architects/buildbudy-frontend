export const MATERIALS_CATEGORIES = [
  {
    slug: "cement",
    label: "Cement",
    description: "OPC, PPC & blended cement bags",
    icon: "🏗️",
    iconBg: "#e8e8e8",
    accentText: "#2c3e50",
  },
  {
    slug: "bricks-blocks",
    label: "Bricks & Blocks",
    description: "Clay, fly-ash & AAC blocks",
    icon: "🧱",
    iconBg: "#fadbd8",
    accentText: "#922b21",
  },
  {
    slug: "sand-aggregates",
    label: "Sand & Aggregates",
    description: "River sand, M-sand, crushed stone",
    icon: "⛏️",
    iconBg: "#fdebd0",
    accentText: "#784212",
  },
  {
    slug: "gypsum-pop",
    label: "Gypsum & POP",
    description: "Plaster of Paris & gypsum boards",
    icon: "⬜",
    iconBg: "#f2f3f4",
    accentText: "#2c3e50",
  },
  {
    slug: "wall-putty",
    label: "Wall Putty & White Cement",
    description: "Birla White, JK putty & primers",
    icon: "🪣",
    iconBg: "#fdfefe",
    accentText: "#1a5276",
  },
  {
    slug: "waterproofing",
    label: "Waterproofing",
    description: "Coatings, membranes & admixtures",
    icon: "💧",
    iconBg: "#d6eaf8",
    accentText: "#1a5276",
  },
  {
    slug: "mesh-nets",
    label: "Mesh & Nets",
    description: "Steel mesh, chicken wire & safety nets",
    icon: "🕸️",
    iconBg: "#e8e8e8",
    accentText: "#424242",
  },
  {
    slug: "all-materials",
    label: "All Materials",
    description: "Browse all building materials",
    icon: "🔩",
    iconBg: "#dbeafe",
    accentText: "#1d4ed8",
  },
];

export function getMaterialsCategoryBySlug(slug) {
  return MATERIALS_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function filterMaterialsBySlug(products, slug) {
  const materials = products.filter((p) => p.routeCategory === "materials");
  switch (slug) {
    case "cement":
      return materials.filter(
        (p) =>
          p.category === "cement" ||
          /cement/i.test(p.name)
      );
    case "bricks-blocks":
      return materials.filter(
        (p) =>
          p.category === "red-bricks" ||
          /brick|block|aac/i.test(p.name)
      );
    case "sand-aggregates":
      return materials.filter(
        (p) =>
          p.category === "sand-aggregrates" ||
          /sand|aggregate|gitti|crushed stone|badarpur|yamuna|reta/i.test(p.name)
      );
    case "gypsum-pop":
      return materials.filter(
        (p) =>
          p.category === "gypsum" ||
          p.category === "gypsum-pop-false-ceilings" ||
          /gypsum|pop|plaster of paris|sakarni/i.test(p.name)
      );
    case "wall-putty":
      return materials.filter(
        (p) =>
          p.category === "wall-putty" ||
          /putty|white cement|birla white|JK white/i.test(p.name)
      );
    case "waterproofing":
      return materials.filter(
        (p) =>
          p.category === "water-proofing" ||
          p.category === "waterproofing-crack-fillers" ||
          /waterproof|dr.*fixit|crack filler|repair pro/i.test(p.name)
      );
    case "mesh-nets":
      return materials.filter(
        (p) =>
          p.category === "construction-mesh-agro-nets" ||
          /mesh|gi net|chicken wire|agro net|wire.*net|jaali/i.test(p.name)
      );
    case "all-materials":
    default:
      return materials;
  }
}
