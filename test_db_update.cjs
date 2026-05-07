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
  const { error: testUpdateError } = await supabase.from('products').update({
        name: 'Pulseira infantil',
        description: '',
        price: 15,
        image: 'https://ycciwmxoownyipdinzvt.supabase.co/storage/v1/object/public/products/0.9742177663113862.jpg',
        category: 'pulseiras',
        subcategory: 'Todos',
        is_customizable: false,
        is_active: true,
        available_colors: 'Azul, Preto, Rosa, Branco ',
        has_name_option: false,
        variations: [],
        customization_lists: [],
        name_price: undefined
      }).eq('id', '62c5359c-f550-4fdf-bc95-caaeba03a907');
  if (testUpdateError) {
    console.error('Update test error:', testUpdateError);
  } else {
    console.log('Update test passed');
  }
}
check();
