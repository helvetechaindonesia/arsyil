'use client'

import React, { useState, useEffect } from 'react'
import { Edit2, Trash2, Plus, Search, Filter, X, Upload, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import styles from './AdminProducts.module.css'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  base_price: number
  is_published: boolean
  category_id: string
  categories?: { name: string, parent_id: string | null }
  product_images?: { url: string, is_primary: boolean }[]
  variants?: { id: string, name: string, stock_quantity: number }[]
}

interface Category {
  id: string
  name: string
  parent_id: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_published: true,
  })
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [variants, setVariants] = useState<{ name: string, stock: number }[]>([
    { name: 'S', stock: 0 },
    { name: 'M', stock: 0 },
    { name: 'L', stock: 0 },
    { name: 'XL', stock: 0 }
  ])

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    // Fetch Products with Relations
    const { data: prodData, error: prodError } = await supabase
      .from('products')
      .select(`
        *,
        categories(name, parent_id),
        product_images(url, is_primary),
        variants(id, name, stock_quantity)
      `)
      .order('created_at', { ascending: false })

    // Fetch Categories for the dropdown
    const { data: catData } = await supabase.from('categories').select('*')

    if (prodError) console.error('Error:', prodError)
    else {
      setProducts(prodData || [])
      setCategories(catData || [])
    }
    setLoading(false)
  }

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', stock: 0 }])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)])
    }
  }

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = form.name.toLowerCase().replace(/\s+/g, '-')
      
      // 1. Insert Product
      const { data: product, error: pError } = await supabase
        .from('products')
        .insert([{
          name: form.name,
          slug,
          description: form.description,
          base_price: parseFloat(form.price),
          category_id: form.category_id,
          is_published: form.is_published
        }])
        .select()
        .single()

      if (pError) throw pError

      // 2. Upload Images & Insert Image Records
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${product.id}/${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName)
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: urlData.publicUrl,
          is_primary: selectedFiles.indexOf(file) === 0
        })
      }

      // 3. Insert Variants
      const variantInserts = variants
        .filter(v => v.name && v.stock >= 0)
        .map(v => ({
          product_id: product.id,
          sku: `${slug}-${v.name.toLowerCase()}-${Math.random().toString(36).substr(2, 4)}`,
          name: v.name,
          stock_quantity: v.stock
        }))
      
      if (variantInserts.length > 0) {
        await supabase.from('variants').insert(variantInserts)
      }

      setIsModalOpen(false)
      fetchData()
      alert('Product created successfully!')
    } catch (err: any) {
      alert('Failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Products</h1>
          <p>Manage inventory, variants, and categories.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Product
        </Button>
      </header>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Total Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants?.reduce((acc, v) => acc + v.stock_quantity, 0) || 0
              const primaryImg = product.product_images?.find(img => img.is_primary)?.url || product.product_images?.[0]?.url
              
              return (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img src={primaryImg || 'https://via.placeholder.com/40'} alt={product.name} />
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productSlug}>{product.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td>{product.categories?.name || '-'}</td>
                  <td>{formatPrice(product.base_price)}</td>
                  <td>{totalStock}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${product.is_published ? styles.badgeActive : styles.badgeDraft}`}>
                      {product.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={styles.actionBtn}><Edit2 size={16} /></button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Complex Product Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            
            <form onSubmit={handleCreateProduct} className={styles.formGrid}>
              <div className={styles.formMain}>
                <div className={styles.formGroup}>
                  <label>Product Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Silk Blouse" />
                </div>
                <div className={styles.formGroup}>
                  <label>Description</label>
                  <textarea rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the product..." />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Base Price (IDR)</label>
                    <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="150000" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Category / Jenis</label>
                    <select required value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Images</label>
                  <div className={styles.fileUpload}>
                    <input type="file" multiple onChange={handleFileChange} accept="image/*" id="file-input" hidden />
                    <label htmlFor="file-input" className={styles.uploadBox}>
                      <Upload size={24} />
                      <span>{selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : 'Click to upload multiple images'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles.formSidebar}>
                <div className={styles.formGroup}>
                  <label>Variants & Stock</label>
                  <div className={styles.variantList}>
                    {variants.map((v, i) => (
                      <div key={i} className={styles.variantRow}>
                        <input placeholder="Size" value={v.name} onChange={e => {
                          const newVariants = [...variants]
                          newVariants[i].name = e.target.value
                          setVariants(newVariants)
                        }} />
                        <input type="number" placeholder="Qty" value={v.stock} onChange={e => {
                          const newVariants = [...variants]
                          newVariants[i].stock = parseInt(e.target.value) || 0
                          setVariants(newVariants)
                        }} />
                      </div>
                    ))}
                    <button type="button" onClick={handleAddVariant} className={styles.addBtn}>+ Add More</button>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>
                    <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} />
                    <span style={{ marginLeft: '0.5rem' }}>Ready to Publish</span>
                  </label>
                </div>

                <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '2rem' }}>
                  {loading ? 'Saving...' : 'Create Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
