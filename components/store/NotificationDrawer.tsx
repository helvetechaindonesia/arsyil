'use client'

import React, { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Bell, MessageCircle, Megaphone } from 'lucide-react'
import { MOCK_NOTIFICATIONS } from '@/lib/data/mockOrders'
import type { NotificationType } from '@/lib/data/mockOrders'
import styles from './NotificationDrawer.module.css'

export function NotificationDrawer({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all')
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)

  const filtered = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHrs < 1) return 'Baru saja'
    if (diffHrs < 24) return `${diffHrs} jam lalu`
    const diffDays = Math.floor(diffHrs / 24)
    if (diffDays < 7) return `${diffDays} hari lalu`
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.inner}>
            <header className={styles.header}>
              <div className={styles.titleRow}>
                <Dialog.Title className={styles.title}>Notifikasi</Dialog.Title>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllRead}>
                    Tandai semua dibaca
                  </button>
                )}
              </div>
              <Dialog.Close className={styles.closeBtn}><X size={22} /></Dialog.Close>
            </header>

            <div className={styles.tabs}>
              <button 
                className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Semua ({notifications.length})
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('general')}
              >
                <Megaphone size={14} /> Umum
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'admin' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <MessageCircle size={14} /> Pesan Admin
              </button>
            </div>

            <div className={styles.list}>
              {filtered.length === 0 ? (
                <div className={styles.empty}>
                  <Bell size={40} />
                  <p>Tidak ada notifikasi</p>
                </div>
              ) : (
                filtered.map(n => (
                  <button
                    key={n.id}
                    className={`${styles.item} ${!n.read ? styles.unread : ''}`}
                    onClick={() => markAsRead(n.id)}
                  >
                    <div className={styles.itemIcon}>
                      {n.type === 'admin' ? <MessageCircle size={18} /> : <Megaphone size={18} />}
                    </div>
                    <div className={styles.itemContent}>
                      <h4 className={styles.itemTitle}>{n.title}</h4>
                      <p className={styles.itemMsg}>{n.message}</p>
                      <span className={styles.itemDate}>{formatDate(n.date)}</span>
                    </div>
                    {!n.read && <span className={styles.dot} />}
                  </button>
                ))
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
