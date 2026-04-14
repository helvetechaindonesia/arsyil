'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './CategorySection.module.css'
import { motion } from 'framer-motion'
import { Shirt, Sparkles, Layers, Palette, ShoppingBag, Footprints, Tag } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Icon Mapping
const ICON_MAP: Record<string, any> = {
  'shirt': Shirt,
  'sparkles': Sparkles,
  'layers': Layers,
  'palette': Palette,
  'shopping-bag': ShoppingBag,
  'footprints': Footprints,
  'default': Tag
}

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
}

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null) // Only show top-level categories
        .order('name')
      
      if (data) setCategories(data)
      setLoading(false)
    }
    fetchCategories()
  }, [])

  if (loading) return <div className={styles.section} style={{ textAlign: 'center' }}>Loading categories...</div>
  
  if (categories.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {categories.map((cat, index) => {
            // Determine icon based on slug or name
            const IconComponent = ICON_MAP[cat.slug] || ICON_MAP['default']
            
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/catalog?category=${cat.slug}`} className={styles.categoryCard}>
                  <div className={styles.iconWrapper}>
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      <IconComponent size={32} strokeWidth={1.5} />
                    )}
                  </div>
                  <div className={styles.content}>
                    <h3>{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
