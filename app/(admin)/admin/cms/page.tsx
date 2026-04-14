'use client'

import React, { useState, useEffect } from 'react'
import { Save, RefreshCw, Upload, Image as ImageIcon, Type, LayoutGrid, Info, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import styles from '../Dashboard.module.css'

interface Content {
  id: string
  section: string
  key: string
  content: string | null
  image_url: string | null
}

const SECTIONS = [
  { id: 'hero', name: 'Hero Banner', icon: ImageIcon },
  { id: 'featured', name: 'Seasonal Picks', icon: LayoutGrid },
  { id: 'shipping', name: 'National Shipping', icon: Info },
  { id: 'info', name: 'Information Cards', icon: HelpCircle },
  { id: 'ethos', name: 'Brand Ethos', icon: Type }
]

export default function CMSPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  
  const supabase = createClient()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('key')

    if (error) console.error('Error:', error)
    else setContents(data || [])
    setLoading(false)
  }

  const handleUpdate = async (id: string, updates: Partial<Content>) => {
    setContents(contents.map(c => c.id === id ? { ...c, ...updates } : c))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      for (const item of contents) {
        const { error } = await supabase
          .from('site_content')
          .update({
            content: item.content,
            image_url: item.image_url
          })
          .eq('id', item.id)
        
        if (error) throw error
      }
      alert('Success: All CMS changes saved to database.')
    } catch (err: any) {
      alert('Error saving: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cms/${id}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName)
      handleUpdate(id, { image_url: urlData.publicUrl })
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    }
  }

  const filteredContents = contents.filter(c => c.section === activeSection)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Enhanced CMS Management</h1>
          <p>Control every text and image on your storefront.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={fetchContent} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </Button>
          <Button onClick={saveAll} disabled={saving || contents.length === 0}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </header>

      {/* Section Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', overflowX: 'auto' }}>
        {SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: activeSection === s.id ? '#000' : 'transparent',
              color: activeSection === s.id ? '#fff' : '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: '0.2s'
            }}
          >
            <s.icon size={16} /> {s.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center' }}>Loading content...</div>
      ) : (
        <div className={styles.grid}>
          {filteredContents.map((item) => {
            const isImageKey = item.key.includes('image') || item.image_url
            return (
              <div key={item.id} className={styles.card} style={{ gridColumn: 'span 2' }}>
                <div className={styles.cardHeader}>
                  <strong style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                    {item.key.replace(/_/g, ' ')}
                  </strong>
                </div>
                
                <div className={styles.cardContent} style={{ display: 'grid', gridTemplateColumns: isImageKey ? '1fr 300px' : '1fr', gap: '2rem' }}>
                  <div className={styles.cmsInputGroup}>
                    <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>Text Content</label>
                    <textarea
                      value={item.content || ''}
                      placeholder="Enter content..."
                      onChange={(e) => handleUpdate(item.id, { content: e.target.value })}
                      style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #eee', minHeight: '100px', fontSize: '0.95rem' }}
                    />
                  </div>

                  {isImageKey && (
                    <div className={styles.cmsImageGroup}>
                      <label style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.5rem', display: 'block' }}>Media Asset</label>
                      <div style={{ position: 'relative', borderRadius: '0.8rem', overflow: 'hidden', border: '1px solid #eee', background: '#fafafa', height: '150px' }}>
                        <img 
                          src={item.image_url || 'https://via.placeholder.com/300x150?text=No+Image'} 
                          alt="CMS" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', opacity: 0, transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
                          <Upload color="white" />
                          <input 
                            type="file" 
                            hidden 
                            onChange={(e) => e.target.files && handleImageUpload(item.id, e.target.files[0])} 
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {filteredContents.length === 0 && (
            <div style={{ padding: '4rem', textAlign: 'center', gridColumn: 'span 2', opacity: 0.5 }}>
              No content keys found for this section.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
