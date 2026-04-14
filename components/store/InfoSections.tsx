'use client'

import React, { useState, useEffect } from 'react'
import { CreditCard, Truck, ShieldCheck, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './InfoSections.module.css'
import { motion } from 'framer-motion'

export function InfoSections() {
  const [cms, setCms] = useState<any>({
    payment_title: 'Metode Pembayaran',
    payment_desc: 'Tersedia berbagai pilihan pembayaran aman untuk kenyamanan Anda.',
    shipping_title: 'Metode Pengiriman',
    shipping_desc: 'Bekerja sama dengan kurir terpercaya untuk pengiriman tepat waktu.',
    banner_title: 'Melayani Pengiriman ke Seluruh Indonesia',
    banner_desc: 'Dari Sabang sampai Merauke, ARSYIL siap mengantarkan produk pilihan Anda dengan aman dan cepat sampai ke depan rumah.'
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchCMS() {
      const { data } = await supabase
        .from('site_content')
        .select('key, content')
        .or('section.eq.info,section.eq.shipping')
      
      if (data) {
        const mapped: any = {}
        data.forEach(item => {
          if (item.key === 'payment_info_title') mapped.payment_title = item.content
          if (item.key === 'payment_info_desc') mapped.payment_desc = item.content
          if (item.key === 'shipping_info_title') mapped.shipping_title = item.content
          if (item.key === 'shipping_info_desc') mapped.shipping_desc = item.content
          if (item.key === 'shipping_banner_title') mapped.banner_title = item.content
          if (item.key === 'shipping_banner_desc') mapped.banner_desc = item.content
        })
        setCms((prev: any) => ({ ...prev, ...mapped }))
      }
    }
    fetchCMS()
  }, [])

  const payments = [
    { name: 'BCA', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg' },
    { name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/id/f/fa/Bank_Mandiri_logo.svg' },
    { name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo1.svg' },
    { name: 'QRIS', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg' },
  ]

  const shipping = [
    { name: 'JNE', logo: 'https://id-live-01.slatic.net/original/6c66c30f7b0e8b1d4c2c5c96e3a479b4.jpg' },
    { name: 'J&T', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/J%26T_Express_logo.svg' },
    { name: 'SiCepat', logo: 'https://id-live-01.slatic.net/original/8a9d80c33d2657d2a9a79a83d9a1f1e3.jpg' },
  ]

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.topGrid}>
          {/* Payment Methods */}
          <motion.div 
            className={styles.infoCard}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.cardHeader}>
              <CreditCard size={24} className={styles.icon} />
              <h3>{cms.payment_title}</h3>
            </div>
            <div className={styles.logoGrid}>
              {payments.map(p => (
                <div key={p.name} className={styles.logoItem} title={p.name}>
                   <span>{p.name}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardFooter}>{cms.payment_desc}</p>
          </motion.div>

          {/* Shipping Methods */}
          <motion.div 
            className={styles.infoCard}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.cardHeader}>
              <Truck size={24} className={styles.icon} />
              <h3>{cms.shipping_title}</h3>
            </div>
            <div className={styles.logoGrid}>
              {shipping.map(s => (
                <div key={s.name} className={styles.logoItem} title={s.name}>
                   <span>{s.name}</span>
                </div>
              ))}
            </div>
            <p className={styles.cardFooter}>{cms.shipping_desc}</p>
          </motion.div>
        </div>

        {/* Indonesia-wide Shipping Hero Card */}
        <motion.div 
          className={styles.indonesiaCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className={styles.indonesiaContent}>
            <div className={styles.indonesiaText}>
              <div className={styles.badge}><Globe size={14} /> Pengiriman Nasional</div>
              <h2>{cms.banner_title}</h2>
              <p>{cms.banner_desc}</p>
            </div>
            <div className={styles.indonesiaIllustration}>
               <ShieldCheck size={120} strokeWidth={0.5} opacity={0.2} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
