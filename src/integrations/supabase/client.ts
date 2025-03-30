
import { createClient } from '@supabase/supabase-js';
import config from '@/config/config';

// Initialize Supabase client
const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or anon key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
