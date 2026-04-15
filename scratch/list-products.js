const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function listProducts() {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
  const directUrl = envFile
    .split('\n')
    .find(line => line.trim().startsWith('DIRECT_URL='))
    ?.split('=')[1]
    ?.replace(/"/g, '')
    ?.trim();

  const client = new Client({ connectionString: directUrl });
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, slug FROM products');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

listProducts();
