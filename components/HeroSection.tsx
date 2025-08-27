import { YouthHouse, SiteSettings } from '@/types'
import InteractiveMap from './InteractiveMap'
import AnimatedShapes from './AnimatedShapes'

interface HeroSectionProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function HeroSection({ youthHouses, siteSettings }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-gradient-primary flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                {siteSettings?.metadata?.hero_title || "Discover Youth Houses in Brussels"}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                {siteSettings?.metadata?.hero_subtitle || "Connect with vibrant communities, join exciting projects, and find your place in Brussels' youth network."}
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8 py-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">{youthHouses.length}</div>
                <div className="text-white/80">Youth Houses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">50+</div>
                <div className="text-white/80">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">1000+</div>
                <div className="text-white/80">Young People</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 bg-white text-dark font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                Explore Youth Houses
              </button>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-dark transition-all duration-300 transform hover:scale-105">
                View Projects
              </button>
            </div>
          </div>

          {/* Right Content - Interactive Map */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Find Youth Houses Near You</h3>
              <InteractiveMap youthHouses={youthHouses} siteSettings={siteSettings} />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Shapes */}
      <AnimatedShapes />
    </section>
  )
}