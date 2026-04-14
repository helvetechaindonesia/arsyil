'use client'

import React, { useState } from 'react'
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react'
import { Product } from '@/lib/data/mock'
import { useCart } from '@/lib/store/useCart'
import { useToast } from '@/lib/store/useToast'
import { Button } from '../ui/Button'
import styles from './ProductDetails.module.css'

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCart((state) => state.addItem)
  const showToast = useToast((state) => state.show)

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant.id}`,
      name: product.name,
      price: product.price + (selectedVariant.priceAdjustment || 0),
      quantity: quantity,
      image: product.images[0],
      variant: selectedVariant.name
    })
    showToast(`${product.name} added to cart`, '🛒')
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToast(
      isWishlisted ? `Removed from wishlist` : `${product.name} saved to wishlist`,
      isWishlisted ? '💔' : '♥'
    )
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={styles.details}>
      <header className={styles.header}>
        <span className={styles.category}>{product.category}</span>
        <h1 className={styles.title}>{product.name}</h1>
        <p className={styles.price}>{formatPrice(product.price + (selectedVariant.priceAdjustment || 0))}</p>
      </header>

      <section className={styles.description}>
        <p>{product.description}</p>
      </section>

      <section className={styles.selection}>
        <div className={styles.variantGroup}>
          <p className={styles.label}>Select Variant: <span>{selectedVariant.name}</span></p>
          <div className={styles.variants}>
            {product.variants.map((v) => (
              <button
                key={v.id}
                className={`${styles.variantBtn} ${selectedVariant.id === v.id ? styles.active : ''}`}
                onClick={() => setSelectedVariant(v)}
                disabled={v.stock === 0}
              >
                {v.name}
              </button>
            ))}
          </div>
          <p className={styles.stock}>
            {selectedVariant.stock > 0 
              ? `${selectedVariant.stock} in stock` 
              : 'Out of stock'}
          </p>
        </div>

        <div className={styles.quantityGroup}>
          <p className={styles.label}>Quantity</p>
          <div className={styles.quantityControl}>
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}>+</button>
          </div>
        </div>

        <div className={styles.actions}>
          <Button 
            size="lg" 
            className={styles.addBtn} 
            onClick={handleAddToCart}
            disabled={selectedVariant.stock === 0}
          >
            <ShoppingBag size={20} /> Add to Cart
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`}
            onClick={handleWishlist}
          >
            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
          </Button>
        </div>
      </section>

      {product.specs && (
        <section className={styles.specs}>
          <h3 className={styles.specsTitle}>Specifications</h3>
          <div className={styles.specsGrid}>
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className={styles.specItem}>
                <span className={styles.specKey}>{key}</span>
                <span className={styles.specValue}>{value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.benefits}>
        <div className={styles.benefitItem}>
          <Truck size={18} />
          <span>Free Express Shipping</span>
        </div>
        <div className={styles.benefitItem}>
          <RefreshCw size={18} />
          <span>30-Day Easy Returns</span>
        </div>
        <div className={styles.benefitItem}>
          <ShieldCheck size={18} />
          <span>Authenticity Guaranteed</span>
        </div>
      </footer>
    </div>
  )
}
