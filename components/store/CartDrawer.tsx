'use client'

import React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/useCart'
import { Button } from '../ui/Button'
import styles from './CartDrawer.module.css'

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, getTotal } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {children}
      </Dialog.Trigger>
      
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} asChild>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className={styles.inner}>
              <header className={styles.header}>
                <div className={styles.titleInfo}>
                  <Dialog.Title className={styles.title}>Your Cart</Dialog.Title>
                  <span className={styles.count}>{items.length} items</span>
                </div>
                <Dialog.Close className={styles.closeBtn}>
                  <X size={24} />
                </Dialog.Close>
              </header>

              <div className={styles.itemsWrapper}>
                {items.length === 0 ? (
                  <div className={styles.empty}>
                    <ShoppingBag size={48} />
                    <p>Your cart is empty</p>
                    <Dialog.Close asChild>
                      <Button variant="outline">Start Shopping</Button>
                    </Dialog.Close>
                  </div>
                ) : (
                  <div className={styles.itemsList}>
                    {items.map((item) => (
                      <div key={item.id} className={styles.item}>
                        <div className={styles.itemImage}>
                          <img src={item.image} alt={item.name} />
                        </div>
                        <div className={styles.itemInfo}>
                          <div className={styles.itemHeader}>
                            <h4 className={styles.itemName}>{item.name}</h4>
                            <button 
                              className={styles.removeBtn}
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className={styles.itemVariant}>{item.variant}</p>
                          <div className={styles.itemFooter}>
                            <div className={styles.quantity}>
                              <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                            <span className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {items.length > 0 && (
                <footer className={styles.footer}>
                  <div className={styles.totals}>
                    <span>Subtotal</span>
                    <span className={styles.totalAmount}>{formatPrice(getTotal())}</span>
                  </div>
                  <p className={styles.taxes}>Shipping and taxes calculated at checkout.</p>
                  <Link href="/checkout" className={styles.checkoutLink}>
                    <Button size="lg" className={styles.checkoutBtn}>
                      Checkout <ArrowRight size={20} />
                    </Button>
                  </Link>
                </footer>
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
