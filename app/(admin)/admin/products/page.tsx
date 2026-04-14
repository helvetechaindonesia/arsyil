'use client'

import React, { useState } from 'react'
import { Edit2, Trash2, Plus, Search, Filter } from 'lucide-react'
import { PRODUCTS } from '@/lib/data/mock'
import { Button } from '@/components/ui/Button'
import styles from './AdminProducts.module.css'

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage your inventory and product details.</p>
        </div>
        <Button>
          <Plus size={18} /> Add Product
        </Button>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter size={18} /> Filter
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className={styles.productCell}>
                    <img src={product.images[0]} alt={product.name} />
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{product.name}</span>
                      <span className={styles.productSlug}>{product.slug}</span>
                    </div>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  {product.variants.reduce((acc, curr) => acc + curr.stock, 0)}
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${product.isNew ? styles.badgeNew : ''}`}>
                    {product.isNew ? 'New' : 'Active'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn}><Edit2 size={16} /></button>
                    <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
