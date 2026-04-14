export type OrderStatus = 'waiting_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  image: string
  variant: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  shippingAddress: string
  courier: string
  trackingNumber: string | null
  estimatedArrival: string | null
  timeline: { label: string; date: string; done: boolean }[]
}

export type NotificationType = 'general' | 'admin'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  date: string
  read: boolean
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ord-001',
    orderNumber: '#ARSYIL-20260410-001',
    date: '2026-04-10',
    status: 'delivered',
    items: [
      { productId: '1', name: 'Minimalist Silk Blouse', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400', variant: 'White / M', quantity: 1, price: 1250000 },
      { productId: '3', name: 'Essential Oversized Tee', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400', variant: 'M', quantity: 2, price: 450000 },
    ],
    total: 2150000,
    shippingAddress: 'Jl. Sudirman No. 123, Jakarta Selatan 12190',
    courier: 'JNE Express',
    trackingNumber: 'JNE8234567890123',
    estimatedArrival: '2026-04-13',
    timeline: [
      { label: 'Pesanan Dibuat', date: '10 Apr 2026, 14:30', done: true },
      { label: 'Pembayaran Dikonfirmasi', date: '10 Apr 2026, 14:35', done: true },
      { label: 'Sedang Dikemas', date: '11 Apr 2026, 09:00', done: true },
      { label: 'Dikirim', date: '11 Apr 2026, 16:45', done: true },
      { label: 'Tiba di Tujuan', date: '13 Apr 2026, 10:20', done: true },
    ]
  },
  {
    id: 'ord-002',
    orderNumber: '#ARSYIL-20260412-002',
    date: '2026-04-12',
    status: 'shipped',
    items: [
      { productId: '2', name: 'Urban Leather Totebag', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=400', variant: 'Tan Leather', quantity: 1, price: 3450000 },
    ],
    total: 3450000,
    shippingAddress: 'Jl. Gatot Subroto Kav. 56, Jakarta Selatan 12930',
    courier: 'SiCepat BEST',
    trackingNumber: 'SCP0098765432',
    estimatedArrival: '2026-04-15',
    timeline: [
      { label: 'Pesanan Dibuat', date: '12 Apr 2026, 20:15', done: true },
      { label: 'Pembayaran Dikonfirmasi', date: '12 Apr 2026, 20:20', done: true },
      { label: 'Sedang Dikemas', date: '13 Apr 2026, 08:00', done: true },
      { label: 'Dikirim', date: '13 Apr 2026, 14:00', done: true },
      { label: 'Tiba di Tujuan', date: 'Estimasi 15 Apr 2026', done: false },
    ]
  },
  {
    id: 'ord-003',
    orderNumber: '#ARSYIL-20260413-003',
    date: '2026-04-13',
    status: 'processing',
    items: [
      { productId: '7', name: 'Titanium Smart Watch', image: 'https://images.unsplash.com/photo-1508685096489-77a5ad2ba979?auto=format&fit=crop&q=80&w=400', variant: 'Standard Edition', quantity: 1, price: 12500000 },
    ],
    total: 12500000,
    shippingAddress: 'Jl. Thamrin No. 88, Jakarta Pusat 10350',
    courier: 'J&T Express',
    trackingNumber: null,
    estimatedArrival: null,
    timeline: [
      { label: 'Pesanan Dibuat', date: '13 Apr 2026, 08:30', done: true },
      { label: 'Pembayaran Dikonfirmasi', date: '13 Apr 2026, 08:35', done: true },
      { label: 'Sedang Dikemas', date: 'Menunggu...', done: false },
      { label: 'Dikirim', date: '-', done: false },
      { label: 'Tiba di Tujuan', date: '-', done: false },
    ]
  },
  {
    id: 'ord-004',
    orderNumber: '#ARSYIL-20260413-004',
    date: '2026-04-13',
    status: 'waiting_payment',
    items: [
      { productId: '10', name: 'Aero Wireless Headset', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400', variant: 'Graphite', quantity: 1, price: 5200000 },
    ],
    total: 5200000,
    shippingAddress: 'Jl. Kebon Jeruk Raya No. 45, Jakarta Barat 11530',
    courier: 'JNE REG',
    trackingNumber: null,
    estimatedArrival: null,
    timeline: [
      { label: 'Pesanan Dibuat', date: '13 Apr 2026, 09:00', done: true },
      { label: 'Pembayaran Dikonfirmasi', date: 'Menunggu pembayaran...', done: false },
      { label: 'Sedang Dikemas', date: '-', done: false },
      { label: 'Dikirim', date: '-', done: false },
      { label: 'Tiba di Tujuan', date: '-', done: false },
    ]
  }
]

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'general',
    title: 'Pesanan Dikirim! 🚚',
    message: 'Pesanan #ARSYIL-20260412-002 sedang dalam perjalanan. Estimasi tiba 15 April.',
    date: '2026-04-13T14:00:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'admin',
    title: 'Hai dari Tim ARSYIL 👋',
    message: 'Terima kasih sudah menjadi pelanggan setia! Nikmati diskon 15% untuk pembelian berikutnya dengan kode ARSYIL15.',
    date: '2026-04-12T10:00:00',
    read: false,
  },
  {
    id: 'n3',
    type: 'general',
    title: 'Flash Sale Dimulai! 🔥',
    message: 'Diskon hingga 50% untuk koleksi Lifestyle. Berlaku hingga 15 April 2026.',
    date: '2026-04-11T08:00:00',
    read: true,
  },
  {
    id: 'n4',
    type: 'general',
    title: 'Pesanan Selesai ✅',
    message: 'Pesanan #ARSYIL-20260410-001 telah sampai di tujuan. Jangan lupa berikan review!',
    date: '2026-04-13T10:20:00',
    read: false,
  },
  {
    id: 'n5',
    type: 'admin',
    title: 'Koleksi Baru Telah Tiba ✨',
    message: 'Koleksi Spring/Summer 2026 sudah tersedia! Jadilah yang pertama memiliki item eksklusif ini.',
    date: '2026-04-10T12:00:00',
    read: true,
  },
  {
    id: 'n6',
    type: 'admin',
    title: 'Verifikasi Alamat Anda',
    message: 'Mohon verifikasi alamat pengiriman Anda untuk memastikan pesanan sampai dengan tepat.',
    date: '2026-04-09T15:30:00',
    read: true,
  }
]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  waiting_payment: 'Menunggu Pembayaran',
  processing: 'Sedang Diproses',
  shipped: 'Dalam Pengiriman',
  delivered: 'Selesai',
  cancelled: 'Dibatalkan'
}

export const STATUS_COLORS: Record<OrderStatus, string> = {
  waiting_payment: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444'
}
