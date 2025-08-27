import { getSiteSettings } from '@/lib/cosmic'
import Link from 'next/link'

export default async function Footer() {
  try {
    const siteSettings = await getSiteSettings()
    
    return (
      <footer className="bg-dark text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="font-bold text-xl">Entree Brussels</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Connecting young people across Brussels with opportunities, communities, 
                and experiences that shape their future through our network of youth houses.
              </p>
              
              {/* Social Links */}
              {siteSettings?.metadata?.social_media && (
                <div className="flex gap-4">
                  {siteSettings.metadata.social_media.instagram && (
                    <a 
                      href={siteSettings.metadata.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                    >
                      <span className="text-sm font-medium">IG</span>
                    </a>
                  )}
                  {siteSettings.metadata.social_media.facebook && (
                    <a 
                      href={siteSettings.metadata.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                    >
                      <span className="text-sm font-medium">FB</span>
                    </a>
                  )}
                  {siteSettings.metadata.social_media.twitter && (
                    <a 
                      href={siteSettings.metadata.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-300"
                    >
                      <span className="text-sm font-medium">TW</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4 text-accent">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link href="/about-entree" className="text-gray-400 hover:text-white transition-colors duration-300">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold mb-4 text-accent">Contact</h4>
              <div className="space-y-2 text-gray-400">
                {siteSettings?.metadata?.contact_email && (
                  <p>
                    <a 
                      href={`mailto:${siteSettings.metadata.contact_email}`}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {siteSettings.metadata.contact_email}
                    </a>
                  </p>
                )}
                {siteSettings?.metadata?.contact_phone && (
                  <p>
                    <a 
                      href={`tel:${siteSettings.metadata.contact_phone}`}
                      className="hover:text-white transition-colors duration-300"
                    >
                      {siteSettings.metadata.contact_phone}
                    </a>
                  </p>
                )}
                <p>Brussels, Belgium</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Entree Brussels. All rights reserved.</p>
            <p className="mt-2 text-sm">
              Empowering youth communities across Brussels since 2020.
            </p>
          </div>
        </div>
      </footer>
    )
  } catch (error) {
    console.error('Error loading footer data:', error)
    
    return (
      <footer className="bg-dark text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="font-bold text-xl">Entree Brussels</span>
          </div>
          <p className="text-gray-400 mb-8">
            Connecting young people across Brussels with opportunities and communities.
          </p>
          <div className="border-t border-gray-800 pt-8 text-gray-400">
            <p>© {new Date().getFullYear()} Entree Brussels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
}