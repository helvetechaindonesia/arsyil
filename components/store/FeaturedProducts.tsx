import React from 'react'
import { PRODUCTS } from '@/lib/data/mock'
import { ProductCard } from './ProductCard'
import styles from './FeaturedProducts.module.css'

export function FeaturedProducts() {
  const featuredProducts = PRODUCTS.filter(p => p.isFeatured).slice(0, 4)

  return (
    <section className="section-padding">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Seasonal Picks</h2>
          <p className={styles.subtitle}>Hand-selected essentials for your minimalist wardrobe.</p>
        </div>
        
        <div className={styles.grid}>
          {featuredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.images[0]}
              category={product.category}
              isNew={product.isNew}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
