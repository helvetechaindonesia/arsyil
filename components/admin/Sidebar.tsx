'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  BarChart3,
  LogOut,
  Monitor,
  ShieldCheck,
  Camera
} from 'lucide-react'
import styles from './Sidebar.module.css'

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'CMS', icon: Monitor, href: '/admin/cms' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Administration', icon: ShieldCheck, href: '/admin/administration' },
  { name: 'Lookbook', icon: Camera, href: '/admin/lookbook' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoSection}>
        <Link href="/" className={styles.logo}>
          ARSYIL<span className={styles.logoAccent}>.</span>
        </Link>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
