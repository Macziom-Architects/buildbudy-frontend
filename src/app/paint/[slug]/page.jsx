"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { PAINT_CATEGORIES, filterPaintBySlug } from "@/lib/paintCategories";

export default function PaintCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={PAINT_CATEGORIES}
      filterFn={filterPaintBySlug}
      basePath="/paint"
      sectionLabel="BuildBudy Paint"
    />
  );
}
