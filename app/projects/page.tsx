import { getProjects } from '@/lib/cosmic'
import { Project } from '@/types'
import ProjectCard from '@/components/ProjectCard'

export default async function ProjectsPage() {
  try {
    const projects = await getProjects()

    return (
      <div className="pt-16">
        {/* Hero Section */}
        <div className="relative py-16 px-4 bg-gradient-secondary">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Community Projects
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Explore exciting initiatives happening across Brussels youth houses. 
              Discover projects that bring young people together and create positive change in our communities.
            </p>
          </div>

          {/* Floating shapes */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-100"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-accent/30 rounded-full animate-bounce-gentle animation-delay-300"></div>
        </div>

        {/* Projects Grid */}
        <div className="py-16 px-4">
          <div className="container mx-auto">
            {projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(projects as Project[]).map((project, index) => (
                  <div 
                    key={project.id}
                    className="animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-dark mb-4">No Projects Yet</h3>
                  <p className="text-gray-600 mb-6">
                    We're currently working on exciting new projects. Check back soon to discover 
                    amazing initiatives happening across Brussels youth houses.
                  </p>
                  <a 
                    href="/contact" 
                    className="btn-primary"
                  >
                    Get Involved
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading projects:', error)
    
    return (
      <div className="pt-16">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-dark mb-4">Projects</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600 text-sm">
              Unable to load projects. Please check your connection and try again.
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export const metadata = {
  title: 'Projects | Entree Brussels - Youth Houses Network',
  description: 'Explore community projects happening across Brussels youth houses. Join initiatives that bring young people together.',
  keywords: 'Brussels projects, youth projects, community initiatives, youth houses, collaboration',
}