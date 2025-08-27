'use client'

import { useEffect, useRef } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

export interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function InteractiveMap({ youthHouses, siteSettings }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  
  useEffect(() => {
    // Check if we have access token
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    if (!mapboxToken || mapboxToken === 'pk.test') {
      // Show fallback when no valid Mapbox token
      return
    }
    
    // Only initialize map if we have a valid token and container
    if (!mapContainer.current || map.current) return
    
    // Dynamically import Mapbox GL
    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = mapboxToken
      
      // Get map center from site settings or use default Brussels coordinates
      const centerLat = siteSettings?.metadata?.map_center_lat ? 
        parseFloat(siteSettings.metadata.map_center_lat) : 50.8476
      const centerLng = siteSettings?.metadata?.map_center_lng ? 
        parseFloat(siteSettings.metadata.map_center_lng) : 4.3572
      const zoom = siteSettings?.metadata?.map_zoom || 12
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: zoom
      })
      
      // Add markers for each youth house
      youthHouses.forEach((youthHouse) => {
        if (youthHouse.metadata?.latitude && youthHouse.metadata?.longitude) {
          const lat = parseFloat(youthHouse.metadata.latitude)
          const lng = parseFloat(youthHouse.metadata.longitude)
          
          // Create custom marker element
          const markerEl = document.createElement('div')
          markerEl.className = 'custom-marker'
          markerEl.style.cssText = `
            width: 30px;
            height: 30px;
            background: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%);
            border-radius: 50%;
            cursor: pointer;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s ease;
          `
          
          // Add hover effect
          markerEl.addEventListener('mouseenter', () => {
            markerEl.style.transform = 'scale(1.2)'
          })
          markerEl.addEventListener('mouseleave', () => {
            markerEl.style.transform = 'scale(1)'
          })
          
          // Create popup content
          const popupContent = `
            <div style="padding: 12px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #2D3436; font-size: 16px; font-weight: bold;">
                ${youthHouse.metadata.name || youthHouse.title}
              </h3>
              ${youthHouse.metadata.neighborhood ? 
                `<p style="margin: 0 0 8px 0; color: #636e72; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${youthHouse.metadata.neighborhood}
                </p>` : ''
              }
              ${youthHouse.metadata.address ? 
                `<p style="margin: 0 0 8px 0; color: #636e72; font-size: 14px; line-height: 1.4;">
                  ${youthHouse.metadata.address.replace(/\n/g, '<br>')}
                </p>` : ''
              }
              ${youthHouse.metadata.age_range ? 
                `<p style="margin: 0 0 12px 0; color: #00b894; font-size: 14px; font-weight: 500;">
                  Ages: ${youthHouse.metadata.age_range}
                </p>` : ''
              }
              <a href="/youth-houses/${youthHouse.slug}" 
                 style="display: inline-block; background: linear-gradient(135deg, #FF6B35 0%, #4ECDC4 100%); 
                        color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; 
                        font-size: 12px; font-weight: 500; transition: transform 0.2s ease;">
                Learn More
              </a>
            </div>
          `
          
          const popup = new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false
          }).setHTML(popupContent)
          
          // Add marker to map
          new mapboxgl.Marker(markerEl)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current)
        }
      })
    }).catch((error) => {
      console.error('Error loading Mapbox GL:', error)
    })
    
    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [youthHouses, siteSettings])

  // Check if we have access token
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  
  if (!mapboxToken || mapboxToken === 'pk.test') {
    return (
      <div className="h-96 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">📍</span>
          </div>
          <h3 className="text-xl font-semibold text-dark mb-2">Interactive Map</h3>
          <p className="text-gray-600 mb-4 max-w-sm">
            Map functionality requires a Mapbox access token. 
            Please configure your environment variables to view the interactive map.
          </p>
          <div className="grid gap-2 max-w-md">
            {youthHouses.map((house, index) => (
              <div key={house.id} className="text-left p-3 bg-white rounded-lg shadow-sm">
                <h4 className="font-medium text-dark">{house.metadata?.name || house.title}</h4>
                {house.metadata?.neighborhood && (
                  <p className="text-sm text-gray-500">{house.metadata.neighborhood}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapContainer} className="h-96 rounded-2xl overflow-hidden shadow-2xl" />
      
      {/* Map overlay with custom styles */}
      <style jsx>{`
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
          border: none !important;
        }
        .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
        .mapboxgl-popup-close-button {
          font-size: 18px !important;
          padding: 8px !important;
          color: #636e72 !important;
        }
        .mapboxgl-popup-close-button:hover {
          background: #f1f2f6 !important;
          border-radius: 50% !important;
        }
        .mapboxgl-ctrl-attrib {
          display: none !important;
        }
        .mapboxgl-ctrl-logo {
          display: none !important;
        }
      `}</style>
    </div>
  )
}