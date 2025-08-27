// app/[slug]/page.tsx
import { getPageBySlug } from '@/lib/cosmic'
import { Page } from '@/types'
import { notFound } from 'next/navigation'

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  try {
    const page = await getPageBySlug(slug)
    
    if (!page) {
      notFound()
    }

    const pageData = page as Page

    return (
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative py-16 px-4 bg-gradient-primary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {pageData.metadata?.title || pageData.title}
            </h1>
            
            {pageData.metadata?.seo_description && (
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                {pageData.metadata.seo_description}
              </p>
            )}
          </div>

          {pageData.metadata?.featured_image && (
            <div className="container mx-auto mt-12">
              <div className="max-w-4xl mx-auto">
                <img 
                  src={`${pageData.metadata.featured_image.imgix_url}?w=1200&h=400&fit=crop&auto=format,compress`}
                  alt={pageData.metadata.title || pageData.title}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
                  width="1200"
                  height="400"
                />
              </div>
            </div>
          )}

          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-100"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-accent/30 rounded-full animate-bounce-gentle animation-delay-300"></div>
        </div>

        {/* Content Section */}
        <div className="py-16 px-4">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              {pageData.metadata?.content ? (
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: pageData.metadata.content }}
                />
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-lg">
                    Content for this page is currently being updated. Please check back soon.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading page:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  try {
    const page = await getPageBySlug(slug)
    
    if (!page) {
      return {
        title: 'Page Not Found',
        description: 'The requested page could not be found.'
      }
    }

    const pageData = page as Page

    return {
      title: `${pageData.metadata?.title || pageData.title} | Entree Brussels`,
      description: pageData.metadata?.seo_description || 
        `Learn more about ${pageData.metadata?.title || pageData.title} - Entree Brussels youth houses network.`,
      keywords: `Entree Brussels, youth houses, Brussels, ${pageData.metadata?.title || pageData.title}`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Page | Entree Brussels',
      description: 'Discover more about Entree Brussels and our network of youth houses.'
    }
  }
}