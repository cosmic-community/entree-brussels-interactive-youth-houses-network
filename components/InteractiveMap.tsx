'use client'

import { useEffect, useRef, useState } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  siteSettings?: SiteSettings | null
}

export default function InteractiveMap({ youthHouses, siteSettings }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [selectedHouse, setSelectedHouse] = useState<YouthHouse | null>(null)
  const [mapboxLoaded, setMapboxLoaded] = useState(false)

  // Get map settings from site settings or use defaults
  const centerLat = siteSettings?.metadata?.map_center_lat ? parseFloat(siteSettings.metadata.map_center_lat) : 50.8476
  const centerLng = siteSettings?.metadata?.map_center_lng ? parseFloat(siteSettings.metadata.map_center_lng) : 4.3572
  const zoomLevel = siteSettings?.metadata?.map_zoom || 12

  useEffect(() => {
    // Dynamically import mapbox-gl only on client side
    const loadMapbox = async () => {
      if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
        console.warn('Mapbox access token not found. Map will not be displayed.')
        return
      }

      try {
        const mapboxgl = (await import('mapbox-gl')).default
        
        if (!mapContainer.current || map.current) return

        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [centerLng, centerLat],
          zoom: zoomLevel,
          attributionControl: false
        })

        map.current.on('load', () => {
          setMapboxLoaded(true)
          
          // Add markers for each youth house
          youthHouses.forEach((house) => {
            if (house.metadata?.latitude && house.metadata?.longitude) {
              const lat = parseFloat(house.metadata.latitude)
              const lng = parseFloat(house.metadata.longitude)

              // Create custom marker element
              const markerEl = document.createElement('div')
              markerEl.className = 'youth-house-marker'
              markerEl.style.cssText = `
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B35, #4ECDC4);
                border: 3px solid white;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: all 0.3s ease;
              `
              markerEl.textContent = house.metadata.name?.charAt(0) || 'Y'

              // Add hover effects
              markerEl.addEventListener('mouseenter', () => {
                markerEl.style.transform = 'scale(1.2)'
                markerEl.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.3)'
              })

              markerEl.addEventListener('mouseleave', () => {
                markerEl.style.transform = 'scale(1)'
                markerEl.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'
              })

              // Add click handler
              markerEl.addEventListener('click', () => {
                setSelectedHouse(house)
                map.current?.flyTo({
                  center: [lng, lat],
                  zoom: 15,
                  duration: 1000
                })
              })

              // Add marker to map
              new mapboxgl.Marker(markerEl)
                .setLngLat([lng, lat])
                .addTo(map.current)
            }
          })

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

          // Add custom attribution
          map.current.addControl(
            new mapboxgl.AttributionControl({
              customAttribution: '© Entree Brussels'
            })
          )
        })

      } catch (error) {
        console.error('Error loading Mapbox:', error)
      }
    }

    loadMapbox()

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [centerLat, centerLng, zoomLevel, youthHouses])

  // Handle map resize when container changes
  useEffect(() => {
    if (map.current && mapboxLoaded) {
      const handleResize = () => {
        map.current?.resize()
      }
      
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [mapboxLoaded])

  if (!process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-gray-600 text-2xl">📍</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
        <p className="text-gray-600 text-sm">
          Mapbox access token is required to display the interactive map.
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Mapbox GL CSS - properly formatted for HTML */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css');
          
          .mapboxgl-popup {
            max-width: 300px !important;
          }
          
          .mapboxgl-popup-content {
            border-radius: 12px !important;
            padding: 0 !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
          }
          
          .mapboxgl-popup-close-button {
            right: 8px !important;
            top: 8px !important;
            font-size: 18px !important;
            width: 24px !important;
            height: 24px !important;
            color: #666 !important;
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
          
          .youth-house-marker:hover {
            z-index: 1000;
          }
          
          @media (max-width: 768px) {
            .mapboxgl-popup {
              max-width: 250px !important;
            }
          }
        `
      }} />

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 md:h-[500px] rounded-xl shadow-lg overflow-hidden bg-gray-100"
        style={{ minHeight: '400px' }}
      />

      {/* Loading Overlay */}
      {!mapboxLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading map...</p>
          </div>
        </div>
      )}

      {/* Selected House Info Panel */}
      {selectedHouse && (
        <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg p-4 max-w-sm z-10 border border-gray-200">
          <button
            onClick={() => setSelectedHouse(null)}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-colors duration-200"
            aria-label="Close info panel"
          >
            ×
          </button>
          
          <div className="pr-6">
            <h3 className="font-bold text-lg text-dark mb-2">
              {selectedHouse.metadata?.name || selectedHouse.title}
            </h3>
            
            {selectedHouse.metadata?.address && (
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {selectedHouse.metadata.address}
              </p>
            )}
            
            {selectedHouse.metadata?.description && (
              <div 
                className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedHouse.metadata.description }}
              />
            )}
            
            {selectedHouse.metadata?.age_range && (
              <div className="mt-3 inline-block bg-accent/20 text-accent px-3 py-1 rounded-full text-xs font-medium">
                Ages {selectedHouse.metadata.age_range}
              </div>
            )}
            
            {(selectedHouse.metadata?.phone || selectedHouse.metadata?.email || selectedHouse.metadata?.website) && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {selectedHouse.metadata.phone && (
                    <a 
                      href={`tel:${selectedHouse.metadata.phone}`}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md hover:bg-primary/20 transition-colors duration-200"
                    >
                      📞 Call
                    </a>
                  )}
                  {selectedHouse.metadata.email && (
                    <a 
                      href={`mailto:${selectedHouse.metadata.email}`}
                      className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-md hover:bg-secondary/20 transition-colors duration-200"
                    >
                      ✉️ Email
                    </a>
                  )}
                  {selectedHouse.metadata.website && (
                    <a 
                      href={selectedHouse.metadata.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md hover:bg-accent/20 transition-colors duration-200"
                    >
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)' 
            }}
          ></div>
          <span className="text-sm font-medium text-gray-700">Youth Houses</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Click markers for details
        </p>
      </div>
    </div>
  )
}