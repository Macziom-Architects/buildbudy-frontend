import CategoryCard from "@/components/ui/CategoryCard";

const CATEGORIES = [
  { label: "Materials",  href: "/materials",  image: "https://placehold.co/400x300/e8e8e8/2c3e50?text=Materials" },
  { label: "Tools",      href: "/tools",      image: "/tools.jpg" },
  { label: "Hardware",   href: "/hardware",   image: "/hardware.jpg" },
  { label: "Plumbing",   href: "/plumbing",   image: "/plumbing.jpg" },
  { label: "Electrical", href: "/electrical", image: "https://placehold.co/400x300/fef3c7/92400e?text=Electrical" },
  { label: "Paint",      href: "/paint",      image: "/paint.jpg" },
  { label: "Lighting",   href: "/lighting",   image: "/lighting.jpg" },
  { label: "Garden",     href: "/garden",     image: "/garden.jpg" },
  { label: "Furniture",  href: "/furniture",  image: "/furniture.jpg" },
  { label: "DIY",        href: "/diy",        image: "https://placehold.co/400x300/e8f8f5/0e6655?text=DIY" },
  { label: "Services",   href: "/services",   image: "https://placehold.co/400x300/dbeafe/1d4ed8?text=Services" },
];

export default function ShopByDepartment() {
  return (
    <section className="bg-[#F9FAFB] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            Shop by Department
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Everything for your home, in one place.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.label}
              label={cat.label}
              href={cat.href}
              image={cat.image}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
