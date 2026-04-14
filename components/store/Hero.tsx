'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '../ui/Button'
import { createClient } from '@/lib/supabase/client'
import styles from './Hero.module.css'

export function Hero() {
  const [content, setContent] = useState<any>({
    hero_title: 'The Art of Minimalist Luxury.',
    hero_subtitle: 'Discover a curated collection of premium essentials designed for longevity, clarity, and exceptional quality.',
    hero_image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000'
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchCMS() {
      const { data } = await supabase
        .from('site_content')
        .select('key, content, image_url')
        .eq('section', 'hero')

      if (data) {
        const cmsData: any = {}
        data.forEach((item: any) => {
          cmsData[item.key] = item.content || item.image_url
        })
        
        setContent((prev: any) => ({
          ...prev,
          ...cmsData
        }))
      }
    }
    fetchCMS()
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.overlay} />
        <img 
          src={content.hero_subtitle_image || content.hero_image} // Fallback to seeded image if available
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
          <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: content.hero_title.replace(/\. /g, '.<br/>') }} />
          
          <p className={styles.description}>
            {content.hero_subtitle || content.hero_subtitle}
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
