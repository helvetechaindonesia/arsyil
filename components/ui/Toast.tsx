'use client'

import React from 'react'
import { X } from 'lucide-react'
import { useToast } from '@/lib/store/useToast'
import styles from './Toast.module.css'

export function Toast() {
  const { message, isVisible, icon, hide } = useToast()

  return (
    <div className={`${styles.toast} ${isVisible ? styles.visible : ''}`}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{message}</span>
      <button className={styles.closeBtn} onClick={hide}>
        <X size={16} />
      </button>
    </div>
  )
}
