"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { LIGHTING_CATEGORIES, filterLightingBySlug } from "@/lib/lightingCategories";

export default function LightingCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={LIGHTING_CATEGORIES}
      filterFn={filterLightingBySlug}
      basePath="/lighting"
      sectionLabel="BuildBudy Lighting"
    />
  );
}
