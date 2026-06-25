import data from "@/lib/data/products.json";

export function getProducts() {
  return data["GET /products"] || [];
}
