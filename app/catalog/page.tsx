import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/store/ProductCard'
import { CatalogFilters } from '@/components/store/CatalogFilters'
import { BackButton } from '@/components/ui/BackButton'
import styles from './Catalog.module.css'

interface PageProps {
  searchParams: Promise<{ category?: string; sort?: string }>
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('products')
    .select(`
      *,
      categories!inner(id, name, slug),
      product_images(url, is_primary)
    `)
    .eq('is_published', true)

  // Filter by category if selected
  if (selectedCategory) {
    query = query.eq('categories.name', selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1))
  }

  const { data: products, error } = await query.order('created_at', { ascending: false })
  
  // Fetch all categories for filter sidebar
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  if (error) {
    console.error('Catalog fetch error:', error)
  }

  return (
    <div className={styles.catalogPage}>
      <div className="container">
        <BackButton label="Kembali ke Beranda" href="/" />
        <header className={styles.header}>
          <h1 className={styles.title}>
            {selectedCategory ? `${selectedCategory} Collection` : 'All Products'}
          </h1>
          <p className={styles.count}>{products?.length || 0} items found</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <CatalogFilters 
              categories={(categories as any) || []} 
              activeCategory={selectedCategory} 
            />
          </aside>
          
          <main className={styles.main}>
            <div className={styles.grid}>
              {products?.map(product => {
                const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.url || product.product_images?.[0]?.url || ''
                return (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={Number(product.base_price)}
                    image={primaryImage}
                    category={product.categories?.name}
                    isNew={false} // Can be derived from created_at if needed
                  />
                )
              })}
            </div>
            {(!products || products.length === 0) && (
              <div className={styles.empty}>
                <p>No products found in this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
