import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are not set. Some features may not work.')
}

// Server-side client
export const supabase = createSupabaseClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder-key'
)

// Client-side client with auth context
export const createClient = () => createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
)

export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          user_id: string | null
          original_url: string
          short_code: string
          custom_alias: string | null
          created_at: string
          expires_at: string | null
          is_active: boolean
          click_count: number
          unique_clicks: number
          last_clicked_at: string | null
          title: string | null
          description: string | null
          favicon_url: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          original_url: string
          short_code: string
          custom_alias?: string | null
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          click_count?: number
          unique_clicks?: number
          last_clicked_at?: string | null
          title?: string | null
          description?: string | null
          favicon_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          original_url?: string
          short_code?: string
          custom_alias?: string | null
          created_at?: string
          expires_at?: string | null
          is_active?: boolean
          click_count?: number
          unique_clicks?: number
          last_clicked_at?: string | null
          title?: string | null
          description?: string | null
          favicon_url?: string | null
        }
      }
      clicks: {
        Row: {
          id: string
          url_id: string
          ip_address: string | null
          user_agent: string | null
          referer: string | null
          country: string | null
          city: string | null
          device_type: string | null
          browser: string | null
          clicked_at: string
        }
        Insert: {
          id?: string
          url_id: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          clicked_at?: string
        }
        Update: {
          id?: string
          url_id?: string
          ip_address?: string | null
          user_agent?: string | null
          referer?: string | null
          country?: string | null
          city?: string | null
          device_type?: string | null
          browser?: string | null
          clicked_at?: string
        }
      }
    }
  }
}
