"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { GARDEN_CATEGORIES, filterGardenBySlug } from "@/lib/gardenCategories";

export default function GardenCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={GARDEN_CATEGORIES}
      filterFn={filterGardenBySlug}
      basePath="/garden"
      sectionLabel="BuildBudy Garden"
    />
  );
}
