import { createClient } from '@supabase/supabase-js'

// Qui leggiamo i dati che hai appena messo nel file .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Creiamo l'istanza di connessione
export const supabase = createClient(supabaseUrl, supabaseAnonKey)