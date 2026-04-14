import { Hero } from "@/components/store/Hero";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { CategorySection } from "@/components/store/CategorySection";
import { InfoSections } from "@/components/store/InfoSections";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedProducts />
      <InfoSections />
      
      {/* Brand Ethos Section */}
      <section className="section-padding" style={{ backgroundColor: 'hsl(var(--secondary))', borderTop: '1px solid hsl(var(--border) / 0.5)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Timeless Design</h3>
              <p>We believe in creating products that transcend trends, focusing on pure aesthetics and enduring quality.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Sustainably Crafted</h3>
              <p>Our commitment to the planet means using recycled materials and ethical production processes for every piece.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Premium Quality</h3>
              <p>Only the finest fabrics and materials are selected, ensuring that your ARSYIL pieces last a lifetime.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
