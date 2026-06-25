"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { PLUMBING_CATEGORIES, filterPlumbingBySlug } from "@/lib/plumbingCategories";

export default function PlumbingCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={PLUMBING_CATEGORIES}
      filterFn={filterPlumbingBySlug}
      basePath="/plumbing"
      sectionLabel="BuildBudy Plumbing"
    />
  );
}
