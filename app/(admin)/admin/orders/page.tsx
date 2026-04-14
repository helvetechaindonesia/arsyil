'use client'

import React from 'react'
import { Eye, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import styles from './AdminOrders.module.css'

const MOCK_ORDERS = [
  { id: 'ORD-77129', customer: 'John Doe', total: 1275000, status: 'Processing', date: '2026-04-12' },
  { id: 'ORD-77128', customer: 'Jane Smith', total: 3450000, status: 'Shipped', date: '2026-04-11' },
  { id: 'ORD-77127', customer: 'Robert Fox', total: 890000, status: 'Delivered', date: '2026-04-10' },
  { id: 'ORD-77126', customer: 'Sarah Wilson', total: 5200000, status: 'Processing', date: '2026-04-10' },
  { id: 'ORD-77125', customer: 'Michael Chen', total: 450000, status: 'Cancelled', date: '2026-04-09' }
]

export default function AdminOrdersPage() {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock size={14} />
      case 'Shipped': return <Truck size={14} />
      case 'Delivered': return <CheckCircle size={14} />
      case 'Cancelled': return <AlertCircle size={14} />
      default: return null
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Orders</h1>
          <p>Track and manage customer orders.</p>
        </div>
      </header>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_ORDERS.map((order) => (
              <tr key={order.id}>
                <td className={styles.orderId}>{order.id}</td>
                <td className={styles.customerName}>{order.customer}</td>
                <td>{order.date}</td>
                <td>{formatPrice(order.total)}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles['status' + order.status]}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td>
                  <Button variant="outline" size="sm">
                    <Eye size={16} /> View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
