"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { FURNITURE_CATEGORIES, filterFurnitureBySlug } from "@/lib/furnitureCategories";

export default function FurnitureCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={FURNITURE_CATEGORIES}
      filterFn={filterFurnitureBySlug}
      basePath="/furniture"
      sectionLabel="BuildBudy Furniture"
    />
  );
}
