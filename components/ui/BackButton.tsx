'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import styles from './BackButton.module.css'

interface BackButtonProps {
  label?: string
  href?: string
}

export function BackButton({ label = 'Kembali', href }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button className={styles.backBtn} onClick={handleClick}>
      <ArrowLeft size={18} />
      <span>{label}</span>
      <kbd className={styles.kbd}>ESC</kbd>
    </button>
  )
}
