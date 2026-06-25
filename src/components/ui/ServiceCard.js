import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight } from "lucide-react";

function ComboTag({ label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full w-fit">
      <Zap className="h-2.5 w-2.5 flex-shrink-0" />
      {label}
    </span>
  );
}

export default function ServiceCard({
  name,
  description,
  image,
  comboTag,
  href = "#",
  className = "",
}) {
  return (
    <div
      className={`group bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ${className}`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1.5">
        {comboTag && <ComboTag label={comboTag} />}

        <h3 className="text-sm font-bold text-primary">{name}</h3>

        <p className="text-xs text-muted leading-relaxed line-clamp-1">
          {description}
        </p>

        {/* CTA — Link styled as button to avoid <a><button> nesting */}
        <Link
          href={href}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-accent text-primary hover:brightness-95 active:scale-[0.98] transition-all duration-150 cursor-pointer"
        >
          Book Now
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
