'use client'

import React from 'react'
import Link from 'next/link'
import styles from './CategorySection.module.css'
import { motion } from 'framer-motion'
import { Shirt, Sparkles, Layers, Palette, ShoppingBag, Footprints } from 'lucide-react'

const CATEGORIES = [
  { name: 'Daster', slug: 'daster', icon: Shirt },
  { name: 'Busana Muslim', slug: 'busana-muslim', icon: Sparkles },
  { name: 'Celana', slug: 'celana', icon: Layers },
  { name: 'Batik', slug: 'batik', icon: Palette },
  { name: 'Tas', slug: 'tas', icon: ShoppingBag },
  { name: 'Sepatu', slug: 'sepatu', icon: Footprints },
]

export function CategorySection() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/catalog?category=${cat.slug}`} className={styles.categoryCard}>
                <div className={styles.iconWrapper}>
                  <cat.icon size={32} strokeWidth={1.5} />
                </div>
                <div className={styles.content}>
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
