'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, Search, User, Menu, X, ChevronDown, Camera, Send, Share2, Play, Bell, Package } from 'lucide-react'
import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import * as Accordion from '@radix-ui/react-accordion'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/Button'
import { CartDrawer } from '../store/CartDrawer'
import { NotificationDrawer } from '../store/NotificationDrawer'
import { useCart } from '@/lib/store/useCart'
import { useAuth } from '@/lib/store/useAuth'
import { CATEGORIES } from '@/lib/data/mock'
import { MOCK_NOTIFICATIONS } from '@/lib/data/mockOrders'
import styles from './Navbar.module.css'

// Remove hardcoded categories

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isLoggedIn, logout, user } = useAuth()
  const [isKategoriOpen, setIsKategoriOpen] = useState(false)
  const items = useCart((state) => state.items)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsKategoriOpen(false)
    }
    
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Left: Logo */}
        <Link href="/" className={styles.logo}>
          ARSYIL<span className={styles.logoAccent}>.</span>
        </Link>
        
        {/* Right Content Group (Now includes Kategori) */}
        <div className={styles.rightContent}>
          {/* Desktop Navigation Group */}
          <nav className={styles.desktopNav}>
            <div 
              className={styles.kategoriTrigger}
              onMouseEnter={() => setIsKategoriOpen(true)}
              onMouseLeave={(e) => {
                // Only close if moving to somewhere that isn't the mega menu
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget?.closest(`.${styles.megaMenuWrapper}`)) {
                  setIsKategoriOpen(false);
                }
              }}
            >
              Kategori <ChevronDown size={14} className={`${styles.chevron} ${isKategoriOpen ? styles.rotated : ''}`} />
            </div>
            
            <div className={styles.actions}>
              
              {isLoggedIn ? (
                <>
                  <NotificationDrawer>
                    <button className={styles.actionBtn} title="Notifikasi">
                      <Bell size={20} />
                      {MOCK_NOTIFICATIONS.filter(n => !n.read).length > 0 && (
                        <span className={styles.notifBadge}>
                          {MOCK_NOTIFICATIONS.filter(n => !n.read).length}
                        </span>
                      )}
                    </button>
                  </NotificationDrawer>
                  <Link href="/orders" className={styles.actionBtn} title="Riwayat Pesanan">
                    <Package size={20} />
                  </Link>
                  <button className={styles.profileBtn} onClick={logout}>
                    <div className={styles.avatar}>{user?.initials || 'U'}</div>
                  </button>
                </>
              ) : (
                <div className={styles.authLinks}>
                  <Link href="/login" className={styles.loginBtn}>Masuk</Link>
                </div>
              )}

              <CartDrawer>
                <button className={styles.cartBtn}>
                  <ShoppingBag size={20} />
                  <span className={styles.cartCount}>{items.length}</span>
                </button>
              </CartDrawer>
            </div>
          </nav>

          <button className={styles.mobileToggle} onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Stable Custom Mega Menu */}
      <AnimatePresence>
        {isKategoriOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={styles.megaMenuWrapper}
            onMouseEnter={() => setIsKategoriOpen(true)}
            onMouseLeave={() => setIsKategoriOpen(false)}
          >
            <div className={styles.megaMenuInner}>
              <div className={styles.megaMenuHeaders}>
                <div className={styles.megaMenuInfo}>
                  <h2 className={styles.megaMenuTitle}>Telusuri Koleksi</h2>
                  <p className={styles.megaMenuDesc}>Temukan produk terbaik dari ARSYIL untuk melengkapi gaya hidup Anda.</p>
                </div>
                <div className={styles.megaMenuGrid}>
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className={styles.megaMenuCol}>
                      <h3 className={styles.megaMenuColHeader}>{cat.name}</h3>
                      <div className={styles.megaMenuLinkList}>
                        {cat.subCategories.length > 0 ? (
                          cat.subCategories.map(sub => (
                            <Link 
                              key={sub} 
                              href={`/catalog?category=${cat.slug}&subcategory=${sub.toLowerCase()}`}
                              className={styles.megaMenuLink}
                              onClick={() => setIsKategoriOpen(false)}
                            >
                              {sub}
                            </Link>
                          ))
                        ) : (
                          <Link 
                            href={`/catalog?category=${cat.slug}`} 
                            className={styles.megaMenuLink}
                            onClick={() => setIsKategoriOpen(false)}
                          >
                            Lihat Semua
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.mobileOverlay}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className={styles.mobileMenu}
            >
              <div className={styles.mobileMenuHeader}>
                <span className={styles.logo}>ARSYIL<span className={styles.logoAccent}>.</span></span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
              </div>
              <div className={styles.mobileSearch}>
                <Search size={18} className={styles.mobileSearchIcon} />
                <input type="text" placeholder="Search products..." />
              </div>
              <Accordion.Root type="single" collapsible className={styles.mobileAccordion}>
                {CATEGORIES.map((cat) => (
                  <Accordion.Item key={cat.name} value={cat.name} className={styles.accordionItem}>
                    <Accordion.Trigger className={styles.accordionTrigger}>
                      {cat.name} <ChevronDown size={18} />
                    </Accordion.Trigger>
                    <Accordion.Content className={styles.accordionContent}>
                      {cat.subCategories.map(item => (
                        <Link 
                          key={item} 
                          href={`/catalog?category=${cat.name.toLowerCase()}`} 
                          className={styles.mobileSubLink}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item}
                        </Link>
                      ))}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
                <Link href="/about" className={styles.accordionTrigger} onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
                {!isLoggedIn ? (
                  <Link href="/login" className={styles.mobileLoginBtn} onClick={() => setIsMobileMenuOpen(false)}>Masuk</Link>
                ) : (
                  <button className={styles.accordionTrigger} onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Logout (Demo)</button>
                )}
              </Accordion.Root>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
