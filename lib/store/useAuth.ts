import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isLoggedIn: boolean
  user: {
    name: string
    email: string
    initials: string
  } | null
  login: (email: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (email) => set({ 
        isLoggedIn: true, 
        user: { 
          name: email.split('@')[0], 
          email: email,
          initials: email.charAt(0).toUpperCase()
        } 
      }),
      logout: () => set({ isLoggedIn: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
