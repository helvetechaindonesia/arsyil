'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Layout, Smartphone, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/lib/store/useAuth'
import styles from './AuthSlider.module.css'

interface AuthSliderProps {
  initialMode?: 'login' | 'register'
}

const SLIDE_DURATION = 3000 // 3s — matches CSS

export function AuthSlider({ initialMode = 'login' }: AuthSliderProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [formContent, setFormContent] = useState<'login' | 'register'>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const router = useRouter()
  const pathname = usePathname()
  const { login } = useAuth()

  useEffect(() => {
    const target = pathname.includes('register') ? 'register' : 'login'
    setMode(target)
    setFormContent(target)
  }, [pathname])

  const toggleMode = () => {
    const newMode = mode === 'login' ? 'register' : 'login'
    setMode(newMode) // triggers slide immediately
    window.history.replaceState(null, '', `/${newMode}`)

    // Swap form content at the midpoint (form is passing over the center)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setFormContent(newMode)
    }, SLIDE_DURATION / 2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formContent === 'register' && (!name || !email || !password)) return
    if (formContent === 'login' && (!email || !password)) return
    login(email)
    router.push('/')
  }

  const isRegister = mode === 'register'

  return (
    <div className={styles.authSlider}>
      <Link href="/" className={styles.backHome}>
        <ArrowLeft size={18} /> Back to Store
      </Link>

      {/* ===== STATIC BACKGROUND: 2 images side by side, never moves ===== */}
      <div className={styles.bgSplit}>
        {/* Left half: Login image (visible when form is on the right) */}
        <div className={styles.bgHalf}>
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=1200"
            alt="ARSYIL Minimalist Style"
            className={styles.bgImage}
          />
          <div className={styles.bgOverlay}>
            <div className={styles.branding}>
              <h2>Essential<br />Minimalism.</h2>
              <p>Step into a world where quality meets clarity. Explore timeless designs.</p>
            </div>
          </div>
        </div>

        {/* Right half: Register image (visible when form slides to the left) */}
        <div className={styles.bgHalf}>
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200"
            alt="Join ARSYIL"
            className={styles.bgImage}
          />
          <div className={styles.bgOverlay}>
            <div className={styles.branding}>
              <h2>Join the<br />Circle.</h2>
              <p>Create an account to track orders and receive exclusive early access.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FORM PANEL: slides on top of the background ===== */}
      <div className={`${styles.formPanel} ${isRegister ? styles.toLeft : ''}`}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1>{formContent === 'login' ? 'Selamat Datang.' : 'Buat Akun.'}</h1>
            <p>{formContent === 'login' ? 'Masuk ke akun ARSYIL Anda.' : 'Jadilah bagian dari komunitas ARSYIL.'}</p>
          </div>
          <form onSubmit={handleSubmit}>
            {formContent === 'register' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={18} />
                  <input type="text" className={styles.input} placeholder="John Doe" required value={name} onChange={e => setName(e.target.value)} />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input type="email" className={styles.input} placeholder="name@email.com" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={18} />
                <input type={showPassword ? "text" : "password"} className={styles.input} placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" className={styles.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {formContent === 'login' && (
              <div className={styles.options}>
                <label className={styles.checkboxLabel}><input type="checkbox" /> Ingat saya</label>
                <button type="button" className={styles.forgotLink}>Lupa Password?</button>
              </div>
            )}

            <Button type="submit" className={styles.submitBtn}>
              {formContent === 'login' ? 'Sign In' : 'Daftar Sekarang'}
            </Button>

            {formContent === 'login' && (
              <>
                <div className={styles.divider}><span>Atau</span></div>
                <div className={styles.socialGrid}>
                  <button type="button" className={styles.socialBtn}><Layout size={18} /> Google</button>
                  <button type="button" className={styles.socialBtn}><Smartphone size={18} /> Apple</button>
                </div>
              </>
            )}

            <div className={styles.footer}>
              {formContent === 'login'
                ? <>Belum punya akun? <button type="button" onClick={toggleMode} className={styles.switchBtn}>Daftar Sekarang</button></>
                : <>Sudah punya akun? <button type="button" onClick={toggleMode} className={styles.switchBtn}>Masuk Disini</button></>
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
