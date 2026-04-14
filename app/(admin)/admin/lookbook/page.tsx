'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Camera, Package, Save, Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import styles from '../Dashboard.module.css'

interface Lookbook {
  id: string
  title: string
  subtitle: string
  image_url: string
  is_active: boolean
  products?: { id: string, name: string }[]
}

interface MiniProduct {
  id: string
  name: string
  slug: string
}

export default function AdminLookbookPage() {
  const [lookbooks, setLookbooks] = useState<Lookbook[]>([])
  const [allProducts, setAllProducts] = useState<MiniProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    is_active: true
  })
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    const { data: lbData } = await supabase
      .from('lookbooks')
      .select(`
        *,
        lookbook_products(products(id, name))
      `)
      .order('created_at', { ascending: false })

    const { data: prodData } = await supabase
      .from('products')
      .select('id, name, slug')
      .order('name')

    if (lbData) {
      const formatted = lbData.map((lb: any) => ({
        ...lb,
        products: lb.lookbook_products.map((p: any) => p.products)
      }))
      setLookbooks(formatted)
    }
    if (prodData) setAllProducts(prodData)
    setLoading(false)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `lookbooks/${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName)
      setForm({ ...form, image_url: urlData.publicUrl })
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSaveLookbook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image_url) return alert('Please upload a hero image')

    setLoading(true)
    try {
      // 1. Insert Lookbook
      const { data: lb, error: lbError } = await supabase
        .from('lookbooks')
        .insert([form])
        .select()
        .single()

      if (lbError) throw lbError

      // 2. Insert Junctions
      if (selectedProductIds.length > 0) {
        const junctions = selectedProductIds.map(pid => ({
          lookbook_id: lb.id,
          product_id: pid
        }))
        await supabase.from('lookbook_products').insert(junctions)
      }

      setIsModalOpen(false)
      fetchData()
      setForm({ title: '', subtitle: '', image_url: '', is_active: true })
      setSelectedProductIds([])
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lookbook scene?')) return
    await supabase.from('lookbooks').delete().eq('id', id)
    fetchData()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Lookbook Manager</h1>
          <p>Create lifestyle scenes and tag associated products.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Look Scene
        </Button>
      </header>

      <div className={styles.grid}>
        {lookbooks.map((lb) => (
          <div key={lb.id} className={styles.card} style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', padding: '0' }}>
            <div style={{ position: 'relative', height: '100%', minHeight: '300px' }}>
              <img src={lb.image_url} alt={lb.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button onClick={() => handleDelete(lb.id)} style={{ background: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', color: '#ff4d4f' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.3rem' }}>{lb.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>{lb.subtitle}</p>
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.8rem' }}>
                  Tagged Products
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {lb.products?.map(p => (
                    <span key={p.id} style={{ background: '#f5f5f5', padding: '0.4rem 0.8rem', borderRadius: '0.4rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Package size={14} /> {p.name}
                    </span>
                  ))}
                  {(!lb.products || lb.products.length === 0) && (
                    <span style={{ fontSize: '0.8rem', color: '#ccc' }}>No products tagged</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent} style={{ maxWidth: '800px' }}>
            <div className={styles.modalHeader}>
              <h2>Create New Look Scene</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            
            <form onSubmit={handleSaveLookbook} className={styles.cardContent} style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
              {/* Image Column */}
              <div>
                <div style={{ width: '100%', aspectRatio: '3/4', background: '#f9f9f9', border: '2px dashed #ddd', borderRadius: '0.8rem', position: 'relative', overflow: 'hidden' }}>
                  {form.image_url ? (
                    <img src={form.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      <Camera size={32} />
                      <span style={{ fontSize: '0.8rem', marginTop: '1rem' }}>{uploading ? 'Uploading...' : 'Upload Scene Image'}</span>
                    </div>
                  )}
                  <input type="file" hidden id="lb-upload" onChange={e => e.target.files && handleImageUpload(e.target.files[0])} />
                  <label htmlFor="lb-upload" style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
                </div>
              </div>

              {/* Details Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Look Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '0.5rem' }} placeholder="e.g. Nongkrong Funky" />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Description</label>
                  <textarea value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} style={{ width: '100%', padding: '0.8rem', border: '1px solid #eee', borderRadius: '0.5rem' }} placeholder="Short tagline for this look..." />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>Tag Products</label>
                  <div style={{ border: '1px solid #eee', borderRadius: '0.5rem', padding: '0.5rem', height: '150px', overflowY: 'auto' }}>
                    <div style={{ position: 'sticky', top: 0, background: 'white', marginBottom: '0.5rem' }}>
                      <input 
                        placeholder="Search products..." 
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', border: 'none', borderBottom: '1px solid #eee' }} 
                      />
                    </div>
                    {allProducts
                      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(p => {
                        const isSelected = selectedProductIds.includes(p.id)
                        return (
                          <div 
                            key={p.id} 
                            onClick={() => {
                              setSelectedProductIds(prev => 
                                isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]
                              )
                            }}
                            style={{ 
                              padding: '0.4rem 0.6rem', 
                              cursor: 'pointer', 
                              fontSize: '0.85rem',
                              background: isSelected ? '#000' : 'transparent',
                              color: isSelected ? 'white' : 'black',
                              borderRadius: '0.3rem',
                              marginBottom: '0.2rem'
                            }}
                          >
                            {p.name}
                          </div>
                        )
                      })}
                  </div>
                </div>

                <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                  <Save size={18} /> {loading ? 'Creating...' : 'Create Look'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
