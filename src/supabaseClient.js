import { createClient } from '@supabase/supabase-js'

// Qui leggiamo i dati che hai appena messo nel file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Configuriamo le opzioni per includere il tuo schema personalizzato
const options = {
  db: {
    schema: 'terzo-tempo-app',
  },
};

// Creiamo l'istanza di connessione
export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);