import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import CosmicBadge from '@/components/CosmicBadge'
import { getSiteSettings } from '@/lib/cosmic'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  try {
    const siteSettings = await getSiteSettings()
    
    return {
      title: siteSettings?.metadata?.site_title || 'Entree Brussels - Youth Houses Network',
      description: siteSettings?.metadata?.site_description || 'Discover and connect with youth houses across Brussels. Find activities, events, and communities near you.',
      keywords: 'Brussels, youth houses, community, activities, young people, Entree',
      authors: [{ name: 'Entree Brussels' }],
      viewport: 'width=device-width, initial-scale=1',
    }
  } catch (error) {
    console.error('Error fetching site settings for metadata:', error)
    return {
      title: 'Entree Brussels - Youth Houses Network',
      description: 'Discover and connect with youth houses across Brussels. Find activities, events, and communities near you.',
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const bucketSlug = process.env.COSMIC_BUCKET_SLUG as string

  return (
    <html lang="en">
      <head>
        <script src="/dashboard-console-capture.js"></script>
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-light">
          <Navigation />
          <main>{children}</main>
          <Footer />
          <CosmicBadge bucketSlug={bucketSlug} />
        </div>
      </body>
    </html>
  )
}