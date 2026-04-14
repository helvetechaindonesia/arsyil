import React from 'react'
import { PRODUCTS, CATEGORIES } from '@/lib/data/mock'
import { ProductCard } from '@/components/store/ProductCard'
import { CatalogFilters } from '@/components/store/CatalogFilters'
import { BackButton } from '@/components/ui/BackButton'
import styles from './Catalog.module.css'

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams
  
  const filteredProducts = selectedCategory 
    ? PRODUCTS.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    : PRODUCTS

  return (
    <div className={styles.catalogPage}>
      <div className="container">
        <BackButton label="Kembali ke Beranda" href="/" />
        <header className={styles.header}>
          <h1 className={styles.title}>
            {selectedCategory ? `${selectedCategory} Collection` : 'All Products'}
          </h1>
          <p className={styles.count}>{filteredProducts.length} items found</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <CatalogFilters 
              categories={CATEGORIES} 
              activeCategory={selectedCategory} 
            />
          </aside>
          
          <main className={styles.main}>
            <div className={styles.grid}>
              {filteredProducts.map(product => (
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
          </main>
        </div>
      </div>
    </div>
  )
}
