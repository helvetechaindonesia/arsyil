'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, ChevronRight, Hash } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from '../Dashboard.module.css' // Reusing dashboard styles for consistency

interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  subcategories: Category[]
}

export default function AdministrationPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newCatName, setNewCatName] = useState('')
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching categories:', error)
    } else {
      // Build a tree structure
      const catMap: Record<string, Category> = {}
      const tree: Category[] = []

      data.forEach((cat: any) => {
        catMap[cat.id] = { ...cat, subcategories: [] }
      })

      data.forEach((cat: any) => {
        if (cat.parent_id && catMap[cat.parent_id]) {
          catMap[cat.parent_id].subcategories.push(catMap[cat.id])
        } else if (!cat.parent_id) {
          tree.push(catMap[cat.id])
        }
      })

      setCategories(tree)
    }
    setLoading(false)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return

    const slug = newCatName.toLowerCase().replace(/\s+/g, '-')
    
    const { error } = await supabase
      .from('categories')
      .insert([
        { 
          name: newCatName, 
          slug, 
          parent_id: selectedParentId 
        }
      ])

    if (error) {
      alert('Error adding category: ' + error.message)
    } else {
      setNewCatName('')
      setSelectedParentId(null)
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will delete all subcategories (Jenis) as well.')) return
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting: ' + error.message)
    } else {
      fetchCategories()
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Administration</h1>
        <p className={styles.subtitle}>Manage Categories and Product Types (Jenis)</p>
      </header>

      <div className={styles.grid}>
        {/* Add Category Form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.statName}>
              {selectedParentId ? 'Add New "Jenis" (Subcategory)' : 'Add New Category'}
            </span>
          </div>
          <form className={styles.cardContent} onSubmit={handleAddCategory}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="e.g. Celana or Kulot"
                className={styles.input} // Assume we might need to add this to CSS
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{
                  padding: '0.8rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ddd',
                  fontSize: '1rem'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  type="submit" 
                  className={styles.button}
                  style={{
                    flex: 1,
                    background: '#000',
                    color: '#fff',
                    padding: '0.8rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                >
                  <Plus size={16} style={{ marginRight: '0.5rem' }} />
                  {selectedParentId ? 'Save Jenis' : 'Save Category'}
                </button>
                {selectedParentId && (
                  <button 
                    type="button" 
                    onClick={() => setSelectedParentId(null)}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #ddd',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className={styles.card} style={{ gridColumn: 'span 2' }}>
          <div className={styles.cardHeader}>
            <span className={styles.statName}>Hierarchy Tree</span>
          </div>
          <div className={styles.cardContent}>
            {loading ? (
              <p>Loading hierarchy...</p>
            ) : categories.length === 0 ? (
              <p style={{ opacity: 0.5 }}>No categories yet. Start by adding one.</p>
            ) : (
              <div className={styles.treeList}>
                {categories.map((cat) => (
                  <div key={cat.id} className={styles.treeItem} style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f9f9f9', borderRadius: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ChevronRight size={18} />
                        <strong>{cat.name}</strong>
                        <span style={{ fontSize: '0.7rem', color: '#888' }}>/{cat.slug}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => setSelectedParentId(cat.id)}
                          title="Add Jenis"
                          style={{ padding: '0.4rem', borderRadius: '0.3rem', border: '1px solid #ddd', cursor: 'pointer' }}
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          title="Delete"
                          style={{ padding: '0.4rem', borderRadius: '0.3rem', border: '1px solid #ff4d4f', color: '#ff4d4f', cursor: 'pointer' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories (Jenis) */}
                    <div style={{ marginLeft: '2rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {cat.subcategories.map((sub) => (
                        <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', borderLeft: '2px solid #eee' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Hash size={14} color="#888" />
                            <span>{sub.name}</span>
                          </div>
                          <button 
                            onClick={() => handleDelete(sub.id)}
                            style={{ color: '#ff4d4f', background: 'none', border: 'none', cursor: 'pointer' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      {cat.subcategories.length === 0 && (
                        <p style={{ fontSize: '0.8rem', opacity: 0.4, paddingLeft: '1rem' }}>No "Jenis" added yet</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
