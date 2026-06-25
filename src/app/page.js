import Hero from "@/components/sections/Hero";
import ShopByDepartment from "@/components/sections/ShopByDepartment";
import PromoBanner from "@/components/sections/PromoBanner";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import FeaturedEssentials from "@/components/sections/FeaturedEssentials";
import ServicesSection from "@/components/sections/ServicesSection";
import LearnSection from "@/components/sections/LearnSection";
import TrustSection from "@/components/sections/TrustSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ShopByDepartment />
        <PromoBanner />
        <FeaturedProducts />
        <FeaturedEssentials />
        <ServicesSection />
        <LearnSection />
        <TrustSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
