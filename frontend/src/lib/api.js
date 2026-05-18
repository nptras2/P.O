import { supabase } from '@/lib/supabase'

export function formatError(error) {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return 'An error occurred'
}

// Legacy auth headers getter for any remaining API calls
export async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    return { Authorization: `Bearer ${session.access_token}` }
  }
  return {}
}

export default supabase