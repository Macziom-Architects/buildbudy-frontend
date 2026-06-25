"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { ELECTRICAL_CATEGORIES, filterElectricalBySlug } from "@/lib/electricalCategories";

export default function ElectricalCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={ELECTRICAL_CATEGORIES}
      filterFn={filterElectricalBySlug}
      basePath="/electrical"
      sectionLabel="BuildBudy Electrical"
    />
  );
}
