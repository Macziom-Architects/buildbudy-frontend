import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

export default function CategoryCard({ label, href, image, className = "" }) {
  return (
    <Link
      href={href}
      className={`group block bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.03] transition-all duration-300 ${className}`}
    >
      {/* Image — rounded top corners, overflow-hidden clips within them */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-gray-100">
        <SafeImage
          src={image}
          alt={label}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>

      {/* Label */}
      <div className="px-3 py-3.5">
        <p className="text-sm font-bold text-primary text-center leading-tight">
          {label}
        </p>
      </div>
    </Link>
  );
}
