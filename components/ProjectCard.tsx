import { Project } from '@/types'
import Link from 'next/link'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=800&h=400&fit=crop&auto=format'
  const imageUrl = project.metadata?.featured_image?.imgix_url
    ? `${project.metadata.featured_image.imgix_url}?w=800&h=400&fit=crop&auto=format,compress`
    : defaultImage

  const statusColor = project.metadata?.status?.key === 'active' ? 'bg-green-500' :
                     project.metadata?.status?.key === 'planning' ? 'bg-yellow-500' :
                     'bg-blue-500'

  const categoryColor = project.metadata?.category?.key === 'arts' ? 'bg-purple-100 text-purple-800' :
                       project.metadata?.category?.key === 'education' ? 'bg-blue-100 text-blue-800' :
                       project.metadata?.category?.key === 'community' ? 'bg-green-100 text-green-800' :
                       project.metadata?.category?.key === 'sports' ? 'bg-orange-100 text-orange-800' :
                       'bg-gray-100 text-gray-800'

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover-lift overflow-hidden">
      {/* Floating shapes that appear on hover */}
      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full opacity-0 group-hover:opacity-30 transition-all duration-300 group-hover:animate-bounce-gentle"></div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-secondary rounded-full opacity-0 group-hover:opacity-30 transition-all duration-300 group-hover:animate-float"></div>
      
      <div className="relative overflow-hidden rounded-t-2xl">
        <img 
          src={imageUrl}
          alt={project.metadata?.title || project.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          width="400"
          height="200"
        />
        
        {/* Status badge */}
        {project.metadata?.status && (
          <div className="absolute top-4 left-4">
            <div className={`${statusColor} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              {project.metadata.status.value}
            </div>
          </div>
        )}

        {/* Category badge */}
        {project.metadata?.category && (
          <div className="absolute top-4 right-4">
            <div className={`${categoryColor} px-3 py-1 rounded-full text-xs font-medium`}>
              {project.metadata.category.value}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-300">
          {project.metadata?.title || project.title}
        </h3>
        
        <p className="text-gray-600 mb-4 leading-relaxed">
          {project.metadata?.short_description && project.metadata.short_description.length > 120
            ? `${project.metadata.short_description.substring(0, 120)}...`
            : project.metadata?.short_description || 'No description available.'
          }
        </p>

        {/* Youth houses involved */}
        {project.metadata?.youth_houses_involved && project.metadata.youth_houses_involved.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Youth Houses Involved:</p>
            <div className="flex flex-wrap gap-2">
              {project.metadata.youth_houses_involved.slice(0, 2).map((house) => (
                <span 
                  key={house.id}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                >
                  {house.metadata?.name || house.title}
                </span>
              ))}
              {project.metadata.youth_houses_involved.length > 2 && (
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  +{project.metadata.youth_houses_involved.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        {(project.metadata?.start_date || project.metadata?.end_date) && (
          <div className="mb-4 text-sm text-gray-500">
            {project.metadata.start_date && (
              <span>Start: {new Date(project.metadata.start_date).toLocaleDateString()}</span>
            )}
            {project.metadata.start_date && project.metadata.end_date && <span> • </span>}
            {project.metadata.end_date && (
              <span>End: {new Date(project.metadata.end_date).toLocaleDateString()}</span>
            )}
          </div>
        )}

        <Link 
          href={`/projects/${project.slug}`}
          className="btn-outline w-full text-center group/btn"
        >
          Read More
          <svg 
            className="w-4 h-4 ml-2 inline transition-transform duration-300 group-hover/btn:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}