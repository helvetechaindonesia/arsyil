import React from 'react'
import { Sidebar } from '@/components/admin/Sidebar'
import styles from './AdminLayout.module.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.adminLayout}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <header className={styles.adminHeader}>
          <div className={styles.headerContent}>
            <h2>Dashboard Overview</h2>
            <div className={styles.userProfile}>
              <span>Admin User</span>
              <div className={styles.avatar}>A</div>
            </div>
          </div>
        </header>
        <main className={styles.adminMain}>
          {children}
        </main>
      </div>
    </div>
  )
}
