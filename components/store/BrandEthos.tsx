'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function BrandEthos() {
  const [content, setContent] = useState<any>({
    ethos_1_title: 'Timeless Design',
    ethos_1_text: 'We believe in creating products that transcend trends, focusing on pure aesthetics and enduring quality.',
    ethos_2_title: 'Sustainably Crafted',
    ethos_2_text: 'Our commitment to the planet means using recycled materials and ethical production processes for every piece.',
    ethos_3_title: 'Premium Quality',
    ethos_3_text: 'Only the finest fabrics and materials are selected, ensuring that your ARSYIL pieces last a lifetime.'
  })

  const supabase = createClient()

  useEffect(() => {
    async function fetchCMS() {
      const { data } = await supabase
        .from('site_content')
        .select('key, content')
        .eq('section', 'ethos')
      
      if (data) {
        const mapped: any = {}
        data.forEach(item => {
          mapped[item.key] = item.content
        })
        setContent((prev: any) => ({ ...prev, ...mapped }))
      }
    }
    fetchCMS()
  }, [])

  return (
    <section className="section-padding" style={{ backgroundColor: 'hsl(var(--secondary))', borderTop: '1px solid hsl(var(--border) / 0.5)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>{content.ethos_1_title}</h3>
            <p>{content.ethos_1_text}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>{content.ethos_2_title}</h3>
            <p>{content.ethos_2_text}</p>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>{content.ethos_3_title}</h3>
            <p>{content.ethos_3_text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
