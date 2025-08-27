// app/youth-houses/[slug]/page.tsx
import { getYouthHouseBySlug } from '@/lib/cosmic'
import { YouthHouse } from '@/types'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function YouthHousePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  try {
    const youthHouse = await getYouthHouseBySlug(slug)
    
    if (!youthHouse) {
      notFound()
    }

    const house = youthHouse as YouthHouse

    return (
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative py-16 px-4 bg-gradient-primary">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <Link 
                href="/" 
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors duration-300"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Map
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {house.metadata.name}
              </h1>
              
              {house.metadata.neighborhood && (
                <p className="text-xl text-white/90 mb-2">
                  📍 {house.metadata.neighborhood}, Brussels
                </p>
              )}
              
              {house.metadata.age_range && (
                <p className="text-lg text-white/80">
                  👥 Ages: {house.metadata.age_range}
                </p>
              )}
            </div>

            {house.metadata.featured_image && (
              <div className="max-w-4xl mx-auto">
                <img 
                  src={`${house.metadata.featured_image.imgix_url}?w=1200&h=400&fit=crop&auto=format,compress`}
                  alt={house.metadata.name}
                  className="w-full h-64 md:h-96 object-cover rounded-xl shadow-2xl"
                  width="1200"
                  height="400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description */}
                {house.metadata.description && (
                  <div>
                    <h2 className="text-3xl font-bold text-dark mb-6">About Our Youth House</h2>
                    <div 
                      className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: house.metadata.description }}
                    />
                  </div>
                )}

                {/* Activities */}
                {house.metadata.activities && (
                  <div>
                    <h2 className="text-3xl font-bold text-dark mb-6">Activities & Programs</h2>
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <div className="space-y-3">
                        {house.metadata.activities.split('\n').map((activity, index) => (
                          activity.trim() && (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-700">{activity.replace('•', '').trim()}</p>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Gallery */}
                {house.metadata.gallery && house.metadata.gallery.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold text-dark mb-6">Photo Gallery</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {house.metadata.gallery.slice(0, 6).map((image, index) => (
                        <img 
                          key={index}
                          src={`${image.imgix_url}?w=600&h=400&fit=crop&auto=format,compress`}
                          alt={`${house.metadata.name} - Image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                          width="300"
                          height="200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-dark mb-6">Contact Information</h3>
                  
                  <div className="space-y-4">
                    {house.metadata.address && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-dark">Address</p>
                          <p className="text-gray-600 whitespace-pre-line">{house.metadata.address}</p>
                        </div>
                      </div>
                    )}

                    {house.metadata.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-dark">Phone</p>
                          <a href={`tel:${house.metadata.phone}`} className="text-secondary hover:text-secondary/80 transition-colors duration-300">
                            {house.metadata.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {house.metadata.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-dark">Email</p>
                          <a href={`mailto:${house.metadata.email}`} className="text-accent hover:text-accent/80 transition-colors duration-300">
                            {house.metadata.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {house.metadata.website && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 0l3-3m-3 3l-3-3" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-dark">Website</p>
                          <a 
                            href={house.metadata.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 transition-colors duration-300"
                          >
                            Visit Website →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Opening Hours */}
                {house.metadata.opening_hours && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-dark mb-6">Opening Hours</h3>
                    <div className="space-y-2">
                      {house.metadata.opening_hours.split('\n').map((hours, index) => (
                        hours.trim() && (
                          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                            <span className="font-medium text-dark">
                              {hours.split(':')[0]}
                            </span>
                            <span className="text-gray-600">
                              {hours.split(':').slice(1).join(':').trim()}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gradient-secondary rounded-xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-4">Get Involved</h3>
                  <p className="mb-6 text-white/90">
                    Interested in joining our community? Contact us to learn about volunteer opportunities and upcoming events.
                  </p>
                  <Link 
                    href="/contact"
                    className="bg-white text-secondary px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors duration-300 inline-block"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading youth house:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  try {
    const youthHouse = await getYouthHouseBySlug(slug)
    
    if (!youthHouse) {
      return {
        title: 'Youth House Not Found',
        description: 'The requested youth house could not be found.'
      }
    }

    const house = youthHouse as YouthHouse

    return {
      title: `${house.metadata.name} | Entree Brussels`,
      description: house.metadata.description 
        ? house.metadata.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : `Discover ${house.metadata.name}, a youth house in ${house.metadata.neighborhood || 'Brussels'}.`,
      keywords: `youth house, Brussels, ${house.metadata.neighborhood}, community, activities, ${house.metadata.name}`,
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Youth House | Entree Brussels',
      description: 'Discover youth houses across Brussels and connect with vibrant communities.'
    }
  }
}