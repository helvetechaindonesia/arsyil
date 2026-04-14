'use client'

import React from 'react'
import Link from 'next/link'
import { Package, ChevronRight, Copy } from 'lucide-react'
import { MOCK_ORDERS, STATUS_LABELS, STATUS_COLORS } from '@/lib/data/mockOrders'
import { BackButton } from '@/components/ui/BackButton'
import { useToast } from '@/lib/store/useToast'
import styles from './Orders.module.css'

export default function OrdersPage() {
  const showToast = useToast((s) => s.show)

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  const copyResi = (resi: string) => {
    navigator.clipboard.writeText(resi)
    showToast('Nomor resi disalin!', '📋')
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <BackButton label="Kembali ke Beranda" href="/" />

        <header className={styles.header}>
          <h1 className={styles.title}>Riwayat Pesanan</h1>
          <p className={styles.subtitle}>{MOCK_ORDERS.length} pesanan ditemukan</p>
        </header>

        <div className={styles.orderList}>
          {MOCK_ORDERS.map(order => (
            <Link href={`/orders/${order.id}`} key={order.id} className={styles.orderCard}>
              <div className={styles.cardTop}>
                <div className={styles.cardInfo}>
                  <span className={styles.orderNumber}>{order.orderNumber}</span>
                  <span className={styles.orderDate}>{formatDate(order.date)}</span>
                </div>
                <span
                  className={styles.statusBadge}
                  style={{ backgroundColor: `${STATUS_COLORS[order.status]}18`, color: STATUS_COLORS[order.status], borderColor: `${STATUS_COLORS[order.status]}30` }}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              <div className={styles.itemsRow}>
                <div className={styles.thumbs}>
                  {order.items.map((item, i) => (
                    <img key={i} src={item.image} alt={item.name} className={styles.thumb} />
                  ))}
                </div>
                <div className={styles.itemSummary}>
                  <span className={styles.itemNames}>
                    {order.items.map(i => i.name).join(', ')}
                  </span>
                  <span className={styles.itemQty}>
                    {order.items.reduce((sum, i) => sum + i.quantity, 0)} item
                  </span>
                </div>
              </div>

              <div className={styles.cardBottom}>
                <div className={styles.bottomLeft}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
                </div>
                <div className={styles.bottomRight}>
                  {order.trackingNumber && (
                    <button
                      className={styles.resiBtn}
                      onClick={(e) => { e.preventDefault(); copyResi(order.trackingNumber!) }}
                    >
                      <Copy size={14} /> {order.trackingNumber}
                    </button>
                  )}
                  <span className={styles.arrow}><ChevronRight size={18} /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
