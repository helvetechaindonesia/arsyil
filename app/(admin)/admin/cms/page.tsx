'use client'

import React, { useState, useEffect } from 'react'
import { Save, RefreshCw, Upload, Image as ImageIcon, Type } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import styles from '../Dashboard.module.css'

interface Content {
  id: string
  section: string
  key: string
  content: string
  image_url: string | null
}

export default function CMSPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .order('section')

    if (error) {
      console.error('Error:', error)
      // If table is empty, we'll suggest seeding it
    } else {
      setContents(data || [])
    }
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
      alert('All changes saved!')
    } catch (err: any) {
      alert('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (id: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `cms/${id}-${Math.random()}.${fileExt}`
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

  // Pre-seed some default content if empty
  const seedDefaults = async () => {
    const defaults = [
      { section: 'hero', key: 'hero_title', content: 'Modern Elegance for the Contemporary Woman' },
      { section: 'hero', key: 'hero_subtitle', content: 'Curated collections that define your style.' },
      { section: 'about', key: 'about_text', content: 'Arsyil is a single-brand boutique dedicated to timeless quality.' }
    ]
    
    await supabase.from('site_content').insert(defaults)
    fetchContent()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>CMS Management</h1>
          <p>Edit website copy and primary images without coding.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="outline" onClick={fetchContent} disabled={loading}>
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
          </Button>
          <Button onClick={saveAll} disabled={saving || contents.length === 0}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>
      </header>

      {contents.length === 0 && !loading && (
        <div className={styles.card} style={{ textAlign: 'center', padding: '4rem' }}>
          <h3>No CMS content found.</h3>
          <p>Initialize the default site content to start editing.</p>
          <Button onClick={seedDefaults} style={{ marginTop: '1.5rem' }}>Initialize Defaults</Button>
        </div>
      )}

      <div className={styles.grid}>
        {contents.map((item) => (
          <div key={item.id} className={styles.card} style={{ gridColumn: 'span 2' }}>
            <div className={styles.cardHeader} style={{ justifyContent: 'flex-start', gap: '1rem' }}>
              <span style={{ fontSize: '0.7rem', background: '#eee', padding: '0.2rem 0.6rem', borderRadius: '1rem', textTransform: 'uppercase' }}>
                {item.section}
              </span>
              <strong style={{ fontSize: '0.9rem' }}>{item.key.replace(/_/g, ' ')}</strong>
            </div>
            
            <div className={styles.cardContent} style={{ display: 'grid', gridTemplateColumns: item.key.includes('image') ? '1fr 200px' : '1fr', gap: '2rem' }}>
              <div className={styles.cmsInputGroup}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                  <Type size={14} /> Text Content
                </label>
                <textarea
                  value={item.content || ''}
                  onChange={(e) => handleUpdate(item.id, { content: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #eee', minHeight: '100px' }}
                />
              </div>

              {item.key.includes('image') && (
                <div className={styles.cmsImageGroup}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                    <ImageIcon size={14} /> Asset Image
                  </label>
                  <div style={{ position: 'relative', width: '200px', height: '120px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #eee' }}>
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/200x120'} 
                      alt="CMS Asset" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <label style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0'}>
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
        ))}
      </div>
    </div>
  )
}
