import { getFeaturedProjects, getYouthHouses, getSiteSettings } from '@/lib/cosmic'
import { Project, YouthHouse, SiteSettings } from '@/types'
import HeroSection from '@/components/HeroSection'
import ProjectsSection from '@/components/ProjectsSection'
import ContactForm from '@/components/ContactForm'
import AnimatedShapes from '@/components/AnimatedShapes'

export default async function HomePage() {
  try {
    const [projects, youthHouses, siteSettings] = await Promise.all([
      getFeaturedProjects(),
      getYouthHouses(),
      getSiteSettings(),
    ])

    return (
      <div className="relative overflow-hidden">
        <AnimatedShapes />
        
        <HeroSection 
          youthHouses={youthHouses as YouthHouse[]} 
          siteSettings={siteSettings as SiteSettings}
        />
        
        <ProjectsSection projects={projects as Project[]} />
        
        <ContactForm siteSettings={siteSettings as SiteSettings} />
      </div>
    )
  } catch (error) {
    console.error('Error loading homepage data:', error)
    
    return (
      <div className="relative overflow-hidden">
        <AnimatedShapes />
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">
            Welcome to Entree Brussels
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover and connect with youth houses across Brussels
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 text-sm">
              Unable to load content. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    )
  }
}