'use client'

import React from 'react'
import Link from 'next/link'
import { Category } from '@/lib/data/mock'
import styles from './CatalogFilters.module.css'

interface CatalogFiltersProps {
  categories: Category[]
  activeCategory?: string
}

export function CatalogFilters({ categories, activeCategory }: CatalogFiltersProps) {
  return (
    <div className={styles.filters}>
      <div className={styles.group}>
        <h3 className={styles.label}>Categories</h3>
        <ul className={styles.list}>
          <li>
            <Link 
              href="/catalog" 
              className={`${styles.link} ${!activeCategory ? styles.active : ''}`}
            >
              All Collections
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link 
                href={`/catalog?category=${cat.name.toLowerCase()}`}
                className={`${styles.link} ${activeCategory === cat.name.toLowerCase() ? styles.active : ''}`}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.group}>
        <h3 className={styles.label}>Price Range</h3>
        <div className={styles.priceInputs}>
          <input type="number" placeholder="Min" className={styles.priceInput} />
          <input type="number" placeholder="Max" className={styles.priceInput} />
        </div>
      </div>

      <div className={styles.group}>
        <h3 className={styles.label}>Availability</h3>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" />
          <span>In Stock</span>
        </label>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" />
          <span>New Arrivals</span>
        </label>
      </div>
    </div>
  )
}
