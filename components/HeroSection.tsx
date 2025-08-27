'use client'

import { YouthHouse, SiteSettings } from '@/types'
import InteractiveMap from '@/components/InteractiveMap'

interface HeroSectionProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function HeroSection({ youthHouses, siteSettings }: HeroSectionProps) {
  const heroTitle = siteSettings?.metadata?.hero_title || 'Discover Youth Houses in Brussels'
  const heroSubtitle = siteSettings?.metadata?.hero_subtitle || 'Connect with vibrant communities, join exciting projects, and find your place in Brussels\' youth network.'

  return (
    <section className="relative pt-24 pb-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">{heroTitle}</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {heroSubtitle}
          </p>
        </div>

        <div className="relative animate-slide-in-up animation-delay-300">
          <InteractiveMap 
            youthHouses={youthHouses} 
            siteSettings={siteSettings}
          />
          
          {/* Floating shapes around the map */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-accent rounded-full opacity-20 animate-float animation-delay-100"></div>
          <div className="absolute -top-4 -right-12 w-12 h-12 bg-secondary rounded-full opacity-20 animate-bounce-gentle animation-delay-200"></div>
          <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-primary rounded-full opacity-20 animate-float animation-delay-400"></div>
          <div className="absolute -bottom-8 -right-8 w-14 h-14 bg-accent rounded-full opacity-20 animate-pulse-slow animation-delay-300"></div>
        </div>

        <div className="text-center mt-12 animate-fade-in animation-delay-500">
          <p className="text-lg text-gray-600 mb-6">
            Click on any marker to explore youth houses and their activities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-dark">Youth Houses</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="w-4 h-4 bg-secondary rounded-full"></div>
              <span className="text-sm font-medium text-dark">Active Projects</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="w-4 h-4 bg-accent rounded-full"></div>
              <span className="text-sm font-medium text-dark">Community Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}