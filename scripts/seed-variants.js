const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function seedVariants() {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const directUrl = envFile
    .split('\n')
    .find(line => line.trim().startsWith('DIRECT_URL='))
    ?.split('=')[1]
    ?.replace(/"/g, '')
    ?.trim();

  if (!directUrl) {
    console.error('❌ Error: DIRECT_URL not found in .env.local');
    process.exit(1);
  }

  const client = new Client({ connectionString: directUrl });
  
  try {
    await client.connect();
    console.log('🚀 Connected to Supabase Database...');

    // Data Mapping from Mock
    const productData = [
      {
        id: 'e1aa57cf-6f5f-43ec-83db-c662225cab42',
        slug: 'minimalist-silk-blouse',
        images: [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { name: 'White / S', stock: 12 },
          { name: 'White / M', stock: 8 },
          { name: 'White / L', stock: 5 }
        ]
      },
      {
        id: 'c52feaff-4126-4a32-8f26-8e4542c062f4',
        slug: 'urban-leather-totebag',
        images: [
          'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { name: 'Tan Leather', stock: 4 },
          { name: 'Black Leather', stock: 7 }
        ]
      },
      {
        id: 'e6cccd1e-c720-45af-9bc3-f438679066da',
        slug: 'essential-oversized-tee',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { name: 'S', stock: 25 },
          { name: 'M', stock: 40 },
          { name: 'L', stock: 35 }
        ]
      },
      {
        id: 'a3e1dd17-cc1f-40a9-9677-5d39763fd6a3',
        slug: 'sculptural-gold-earring',
        images: [
          'https://images.unsplash.com/photo-1630019058353-5bf3f191d4e7?auto=format&fit=crop&q=80&w=800'
        ],
        variants: [
          { name: '18k Gold Plated', stock: 15 }
        ]
      }
    ];

    console.log('⏳ Seeding Variants and Images...');

    for (const p of productData) {
      console.log(`Processing: ${p.slug}...`);

      // 1. Seed Images
      for (let i = 0; i < p.images.length; i++) {
        await client.query(`
          INSERT INTO product_images (product_id, url, is_primary, display_order)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
        `, [p.id, p.images[i], i === 0, i]);
      }

      // 2. Seed Variants
      for (const v of p.variants) {
        const sku = `${p.slug}-${v.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 4)}`;
        await client.query(`
          INSERT INTO variants (product_id, sku, name, stock_quantity)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (sku) DO NOTHING
        `, [p.id, sku, v.name, v.stock]);
      }
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (err) {
    console.error('❌ Seeding failed:');
    console.error(err.message);
  } finally {
    await client.end();
  }
}

seedVariants();
