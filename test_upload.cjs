const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envContent = fs.readFileSync('.env', 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    env[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) console.error('Buckets error:', bError);
  else console.log('Buckets:', buckets.map(b => b.name));
  
  // Create a dummy file
  const fileContent = 'dummy data';
  const { data: uploadData, error: uError } = await supabase.storage.from('products').upload('test.txt', fileContent);
  if (uError) console.error('Upload error:', uError);
  else console.log('Upload success:', uploadData);
}
check();
