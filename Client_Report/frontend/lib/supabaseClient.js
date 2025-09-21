import { createClient } from '@supabase/supabase-js'

// Read from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a single reusable client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)