import React from 'react'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { Camera, Send, Share2, Play, ChevronDown } from 'lucide-react'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.logo}>
              ARSYIL<span className={styles.logoAccent}>.</span>
            </Link>
            <p className={styles.brandDesc}>
              Defining the future of minimalist luxury. Crafted for those who appreciate the finer details.
            </p>
            <div className={styles.socials}>
              <Link href="#"><Camera size={20} /></Link>
              <Link href="#"><Send size={20} /></Link>
              <Link href="#"><Share2 size={20} /></Link>
              <Link href="#"><Play size={20} /></Link>
            </div>
          </div>

          {/* Links - Desktop Grid / Mobile Accordion */}
          <div className={styles.desktopOnly}>
            <div className={styles.linksSection}>
              <h4 className={styles.title}>Shop</h4>
              <ul className={styles.list}>
                <li><Link href="/">New Arrivals</Link></li>
                <li><Link href="/">Best Sellers</Link></li>
                <li><Link href="/">Collections</Link></li>
                <li><Link href="/">Sale</Link></li>
              </ul>
            </div>

            <div className={styles.linksSection}>
              <h4 className={styles.title}>Support</h4>
              <ul className={styles.list}>
                <li><Link href="/">Order Tracking</Link></li>
                <li><Link href="/">Returns & Exchanges</Link></li>
                <li><Link href="/">Shipping Info</Link></li>
                <li><Link href="/">FAQs</Link></li>
              </ul>
            </div>
          </div>

          <div className={styles.mobileOnly}>
            <Accordion.Root type="single" collapsible className={styles.footerAccordion}>
              <Accordion.Item value="shop" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Shop <ChevronDown size={16} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                   <ul className={styles.list}>
                    <li><Link href="/">New Arrivals</Link></li>
                    <li><Link href="/">Best Sellers</Link></li>
                    <li><Link href="/">Collections</Link></li>
                    <li><Link href="/">Sale</Link></li>
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="support" className={styles.accordionItem}>
                <Accordion.Trigger className={styles.accordionTrigger}>
                  Support <ChevronDown size={16} />
                </Accordion.Trigger>
                <Accordion.Content className={styles.accordionContent}>
                   <ul className={styles.list}>
                    <li><Link href="/">Order Tracking</Link></li>
                    <li><Link href="/">Returns & Exchanges</Link></li>
                    <li><Link href="/">Shipping Info</Link></li>
                    <li><Link href="/">FAQs</Link></li>
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterSection}>
            <h4 className={styles.title}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>Subscribe to receive first access to new drops and private sales.</p>
            <form className={styles.form}>
              <input type="email" placeholder="email@example.com" className={styles.input} />
              <button type="submit" className={styles.submitBtn}>Join</button>
            </form>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 ARSYIL. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link href="/">Privacy Policy</Link>
            <Link href="/">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
