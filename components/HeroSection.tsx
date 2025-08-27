import { YouthHouse, SiteSettings } from '@/types'
import InteractiveMap from './InteractiveMap'

interface HeroSectionProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function HeroSection({ youthHouses, siteSettings }: HeroSectionProps) {
  return (
    <div className="pt-16">
      {/* Hero Content */}
      <div className="relative overflow-hidden bg-gradient-primary py-20 px-4">
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {siteSettings?.metadata?.hero_title || 'Discover Youth Houses in Brussels'}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            {siteSettings?.metadata?.hero_subtitle || 'Connect with vibrant communities, join exciting projects, and find your place in Brussels\' youth network.'}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Explore Youth Houses
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105">
              View Projects
            </button>
          </div>
        </div>

        {/* Animated Background Shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float animation-delay-100"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-accent/20 rounded-full animate-bounce-gentle animation-delay-200"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary/20 rounded-full animate-float animation-delay-300"></div>
        <div className="absolute bottom-1/3 right-10 w-14 h-14 bg-white/10 rounded-full animate-bounce-gentle animation-delay-400"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="py-16 px-4 bg-light">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              Find Youth Houses Near You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover {youthHouses.length} amazing youth houses across Brussels. 
              Each location offers unique programs, activities, and opportunities for young people.
            </p>
          </div>
          
          <InteractiveMap youthHouses={youthHouses} siteSettings={siteSettings} />
        </div>
      </div>
    </div>
  )
}