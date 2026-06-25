"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { MATERIALS_CATEGORIES, filterMaterialsBySlug } from "@/lib/materialsCategories";

export default function MaterialsCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={MATERIALS_CATEGORIES}
      filterFn={filterMaterialsBySlug}
      basePath="/materials"
      sectionLabel="BuildBudy Materials"
    />
  );
}
