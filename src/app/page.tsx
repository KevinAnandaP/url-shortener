import { UrlShortenerForm } from '@/components/url-shortener-form'
import { Header } from '@/components/header'
// import { Footer } from '@/components/footer'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Shorten Your URLs
            <span className="block text-primary">Instantly</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create short, memorable links in seconds. Track clicks, analyze performance, 
            and share with confidence using our modern URL shortener.
          </p>
        </section>

        {/* URL Shortener Form */}
        <section className="max-w-4xl mx-auto">
          <UrlShortenerForm />
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-6xl mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to manage and track your shortened URLs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Generate short URLs instantly with our optimized algorithm
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Aliases</h3>
              <p className="text-muted-foreground">
                Create memorable short links with custom aliases
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-border bg-card/50">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">
                Track clicks, visitors, and performance in real-time
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action - Dashboard & Analytics */}
        <section className="max-w-4xl mx-auto text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Dive Deeper?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Explore your URL performance and get detailed insights
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/dashboard"
              className="group p-8 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                View Dashboard
              </h3>
              <p className="text-muted-foreground">
                Monitor and manage all your shortened URLs in one place
              </p>
            </Link>

            <Link 
              href="/analytics"
              className="group p-8 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-all duration-300 hover:scale-105"
            >
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                View Analytics
              </h3>
              <p className="text-muted-foreground">
                Get detailed insights into your link performance and audience
              </p>
            </Link>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
