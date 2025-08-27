'use client'

import { useEffect, useRef, useState } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function InteractiveMap({ youthHouses, siteSettings }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Default map settings
  const defaultCenter = { lat: 50.8476, lng: 4.3572 }
  const defaultZoom = 12

  // Get map settings from siteSettings or use defaults
  const mapCenter = {
    lat: siteSettings?.metadata?.map_center_lat 
      ? parseFloat(siteSettings.metadata.map_center_lat) 
      : defaultCenter.lat,
    lng: siteSettings?.metadata?.map_center_lng 
      ? parseFloat(siteSettings.metadata.map_center_lng) 
      : defaultCenter.lng
  }
  const mapZoom = siteSettings?.metadata?.map_zoom ?? defaultZoom

  useEffect(() => {
    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      try {
        // Import mapbox-gl dynamically to avoid SSR issues
        const mapboxgl = await import('mapbox-gl')
        
        if (map.current || !mapContainer.current) return

        // Initialize map
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [mapCenter.lng, mapCenter.lat],
          zoom: mapZoom,
          accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.test'
        })

        map.current.on('load', () => {
          setIsMapLoaded(true)
        })

        // Add markers for youth houses
        youthHouses.forEach((youthHouse) => {
          if (youthHouse.metadata?.latitude && youthHouse.metadata?.longitude) {
            const lat = parseFloat(youthHouse.metadata.latitude)
            const lng = parseFloat(youthHouse.metadata.longitude)

            if (!isNaN(lat) && !isNaN(lng)) {
              // Create custom marker element
              const markerElement = document.createElement('div')
              markerElement.className = 'w-8 h-8 bg-primary rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200'
              
              // Create popup
              const popup = new mapboxgl.default.Popup({ 
                offset: 25,
                className: 'youth-house-popup'
              }).setHTML(`
                <div class="p-3 max-w-xs">
                  <h3 class="font-bold text-lg text-dark mb-2">${youthHouse.metadata?.name || youthHouse.title}</h3>
                  ${youthHouse.metadata?.neighborhood ? `<p class="text-sm text-gray-600 mb-2">📍 ${youthHouse.metadata.neighborhood}</p>` : ''}
                  ${youthHouse.metadata?.age_range ? `<p class="text-sm text-gray-600 mb-2">👥 ${youthHouse.metadata.age_range}</p>` : ''}
                  ${youthHouse.metadata?.address ? `<p class="text-sm text-gray-600 mb-3">${youthHouse.metadata.address.replace(/\n/g, '<br>')}</p>` : ''}
                  <a href="/youth-houses/${youthHouse.slug}" class="inline-block bg-primary text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    Learn More
                  </a>
                </div>
              `)

              // Add marker to map
              new mapboxgl.default.Marker(markerElement)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(map.current)
            }
          }
        })
      } catch (error) {
        console.error('Error loading map:', error)
        setIsMapLoaded(false)
      }
    }

    loadMapbox()

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [youthHouses, mapCenter.lat, mapCenter.lng, mapZoom])

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapContainer}
        className="w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-2xl"
      />
      
      {/* Loading State */}
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Map Legend */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs">
        <h4 className="font-bold text-dark mb-2">Youth Houses Map</h4>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <span>Youth House Location</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click on markers to learn more about each youth house
        </p>
      </div>
    </div>
  )
}