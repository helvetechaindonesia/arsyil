'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.overlay} />
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Collection" 
          className={styles.bgImage}
        />
      </div>
      
      <div className={styles.container}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.content}
        >
          <span className={styles.badge}>Spring / Summer 2026</span>
          <h1 className={styles.title}>
            The Art of <br />
            <span className={styles.accent}>Minimalist</span> Luxury.
          </h1>
          <p className={styles.description}>
            Discover a curated collection of premium essentials designed for longevity, clarity, and exceptional quality.
          </p>
          <div className={styles.actions}>
            <Button asChild size="lg">
              <Link href="/catalog">Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/lookbook">View Lookbook</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className={styles.scrollIndicator}
      >
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
        <span>Scroll to explore</span>
      </motion.div>
    </section>
  )
}
