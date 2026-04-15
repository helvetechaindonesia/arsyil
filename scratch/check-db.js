const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function checkDatabase() {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const directUrl = envFile
    .split('\n')
    .find(line => line.trim().startsWith('DIRECT_URL='))
    ?.split('=')[1]
    ?.replace(/"/g, '')
    ?.trim();

  if (!directUrl) {
    console.error('DIRECT_URL not found');
    return;
  }

  const client = new Client({ connectionString: directUrl });
  
  try {
    await client.connect();
    console.log('Connected to Supabase.');

    const tables = ['products', 'categories', 'variants', 'product_images', 'site_content'];
    
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM ${table}`);
      console.log(`Table ${table}: ${res.rows[0].count} rows`);
      
      if (parseInt(res.rows[0].count) > 0) {
        const sample = await client.query(`SELECT * FROM ${table} LIMIT 1`);
        console.log(`Sample from ${table}:`, JSON.stringify(sample.rows[0], null, 2));
      }
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await client.end();
  }
}

checkDatabase();
