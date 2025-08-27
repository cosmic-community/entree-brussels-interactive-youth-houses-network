import { YouthHouse, SiteSettings } from '@/types'
import InteractiveMap from './InteractiveMap'

interface HeroSectionProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function HeroSection({ youthHouses, siteSettings }: HeroSectionProps) {
  const heroTitle = siteSettings?.metadata?.hero_title || 'Discover Youth Houses in Brussels'
  const heroSubtitle = siteSettings?.metadata?.hero_subtitle || 'Connect with vibrant communities, join exciting projects, and find your place in Brussels\' youth network.'

  return (
    <section className="pt-16 pb-20 px-4 bg-gradient-primary relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-accent/20 rounded-full blur-lg animate-bounce-gentle animation-delay-200"></div>
      <div className="absolute top-40 right-40 w-16 h-16 bg-secondary/30 rounded-full animate-pulse animation-delay-400"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {heroTitle}
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explore Youth Houses
              </button>
              
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                View Projects
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{youthHouses?.length || 0}</div>
                <div className="text-sm text-white/80">Youth Houses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">15+</div>
                <div className="text-sm text-white/80">Neighborhoods</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-white/80">Young People</div>
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Map */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <h3 className="text-white text-xl font-semibold mb-4 text-center">
                Interactive Map
              </h3>
              <InteractiveMap 
                youthHouses={youthHouses || []} 
                siteSettings={siteSettings}
              />
            </div>
            
            {/* Floating elements around map */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-accent rounded-full animate-bounce-gentle animation-delay-100"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary rounded-full animate-float animation-delay-300"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-20 fill-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  )
}