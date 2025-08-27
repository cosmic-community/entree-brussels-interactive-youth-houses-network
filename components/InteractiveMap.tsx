'use client'

import { useEffect, useRef, useState } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

export interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function InteractiveMap({ youthHouses, siteSettings }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    // Check if we have a valid Mapbox token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    if (!mapboxToken || mapboxToken === 'your-mapbox-access-token-here') {
      setMapError('Mapbox access token is required to display the map. Please configure NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment variables.')
      return
    }

    // Only initialize map if we have a valid token and container
    if (mapContainer.current && !map.current && youthHouses.length > 0) {
      // Dynamically import mapbox-gl to avoid SSR issues
      import('mapbox-gl')
        .then((mapboxgl) => {
          mapboxgl.default.accessToken = mapboxToken

          // Get map center from site settings or use default Brussels coordinates
          const centerLat = siteSettings?.metadata?.map_center_lat ? parseFloat(siteSettings.metadata.map_center_lat) : 50.8476
          const centerLng = siteSettings?.metadata?.map_center_lng ? parseFloat(siteSettings.metadata.map_center_lng) : 4.3572
          const zoom = siteSettings?.metadata?.map_zoom || 12

          map.current = new mapboxgl.default.Map({
            container: mapContainer.current!,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [centerLng, centerLat],
            zoom: zoom,
          })

          // Add markers for each youth house
          youthHouses.forEach((house) => {
            if (house.metadata?.latitude && house.metadata?.longitude) {
              const lat = parseFloat(house.metadata.latitude)
              const lng = parseFloat(house.metadata.longitude)

              // Create custom marker element
              const markerElement = document.createElement('div')
              markerElement.className = 'custom-marker'
              markerElement.style.cssText = `
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B35, #4ECDC4);
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                transition: transform 0.2s ease;
              `
              markerElement.textContent = house.metadata.name?.charAt(0).toUpperCase() || 'Y'
              
              // Add hover effect
              markerElement.addEventListener('mouseenter', () => {
                markerElement.style.transform = 'scale(1.1)'
              })
              markerElement.addEventListener('mouseleave', () => {
                markerElement.style.transform = 'scale(1)'
              })

              // Create popup content
              const popupContent = `
                <div class="p-4 max-w-sm">
                  <h3 class="font-bold text-lg text-dark mb-2">${house.metadata.name || house.title}</h3>
                  ${house.metadata.address ? `<p class="text-sm text-gray-600 mb-2">${house.metadata.address}</p>` : ''}
                  ${house.metadata.description ? `<div class="text-sm text-gray-700 mb-3 line-clamp-3">${house.metadata.description.replace(/<[^>]*>/g, '').substring(0, 120)}...</div>` : ''}
                  <div class="flex flex-wrap gap-2 mb-3">
                    ${house.metadata.age_range ? `<span class="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">${house.metadata.age_range}</span>` : ''}
                    ${house.metadata.neighborhood ? `<span class="px-2 py-1 bg-secondary/10 text-secondary text-xs rounded-full">${house.metadata.neighborhood}</span>` : ''}
                  </div>
                  <a href="/youth-houses/${house.slug}" class="inline-block px-4 py-2 bg-gradient-primary text-white text-sm font-medium rounded-lg hover:shadow-md transition-all duration-300">
                    Learn More
                  </a>
                </div>
              `

              const popup = new mapboxgl.default.Popup({
                offset: 25,
                closeButton: false,
                closeOnClick: true,
                className: 'custom-popup'
              }).setHTML(popupContent)

              // Add marker to map
              new mapboxgl.default.Marker(markerElement)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current)
            }
          })

          // Add navigation controls
          map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right')

          // Fit map to show all markers if there are multiple youth houses
          if (youthHouses.length > 1) {
            const bounds = new mapboxgl.default.LngLatBounds()
            youthHouses.forEach((house) => {
              if (house.metadata?.latitude && house.metadata?.longitude) {
                bounds.extend([
                  parseFloat(house.metadata.longitude),
                  parseFloat(house.metadata.latitude)
                ])
              }
            })
            map.current.fitBounds(bounds, { padding: 50 })
          }
        })
        .catch((error) => {
          console.error('Error loading Mapbox:', error)
          setMapError('Failed to load map. Please check your internet connection and try again.')
        })
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [youthHouses, siteSettings])

  if (mapError) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto">{mapError}</p>
        </div>
      </div>
    )
  }

  if (!youthHouses || youthHouses.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Youth Houses Found</h3>
          <p className="text-sm text-gray-600">Youth house locations will appear here once they're added to the system.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-96 relative">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-xl shadow-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-semibold text-dark mb-2">Youth Houses ({youthHouses.length})</h4>
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div className="w-4 h-4 bg-gradient-primary rounded-full border border-white"></div>
          <span>Click markers for details</span>
        </div>
      </div>

      {/* Custom CSS for map popups */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          border: none !important;
          padding: 0 !important;
        }
        
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
        
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: white !important;
        }
        
        .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: white !important;
        }
        
        .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: white !important;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}