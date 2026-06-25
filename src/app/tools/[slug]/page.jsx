"use client";

import { use } from "react";
import CategoryProductListing from "@/components/product/CategoryProductListing";
import { TOOLS_CATEGORIES, filterToolsBySlug } from "@/lib/toolsCategories";

export default function ToolsCategoryPage({ params }) {
  const { slug } = use(params);
  return (
    <CategoryProductListing
      slug={slug}
      categories={TOOLS_CATEGORIES}
      filterFn={filterToolsBySlug}
      basePath="/tools"
      sectionLabel="BuildBudy Tools"
    />
  );
}
