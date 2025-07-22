import { NextRequest, NextResponse } from 'next/server'
import { getUrlByCode, incrementClickCount } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Get URL from database
    const urlData = await getUrlByCode(code)

    if (!urlData) {
      return NextResponse.redirect(new URL('/?error=not-found', request.url))
    }

    // Extract analytics data from request
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || null
    
    // Simple device type detection
    const deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' : 'desktop'
    
    // Simple browser detection
    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'

    // Record the click (don't await to avoid slowing down the redirect)
    incrementClickCount(urlData.id, {
      ip_address: ip,
      user_agent: userAgent,
      referer: referer || undefined,
      device_type: deviceType,
      browser,
    }).catch(error => {
      console.error('Error recording click:', error)
    })

    // Redirect to the original URL
    return NextResponse.redirect(urlData.original_url, { status: 302 })

  } catch (error) {
    console.error('Error in redirect:', error)
    return NextResponse.redirect(new URL('/?error=server-error', request.url))
  }
}
