import { create } from 'zustand'

interface ToastState {
  message: string
  isVisible: boolean
  icon?: string
  show: (message: string, icon?: string) => void
  hide: () => void
}

export const useToast = create<ToastState>((set) => ({
  message: '',
  isVisible: false,
  icon: undefined,
  show: (message, icon) => {
    set({ message, isVisible: true, icon })
    setTimeout(() => set({ isVisible: false }), 3000)
  },
  hide: () => set({ isVisible: false }),
}))
