import { createClient } from "@supabase/supabase-js"

const url = import.meta.env.VITE_SUPABASE_URL
const clave = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !clave) {
  throw new Error("Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local")
}

export const supabase = createClient(url, clave)