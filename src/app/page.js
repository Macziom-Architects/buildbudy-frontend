import HeroCarousel from "@/components/promotions/HeroCarousel";
import FreeDeliveryStrip from "@/components/promotions/FreeDeliveryStrip";
import FlashSaleCountdown from "@/components/promotions/FlashSaleCountdown";
import PromoGrid from "@/components/promotions/PromoGrid";
import SplitPromoBanner from "@/components/promotions/SplitPromoBanner";
import ShopByDepartment from "@/components/sections/ShopByDepartment";
import PromoBanner from "@/components/sections/PromoBanner";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedEssentials from "@/components/sections/FeaturedEssentials";
import ServicesSection from "@/components/sections/ServicesSection";
import LearnSection from "@/components/sections/LearnSection";
import TrustSection from "@/components/sections/TrustSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Footer from "@/components/layout/Footer";
import promotions from "@/data/homepage_promotions.json";

export default function Home() {
  return (
    <>
      <main>
        <HeroCarousel slides={promotions.heroCarousel} />
        <ShopByDepartment />
        <FreeDeliveryStrip banner={promotions.horizontalBanners.freeDelivery} />
        <FeaturedProducts />
        <FlashSaleCountdown sale={promotions.flashSale} />
        <PromoBanner {...promotions.twoColumnPromo} />
        <PromoGrid
          items={promotions.promoGrid}
          title="Deals by Category"
          subtitle="Handpicked offers across BuildBudy's most popular categories"
        />
        <FeaturedEssentials />
        <SplitPromoBanner banner={promotions.horizontalBanners.buildYourDreamHome} />
        <ServicesSection />
        <LearnSection />
        <TrustSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
