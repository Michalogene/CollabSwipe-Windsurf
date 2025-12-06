import { createClient } from "@supabase/supabase-js";

import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  // Try Vite (import.meta.env)
  if (import.meta.env && import.meta.env[key]) return import.meta.env[key];
  // Try Process (Node/Expo) if available
  if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
  return undefined;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || getEnv('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase Environment Variables missing!");
  // We log but don't crash hard, allowing the UI to potentially render an error page if designed, 
  // though createClient might fail with undefined. 
  // Actually createClient needs strings.
}

// Fallback to empty string to prevent crash, but connection will fail.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
