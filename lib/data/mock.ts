export interface Variant {
  id: string
  name: string
  stock: number
  priceAdjustment?: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  subCategory: string
  images: string[]
  isNew?: boolean
  isFeatured?: boolean
  variants: Variant[]
  specs?: Record<string, string>
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  subCategories: string[]
}

export interface LookbookCollection {
  id: string
  title: string
  subtitle: string
  heroImage: string
  productIds: string[]
}

export const CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Daster',
    slug: 'daster',
    description: 'Koleksi daster nyaman untuk sehari-hari.',
    image: '',
    subCategories: ['Daster Pendek', 'Daster Panjang', 'Kaftan']
  },
  {
    id: '2',
    name: 'Busana Muslim',
    slug: 'busana-muslim',
    description: 'Pakaian muslim berkualitas untuk pria dan wanita.',
    image: '',
    subCategories: ['Sarung', 'Baju Koko', 'Wanita']
  },
  {
    id: '3',
    name: 'Celana',
    slug: 'celana',
    description: 'Pilihan celana untuk berbagai aktivitas.',
    image: '',
    subCategories: ['Pria', 'Wanita', 'Unisex']
  },
  {
    id: '4',
    name: 'Batik',
    slug: 'batik',
    description: 'Kekayaan budaya Indonesia dalam balutan busana.',
    image: '',
    subCategories: ['Kemeja Batik', 'Tunik Batik', 'Kain Batik']
  },
  {
    id: '5',
    name: 'Tas',
    slug: 'tas',
    description: 'Aksesori tas untuk melengkapi gaya Anda.',
    image: '',
    subCategories: ['Totebag', 'Ransel', 'Clutch']
  },
  {
    id: '6',
    name: 'Sepatu',
    slug: 'sepatu',
    description: 'Alas kaki berkualitas dengan desain modern.',
    image: '',
    subCategories: ['Sneakers', 'Flat Shoes', 'Sandals']
  }
]

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Minimalist Silk Blouse',
    slug: 'minimalist-silk-blouse',
    description: 'A luxurious silk blouse with a fluid silhouette and refined details. Perfect for both office and evening.',
    price: 1250000,
    category: 'Apparel',
    subCategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
    ],
    isNew: true,
    isFeatured: true,
    variants: [
      { id: 'v1-s', name: 'White / S', stock: 12 },
      { id: 'v1-m', name: 'White / M', stock: 8 },
      { id: 'v1-l', name: 'White / L', stock: 5 },
      { id: 'v1-bl-s', name: 'Black / S', stock: 10 }
    ],
    specs: { 'Material': '100% Mulberry Silk', 'Origin': 'Italy', 'Care': 'Dry clean only' }
  },
  {
    id: '2',
    name: 'Urban Leather Totebag',
    slug: 'urban-leather-totebag',
    description: 'Spacious and structured, this totebag is crafted from premium vegetable-tanned leather that patinas beautifully over time.',
    price: 3450000,
    category: 'Accessories',
    subCategory: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800'
    ],
    isFeatured: true,
    variants: [
      { id: 'v2-tan', name: 'Tan Leather', stock: 4 },
      { id: 'v2-blk', name: 'Black Leather', stock: 7 }
    ],
    specs: { 'Material': 'Full-grain Leather', 'Dimensions': '40cm x 35cm x 15cm' }
  },
  {
    id: '3',
    name: 'Essential Oversized Tee',
    slug: 'essential-oversized-tee',
    description: 'The perfect heavy-weight cotton tee with a dropped shoulder and structured fit.',
    price: 450000,
    category: 'Apparel',
    subCategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
    ],
    isNew: true,
    isFeatured: true,
    variants: [
      { id: 'v3-s', name: 'S', stock: 25 },
      { id: 'v3-m', name: 'M', stock: 40 },
      { id: 'v3-l', name: 'L', stock: 35 }
    ]
  },
  {
    id: '4',
    name: 'Sculptural Gold Earring',
    slug: 'sculptural-gold-earring',
    description: 'Modern, architectural earrings cast in 18k gold-plated brass. A statement in minimalist design.',
    price: 890000,
    category: 'Accessories',
    subCategory: 'Jewelry',
    images: [
      'https://images.unsplash.com/photo-1630019058353-5bf3f191d4e7?auto=format&fit=crop&q=80&w=800'
    ],
    isFeatured: true,
    variants: [
      { id: 'v4-gold', name: '18k Gold Plated', stock: 15 }
    ]
  },
  {
    id: '5',
    name: 'Technical Shell Jacket',
    slug: 'technical-shell-jacket',
    description: 'Waterproof, breathable outerwear for the modern explorer. Minimalist aesthetic meets maximum performance.',
    price: 4950000,
    category: 'Apparel',
    subCategory: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=800'
    ],
    isNew: true,
    variants: [
      { id: 'v5-m', name: 'M', stock: 6 },
      { id: 'v5-l', name: 'L', stock: 8 }
    ]
  },
  {
    id: '6',
    name: 'Premium Wool Overcoat',
    slug: 'premium-wool-overcoat',
    description: 'A classic staple for cold seasons. Made from ethically sourced merino wool blend.',
    price: 7800000,
    category: 'Apparel',
    subCategory: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=800'
    ],
    variants: [
      { id: 'v6-m', name: 'Mid Grey / M', stock: 3 },
      { id: 'v6-l', name: 'Mid Grey / L', stock: 2 }
    ]
  },
  {
    id: '7',
    name: 'Titanium Smart Watch',
    slug: 'titanium-smart-watch',
    description: 'The intersection of high-watchmaking and cutting-edge tech. Aerospace-grade titanium body.',
    price: 12500000,
    category: 'Lifestyle',
    subCategory: 'Tech',
    images: [
      'https://images.unsplash.com/photo-1508685096489-77a5ad2ba979?auto=format&fit=crop&q=80&w=800'
    ],
    isNew: true,
    variants: [
      { id: 'v7-std', name: 'Standard Edition', stock: 5 }
    ]
  },
  {
    id: '8',
    name: 'Minimalist Walnut Desk',
    slug: 'walnut-desk',
    description: 'Handcrafted solid walnut desk with integrated cable management.',
    price: 15900000,
    category: 'Lifestyle',
    subCategory: 'Home',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800'
    ],
    variants: [
      { id: 'v8-std', name: '160cm x 80cm', stock: 2 }
    ]
  },
  {
    id: '9',
    name: 'Ceramic Pour-Over Set',
    slug: 'ceramic-pourover',
    description: 'Elevate your morning ritual. Handmade matte ceramic pour-over and carafe.',
    price: 950000,
    category: 'Lifestyle',
    subCategory: 'Home',
    images: [
      'https://images.unsplash.com/photo-1544650039-22886fbb4323?auto=format&fit=crop&q=80&w=800'
    ],
    variants: [
      { id: 'v9-wht', name: 'Matte White', stock: 15 },
      { id: 'v9-blk', name: 'Matte Black', stock: 12 }
    ]
  },
  {
    id: '10',
    name: 'Aero Wireless Headset',
    slug: 'aero-headset',
    description: 'Lossless audio in a breathtaking minimalist design. 40-hour battery life.',
    price: 5200000,
    category: 'Lifestyle',
    subCategory: 'Tech',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    ],
    isFeatured: true,
    variants: [
      { id: 'v10-slv', name: 'Silver', stock: 10 },
      { id: 'v10-grph', name: 'Graphite', stock: 8 }
    ]
  }
]

export const LOOKBOOK_COLLECTIONS: LookbookCollection[] = [
  {
    id: 'nongkrong-funky',
    title: 'Nongkrong Funky',
    subtitle: 'Elevated streetwear for urban weekends. Minimalist edges meets functional casuals.',
    heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000',
    productIds: ['2', '3', '4', '10']
  },
  {
    id: 'modern-executive',
    title: 'Modern Executive',
    subtitle: 'A symphony of silk and leather. Defining the new standard for professional elegance.',
    heroImage: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=2000',
    productIds: ['1', '2', '7']
  },
  {
    id: 'minimalist-living',
    title: 'Pure Living',
    subtitle: 'Transform your space into a sanctuary of clarity and refined materials.',
    heroImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=2000',
    productIds: ['8', '9', '10']
  }
]
