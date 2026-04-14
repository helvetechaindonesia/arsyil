'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronRight, CheckCircle2, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store/useCart'
import { Button } from '@/components/ui/Button'
import styles from './Checkout.module.css'

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const { items, getTotal, clearCart } = useCart()

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (step === 4) {
    return (
      <div className={styles.successPage}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={styles.successContent}
        >
          <CheckCircle2 size={80} className={styles.successIcon} />
          <h1>Order Placed Successfully!</h1>
          <p>Thank you for shopping with ARSYIL. Your order #77129 is being processed.</p>
          <Link href="/">
            <Button size="lg" onClick={() => clearCart()}>Return to Home</Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.main}>
            {/* Steps Indicator */}
            <div className={styles.steps}>
              <div className={`${styles.step} ${step >= 1 ? styles.activeStep : ''}`}>1. Shipping</div>
              <ChevronRight size={16} />
              <div className={`${styles.step} ${step >= 2 ? styles.activeStep : ''}`}>2. Payment</div>
              <ChevronRight size={16} />
              <div className={`${styles.step} ${step >= 3 ? styles.activeStep : ''}`}>3. Confirm</div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section 
                  key="shipping"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className={styles.section}
                >
                  <h2>Shipping Information</h2>
                  <div className={styles.form}>
                    <div className={styles.formRow}>
                      <input type="text" placeholder="First Name" />
                      <input type="text" placeholder="Last Name" />
                    </div>
                    <input type="email" placeholder="Email Address" />
                    <input type="text" placeholder="Address" />
                    <div className={styles.formRow}>
                      <input type="text" placeholder="City" />
                      <input type="text" placeholder="Postal Code" />
                    </div>
                    <Button size="lg" onClick={() => setStep(2)}>Continue to Payment</Button>
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section 
                  key="payment"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className={styles.section}
                >
                  <h2>Payment Method</h2>
                  <div className={styles.paymentOptions}>
                    <div className={styles.paymentOption}>
                      <input type="radio" name="payment" id="cc" defaultChecked />
                      <label htmlFor="cc">
                        <CreditCard size={20} />
                        <div>
                          <p className={styles.optTitle}>Credit Card / Debit</p>
                          <p className={styles.optDesc}>Visa, Mastercard, etc.</p>
                        </div>
                      </label>
                    </div>
                    <div className={styles.paymentOption}>
                      <input type="radio" name="payment" id="midtrans" />
                      <label htmlFor="midtrans">
                        <Truck size={20} />
                        <div>
                          <p className={styles.optTitle}>Bank Transfer (Midtrans)</p>
                          <p className={styles.optDesc}>BCA, Mandiri, BNI</p>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={() => setStep(3)}>Review Order</Button>
                  </div>
                </motion.section>
              )}

              {step === 3 && (
                <motion.section 
                  key="confirm"
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className={styles.section}
                >
                  <h2>Confirm Order</h2>
                  <p>Please review your details before placing the order.</p>
                  <div className={styles.confirmBox}>
                    <div className={styles.confirmItem}>
                      <strong>Shipping to:</strong>
                      <p>John Doe, JL. Senopati No. 12, Jakarta, 12190</p>
                    </div>
                    <div className={styles.confirmItem}>
                      <strong>Payment:</strong>
                      <p>Credit Card ending in 4242</p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button onClick={() => setStep(4)}>Place Order - {formatPrice(getTotal() + 25000)}</Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <aside className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.summaryItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemInfo}>
                      <span className={styles.summaryItemQty}>{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryTotals}>
                <div className={styles.sumRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
                <div className={styles.sumRow}>
                  <span>Shipping Fee</span>
                  <span>Rp 25.000</span>
                </div>
                <div className={`${styles.sumRow} ${styles.grandTotal}`}>
                  <span>Total</span>
                  <span>{formatPrice(getTotal() + 25000)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
