import { Hero } from "@/components/store/Hero";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { CategorySection } from "@/components/store/CategorySection";
import { InfoSections } from "@/components/store/InfoSections";
import { BrandEthos } from "@/components/store/BrandEthos";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <InfoSections />
      <BrandEthos />
    </>
  );
}
