const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Basic manual parsing of .env.local since we don't have dotenv yet
const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const directUrl = envFile
  .split('\n')
  .find(line => line.startsWith('DIRECT_URL='))
  ?.split('=')[1]
  ?.replace(/"/g, '')
  ?.trim();

if (!directUrl) {
  console.error('❌ Error: DIRECT_URL not found in .env.local');
  process.exit(1);
}

const sql = fs.readFileSync(path.join(__dirname, '../supabase_schema.sql'), 'utf8');

const client = new Client({
  connectionString: directUrl,
});

async function runSchema() {
  console.log('🚀 Connecting to Supabase Database...');
  try {
    await client.connect();
    console.log('✅ Connected successfully.');
    
    console.log('⏳ Executing supabase_schema.sql...');
    await client.query(sql);
    
    console.log('🎉 Database Schema synchronized successfully!');
  } catch (err) {
    console.error('❌ Synchronization failed:');
    console.error(err.message);
    if (err.detail) console.error('Detail:', err.detail);
  } finally {
    await client.end();
  }
}

runSchema();
