'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import { useCart } from '@/lib/store/useCart'
import { useToast } from '@/lib/store/useToast'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  id: string
  slug: string
  name: string
  price: number
  image: string
  category: string
  isNew?: boolean
}

export function ProductCard({ id, slug, name, price, image, category, isNew }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem)
  const showToast = useToast((s) => s.show)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: `${id}-default`,
      name,
      price,
      quantity: 1,
      image,
      variant: 'Default'
    })
    showToast(`${name} added to cart`, '🛒')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    showToast(`${name} saved to wishlist`, '♥')
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={styles.card}
    >
      <div className={styles.imageWrapper}>
        {isNew && <span className={styles.badge}>New</span>}
        <button className={styles.wishlistBtn} onClick={handleWishlist}>
          <Heart size={18} />
        </button>
        <Link href={`/product/${slug}`}>
          <img src={image} alt={name} className={styles.image} />
        </Link>
        <button className={styles.quickAdd} onClick={handleQuickAdd}>
          <ShoppingBag size={18} /> <span className={styles.quickAddText}>Quick Add</span>
        </button>
      </div>
      
      <div className={styles.info}>
        <span className={styles.category}>{category}</span>
        <Link href={`/product/${slug}`}>
          <h3 className={styles.name}>{name}</h3>
        </Link>
        <p className={styles.price} suppressHydrationWarning>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(price)}
        </p>
      </div>
    </motion.div>
  )
}
