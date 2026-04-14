'use client'

import React, { use } from 'react'
import Link from 'next/link'
import { Copy, Package, MapPin, Truck, Check, Clock } from 'lucide-react'
import { MOCK_ORDERS, STATUS_LABELS, STATUS_COLORS } from '@/lib/data/mockOrders'
import { BackButton } from '@/components/ui/BackButton'
import { useToast } from '@/lib/store/useToast'
import { notFound } from 'next/navigation'
import styles from './OrderDetail.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const order = MOCK_ORDERS.find(o => o.id === id)
  const showToast = useToast((s) => s.show)

  if (!order) notFound()

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)

  const copyResi = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
      showToast('Nomor resi disalin!', '📋')
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <BackButton label="Kembali ke Riwayat" href="/orders" />

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>{order.orderNumber}</h1>
            <span
              className={styles.statusBadge}
              style={{ backgroundColor: `${STATUS_COLORS[order.status]}18`, color: STATUS_COLORS[order.status], borderColor: `${STATUS_COLORS[order.status]}30` }}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className={styles.orderDate}>
            {new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </header>

        <div className={styles.grid}>
          {/* Left: Timeline */}
          <section className={styles.timelineSection}>
            <h2 className={styles.sectionTitle}>Status Pengiriman</h2>
            <div className={styles.timeline}>
              {order.timeline.map((step, i) => (
                <div key={i} className={`${styles.step} ${step.done ? styles.done : ''}`}>
                  <div className={styles.stepDot}>
                    {step.done ? <Check size={12} /> : <Clock size={12} />}
                  </div>
                  {i < order.timeline.length - 1 && <div className={styles.stepLine} />}
                  <div className={styles.stepContent}>
                    <span className={styles.stepLabel}>{step.label}</span>
                    <span className={styles.stepDate}>{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Info */}
          <div className={styles.infoColumn}>
            {/* Tracking Info */}
            {order.trackingNumber && (
              <section className={styles.infoCard}>
                <h3 className={styles.infoTitle}><Truck size={16} /> Info Pengiriman</h3>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Kurir</span>
                  <span className={styles.infoValue}>{order.courier}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Nomor Resi</span>
                  <button className={styles.resiCopy} onClick={copyResi}>
                    {order.trackingNumber} <Copy size={14} />
                  </button>
                </div>
                {order.estimatedArrival && (
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Estimasi Tiba</span>
                    <span className={styles.infoValue}>
                      {new Date(order.estimatedArrival).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </section>
            )}

            {/* Shipping Address */}
            <section className={styles.infoCard}>
              <h3 className={styles.infoTitle}><MapPin size={16} /> Alamat Pengiriman</h3>
              <p className={styles.address}>{order.shippingAddress}</p>
            </section>

            {/* Items */}
            <section className={styles.infoCard}>
              <h3 className={styles.infoTitle}><Package size={16} /> Item Pesanan</h3>
              <div className={styles.itemList}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <img src={item.image} alt={item.name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemVariant}>{item.variant} × {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.totalRow}>
                <span>Total Pesanan</span>
                <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
