import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('=== SUPABASE CONFIG ===');
console.log('URL from env:', supabaseUrl);
console.log('Anon Key from env:', supabaseAnonKey ? 'Exists (' + supabaseAnonKey.length + ' chars)' : 'MISSING!');
console.log('======================');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)