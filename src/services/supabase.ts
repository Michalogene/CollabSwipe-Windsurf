import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    __SUPABASE?: { url?: string; anonKey?: string };
  }
}

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || window.__SUPABASE?.url;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || window.__SUPABASE?.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY ne sont pas définies. Créez un fichier .env.local à la racine avec ces valeurs puis redémarrez le serveur Vite.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
