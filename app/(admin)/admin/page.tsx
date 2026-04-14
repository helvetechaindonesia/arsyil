import React from 'react'
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import styles from './Dashboard.module.css'

const stats = [
  { name: 'Total Revenue', value: '$45,231.89', icon: DollarSign, trend: '+20.1% from last month' },
  { name: 'Total Orders', value: '+2,350', icon: ShoppingBag, trend: '+180.1% from last month' },
  { name: 'Active Customers', value: '+12,234', icon: Users, trend: '+19% from last month' },
  { name: 'Conversion Rate', value: '3.2%', icon: TrendingUp, trend: '+2.4% from last month' },
]

export default function AdminDashboardPage() {
  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.statName}>{stat.name}</span>
              <stat.icon size={16} className={styles.icon} />
            </div>
            <div className={styles.cardContent}>
              <div className={styles.value}>{stat.value}</div>
              <p className={styles.trend}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentActivity}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.statName}>Recent Orders</span>
          </div>
          <div className={styles.activityList}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityInfo}>
                  <p className={styles.customerName}>Customer #{i}</p>
                  <p className={styles.orderDetail}>Ordered Minimalist Silk Blouse</p>
                </div>
                <div className={styles.activityPrice}>$120.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
