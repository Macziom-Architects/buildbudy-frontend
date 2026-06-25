"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { HARDWARE_CATEGORIES, filterProductsBySlug } from "@/lib/hardwareCategories";

export default function HardwareCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={HARDWARE_CATEGORIES}
      filterFn={filterProductsBySlug}
      basePath="/hardware"
      sectionLabel="BuildBudy Hardware"
    />
  );
}
