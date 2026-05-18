import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabase client - SDK handles URL generation automatically
// DO NOT append /rest/v1, /auth/v1, etc. to the URL
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export default supabase