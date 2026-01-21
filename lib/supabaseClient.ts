
import { createClient } from '@supabase/supabase-js';

// Accessing process.env keys that are replaced by Vite
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

// Safely create client or return null if configuration is missing
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => !!supabase;
