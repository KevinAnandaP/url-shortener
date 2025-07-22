import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShortLink-Bot/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        title: null,
        description: null,
        favicon_url: null,
      })
    }

    const html = await response.text()
    
    // Extract metadata using regex
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descriptionMatch = html.match(/<meta[^>]*name=["\']description["\'][^>]*content=["\']([^"']+)["\'][^>]*>/i) ||
                             html.match(/<meta[^>]*content=["\']([^"']+)["\'][^>]*name=["\']description["\'][^>]*>/i)
    
    // Try to find favicon
    const faviconMatch = html.match(/<link[^>]*rel=["\'][^"']*icon[^"']*["\'][^>]*href=["\']([^"']+)["\'][^>]*>/i) ||
                         html.match(/<link[^>]*href=["\']([^"']+)["\'][^>]*rel=["\'][^"']*icon[^"']*["\'][^>]*>/i)
    
    let favicon_url = null
    if (faviconMatch && faviconMatch[1]) {
      const faviconPath = faviconMatch[1]
      if (faviconPath.startsWith('http')) {
        favicon_url = faviconPath
      } else if (faviconPath.startsWith('//')) {
        favicon_url = `https:${faviconPath}`
      } else if (faviconPath.startsWith('/')) {
        const urlObj = new URL(url)
        favicon_url = `${urlObj.protocol}//${urlObj.host}${faviconPath}`
      } else {
        const urlObj = new URL(url)
        favicon_url = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
      }
    } else {
      // Default favicon location
      try {
        const urlObj = new URL(url)
        favicon_url = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
      } catch {
        // Ignore if URL parsing fails
      }
    }

    return NextResponse.json({
      title: titleMatch ? titleMatch[1].trim() : null,
      description: descriptionMatch ? descriptionMatch[1].trim() : null,
      favicon_url,
    })

  } catch (error) {
    console.error('Error fetching metadata:', error)
    return NextResponse.json({
      title: null,
      description: null,
      favicon_url: null,
    })
  }
}
