'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { X, ArrowRight, MoveHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { PRODUCTS, LOOKBOOK_COLLECTIONS } from '@/lib/data/mock'
import styles from './Lookbook.module.css'

export default function LookbookPage() {
  const [activeLookIndex, setActiveLookIndex] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const collection = LOOKBOOK_COLLECTIONS[activeLookIndex]
  const lookbookProducts = PRODUCTS.filter(p => collection.productIds.includes(p.id))

  // Motion values for swipe effect
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50
    if (info.offset.x < -swipeThreshold) {
      // Swipe Left -> Next
      setActiveLookIndex((prev) => (prev + 1) % LOOKBOOK_COLLECTIONS.length)
      setShowHint(false)
    } else if (info.offset.x > swipeThreshold) {
      // Swipe Right -> Prev
      setActiveLookIndex((prev) => (prev - 1 + LOOKBOOK_COLLECTIONS.length) % LOOKBOOK_COLLECTIONS.length)
      setShowHint(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: any = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    }
  }

  return (
    <main className={styles.lookbookContainer}>
      {/* Swipe Hint Overlay */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.swipeHint}
          >
            <div className={styles.swipeIcon}>
              <MoveHorizontal size={48} />
            </div>
            <span className={styles.swipeText}>Swipe to Explore</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* Left Side: Drag-able Hero Image */}
        <motion.div 
          key={`hero-${collection.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.leftSide}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
        >
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] as any }}
            className={styles.heroImage}
          >
            <div className={styles.overlay} />
            <img 
              src={collection.heroImage} 
              alt={collection.title} 
              className={styles.heroImage}
              draggable="false" // Prevent native drag
            />
          </motion.div>
          
          <div className={styles.header}>
            <Link href="/" className={styles.closeBtn} title="Close Lookbook">
              <X size={24} />
            </Link>
          </div>

          {/* Arrow Navigation */}
          <div className={styles.arrowNav}>
            <button 
              className={styles.navArrow} 
              onClick={(e) => {
                e.stopPropagation()
                setActiveLookIndex((prev) => (prev - 1 + LOOKBOOK_COLLECTIONS.length) % LOOKBOOK_COLLECTIONS.length)
                setShowHint(false)
              }}
              title="Previous Look"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              className={styles.navArrow} 
              onClick={(e) => {
                e.stopPropagation()
                setActiveLookIndex((prev) => (prev + 1) % LOOKBOOK_COLLECTIONS.length)
                setShowHint(false)
              }}
              title="Next Look"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots Navigation */}
          <div className={styles.navigation}>
            {LOOKBOOK_COLLECTIONS.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === activeLookIndex ? styles.dotActive : ''}`}
                onClick={() => {
                  setActiveLookIndex(index)
                  setShowHint(false)
                }}
                aria-label={`Go to look ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Right Side: Scrollable Products */}
      <div className={styles.rightSide}>
        <div className={styles.contentWrapper}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={`content-${collection.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.titleGroup}>
                <span className={styles.badge}>Look {activeLookIndex + 1} of {LOOKBOOK_COLLECTIONS.length}</span>
                <h1 className={styles.title}>{collection.title}</h1>
                <p className={styles.subtitle}>{collection.subtitle}</p>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={styles.productFeed}
              >
                {lookbookProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <Link href={`/product/${product.slug}`} className={styles.productCard}>
                      <div className={styles.imageWrapper}>
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className={styles.productImage}
                        />
                      </div>
                      <div className={styles.productInfo}>
                        <span className={styles.category}>{product.category}</span>
                        <h2 className={styles.productName}>{product.name}</h2>
                        <p className={styles.price}>
                          {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                          }).format(product.price)}
                        </p>
                        <div className={styles.viewDetail}>
                          Shop Now <ArrowRight size={14} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ marginTop: 'auto', paddingTop: '4rem', opacity: 0.5 }}
          >
            <p style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              &copy; 2026 ARSYIL. All Rights Reserved.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
