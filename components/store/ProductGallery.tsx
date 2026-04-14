'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './ProductGallery.module.css'

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={images[activeImage]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={styles.mainImage}
            alt="Product image"
          />
        </AnimatePresence>
      </div>
      
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`${styles.thumbBtn} ${activeImage === idx ? styles.active : ''}`}
              onClick={() => setActiveImage(idx)}
            >
              <img src={img} alt={`Thumb ${idx}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
