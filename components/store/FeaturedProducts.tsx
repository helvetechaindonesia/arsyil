'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from './ProductCard'
import styles from './FeaturedProducts.module.css'

interface CMSContent {
  title: string
  subtitle: string
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [cms, setCms] = useState<CMSContent>({
    title: 'Seasonal Picks',
    subtitle: 'Hand-selected essentials for your minimalist wardrobe.'
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch CMS
      const { data: cmsData } = await supabase
        .from('site_content')
        .select('key, content')
        .eq('section', 'featured')
      
      if (cmsData) {
        const mapped: any = {}
        cmsData.forEach(item => {
          if (item.key === 'featured_section_title') mapped.title = item.content
          if (item.key === 'featured_section_subtitle') mapped.subtitle = item.content
        })
        setCms(prev => ({ ...prev, ...mapped }))
      }

      // 2. Fetch Featured Products (Real data from Supabase)
      const { data: prodData } = await supabase
        .from('products')
        .select('*, product_images(url, is_primary)')
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(4)
      
      if (prodData) {
        setProducts(prodData.map(p => ({
          ...p,
          price: p.base_price,
          image: p.product_images?.find((img: any) => img.is_primary)?.url || p.product_images?.[0]?.url
        })))
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return null

  return (
    <section className="section-padding">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>{cms.title}</h2>
          <p className={styles.subtitle}>{cms.subtitle}</p>
        </div>
        
        <div className={styles.grid}>
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={product.image || 'https://via.placeholder.com/300x400'}
              category={product.category_id} // Should ideally fetch category name too
              isNew={false}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
