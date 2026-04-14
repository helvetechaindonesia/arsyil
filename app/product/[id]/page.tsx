import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PRODUCTS } from '@/lib/data/mock'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProductDetails } from '@/components/store/ProductDetails'
import { FeaturedProducts } from '@/components/store/FeaturedProducts'
import { BackButton } from '@/components/ui/BackButton'
import styles from './ProductPage.module.css'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const product = PRODUCTS.find((p) => p.id === id || p.slug === id)

  if (!product) {
    notFound()
  }

  return (
    <div className={styles.productPage}>
      <div className="container">
        <BackButton label="Kembali ke Katalog" href="/catalog" />

        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/catalog">Catalog</Link>
          <span>/</span>
          <span className={styles.current}>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          <ProductGallery images={product.images} />
          <ProductDetails product={product} />
        </div>

        <div className={styles.relatedSection}>
          <FeaturedProducts />
        </div>
      </div>
    </div>
  )
}
