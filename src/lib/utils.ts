import { nanoid } from 'nanoid'
import { supabase, type Database, createClient } from './supabase'

type UrlRow = Database['public']['Tables']['urls']['Row']

export function generateShortCode(length: number = 8): string {
  return nanoid(length)
}

export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}

export async function checkAliasAvailability(alias: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('urls')
    .select('id')
    .or(`short_code.eq.${alias},custom_alias.eq.${alias}`)
    .limit(1)

  if (error) {
    console.error('Error checking alias availability:', error)
    return false
  }

  return data.length === 0
}

export async function createShortUrl(
  originalUrl: string,
  customAlias?: string
): Promise<{ success: boolean; data?: UrlRow; error?: string }> {
  try {
    const supabaseClient = createClient()
    const { data: { user } } = await supabaseClient.auth.getUser()

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      return { success: false, error: 'Invalid URL format' }
    }

    const normalizedUrl = normalizeUrl(originalUrl)
    
    // Check if custom alias is available
    if (customAlias) {
      const isAvailable = await checkAliasAvailability(customAlias)
      if (!isAvailable) {
        return { success: false, error: 'Custom alias is already taken' }
      }
    }

    // Generate short code if no custom alias
    const shortCode = customAlias || generateShortCode()
    
    // Check if short code is available (in case of collision)
    if (!customAlias) {
      const isAvailable = await checkAliasAvailability(shortCode)
      if (!isAvailable) {
        // Regenerate if collision occurs
        const newShortCode = generateShortCode()
        return createShortUrl(originalUrl, newShortCode)
      }
    }

    // Try to fetch page metadata
    let metadata = { title: null, description: null, favicon_url: null }
    try {
      const metadataResponse = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl })
      })
      if (metadataResponse.ok) {
        metadata = await metadataResponse.json()
      }
    } catch (error) {
      console.error('Error fetching metadata:', error)
    }

    // Insert into database with user association
    const { data, error } = await supabaseClient
      .from('urls')
      .insert({
        user_id: user?.id || null, // Associate with authenticated user
        original_url: normalizedUrl,
        short_code: shortCode,
        custom_alias: customAlias || null,
        title: metadata.title,
        description: metadata.description,
        favicon_url: metadata.favicon_url
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return { success: false, error: 'Failed to create short URL' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function getUrlByCode(code: string): Promise<UrlRow | null> {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .or(`short_code.eq.${code},custom_alias.eq.${code}`)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function incrementClickCount(
  urlId: string,
  clickData: {
    ip_address?: string
    user_agent?: string
    referer?: string
    country?: string
    city?: string
    device_type?: string
    browser?: string
  }
): Promise<void> {
  try {
    // Record the click
    await supabase.from('clicks').insert({
      url_id: urlId,
      ...clickData
    })

    // Update click counts and last clicked time
    const { data: currentData } = await supabase
      .from('urls')
      .select('click_count, unique_clicks')
      .eq('id', urlId)
      .single()

    if (currentData) {
      // Check if this is a unique click (simple IP-based check)
      const { data: existingClick } = await supabase
        .from('clicks')
        .select('id')
        .eq('url_id', urlId)
        .eq('ip_address', clickData.ip_address)
        .limit(1)

      const isUniqueClick = !existingClick || existingClick.length === 0
      
      await supabase
        .from('urls')
        .update({
          click_count: (currentData.click_count || 0) + 1,
          unique_clicks: (currentData.unique_clicks || 0) + (isUniqueClick ? 1 : 0),
          last_clicked_at: new Date().toISOString()
        })
        .eq('id', urlId)
    }
  } catch (error) {
    console.error('Error recording click:', error)
  }
}

export async function getAllUrls(page: number = 1, limit: number = 20) {
  const supabaseClient = createClient()
  const { data: { user } } = await supabaseClient.auth.getUser()
  
  if (!user) {
    return { data: [], count: 0, error: 'User not authenticated' }
  }

  const offset = (page - 1) * limit
  
  const { data, error, count } = await supabaseClient
    .from('urls')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id) // Filter by authenticated user
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching URLs:', error)
    return { data: [], count: 0, error: error.message }
  }

  return { data: data || [], count: count || 0, error: null }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getDomainFromUrl(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// Delete URL function
export async function deleteUrl(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabaseClient = createClient()
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabaseClient
      .from('urls')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id) // Only allow deleting own URLs

    if (error) {
      console.error('Error deleting URL:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting URL:', error)
    return { success: false, error: 'Failed to delete URL' }
  }
}

// Update URL function
export async function updateUrl(
  id: string, 
  updates: { custom_alias?: string | null; original_url?: string }
): Promise<{ success: boolean; data?: UrlRow; error?: string }> {
  try {
    const supabaseClient = createClient()
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check if custom_alias is available (if provided and not null)
    if (updates.custom_alias) {
      const isAvailable = await checkAliasAvailability(updates.custom_alias)
      if (!isAvailable) {
        return { success: false, error: 'Custom alias is already taken' }
      }
    }

    const { data, error } = await supabaseClient
      .from('urls')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id) // Only allow updating own URLs
      .select()
      .single()

    if (error) {
      console.error('Error updating URL:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error updating URL:', error)
    return { success: false, error: 'Failed to update URL' }
  }
}

// Get URL analytics
export async function getUrlAnalytics(urlId: string) {
  try {
    const { data: clicks, error } = await supabase
      .from('clicks')
      .select('*')
      .eq('url_id', urlId)
      .order('clicked_at', { ascending: false })

    if (error) {
      console.error('Error fetching analytics:', error)
      return { success: false, error: error.message }
    }

    // Process analytics data
    const totalClicks = clicks.length
    const uniqueClicks = new Set(clicks.map(click => click.ip_address)).size
    const countries = clicks.reduce((acc, click) => {
      if (click.country) {
        acc[click.country] = (acc[click.country] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    
    const devices = clicks.reduce((acc, click) => {
      if (click.device_type) {
        acc[click.device_type] = (acc[click.device_type] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return {
      success: true,
      data: {
        totalClicks,
        uniqueClicks,
        countries,
        devices,
        recentClicks: clicks.slice(0, 10)
      }
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return { success: false, error: 'Failed to fetch analytics' }
  }
}
