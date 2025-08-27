'use client'

import { useEffect, useRef, useState } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  siteSettings: SiteSettings | null
}

export default function InteractiveMap({ youthHouses, siteSettings }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const initializeMap = async () => {
      try {
        // Dynamic import for Leaflet to ensure it only loads on client side
        const L = (await import('leaflet')).default

        // Fix for default markers in production
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

        // Get map center from settings or default to Brussels
        const centerLat = parseFloat(siteSettings?.metadata?.map_center_lat || '50.8476')
        const centerLng = parseFloat(siteSettings?.metadata?.map_center_lng || '4.3572')
        const zoomLevel = siteSettings?.metadata?.map_zoom || 12

        const mapInstance = L.map(mapRef.current).setView([centerLat, centerLng], zoomLevel)

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance)

        // Custom marker HTML
        const createCustomIcon = (color: string) => {
          return L.divIcon({
            html: `
              <div class="relative">
                <div class="w-6 h-6 bg-${color} rounded-full border-4 border-white shadow-lg animate-bounce-gentle" style="background-color: ${
                  color === 'primary' ? '#FF6B35' : 
                  color === 'secondary' ? '#4ECDC4' : '#FFE66D'
                }"></div>
                <div class="absolute top-0 left-0 w-6 h-6 bg-${color} rounded-full opacity-50 animate-ping" style="background-color: ${
                  color === 'primary' ? '#FF6B35' : 
                  color === 'secondary' ? '#4ECDC4' : '#FFE66D'
                }"></div>
              </div>
            `,
            className: 'custom-marker',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }

        // Add markers for youth houses
        youthHouses.forEach((house, index) => {
          if (!house.metadata?.latitude || !house.metadata?.longitude) return

          const lat = parseFloat(house.metadata.latitude)
          const lng = parseFloat(house.metadata.longitude)
          
          if (isNaN(lat) || isNaN(lng)) return

          const colors = ['primary', 'secondary', 'accent']
          const color = colors[index % colors.length]
          
          const marker = L.marker([lat, lng], {
            icon: createCustomIcon(color)
          }).addTo(mapInstance)

          // Create popup content
          const popupContent = `
            <div class="p-4 max-w-xs">
              <h3 class="font-bold text-lg text-dark mb-2">${house.metadata.name}</h3>
              ${house.metadata.neighborhood ? `<p class="text-sm text-gray-600 mb-2">📍 ${house.metadata.neighborhood}</p>` : ''}
              ${house.metadata.age_range ? `<p class="text-sm text-gray-600 mb-3">👥 Ages: ${house.metadata.age_range}</p>` : ''}
              ${house.metadata.description ? `<p class="text-sm text-gray-700 mb-3 line-clamp-3">${house.metadata.description.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>` : ''}
              <a href="/youth-houses/${house.slug}" 
                 class="inline-block bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all duration-300">
                Learn More →
              </a>
            </div>
          `

          marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          })

          // Add hover effect
          marker.on('mouseover', function() {
            this.openPopup()
          })
        })

        setMap(mapInstance)
        setIsMapLoaded(true)

        // Cleanup function
        return () => {
          mapInstance.remove()
        }
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    initializeMap()
  }, [youthHouses, siteSettings])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-xl shadow-2xl overflow-hidden"
      />
      
      {!isMapLoaded && (
        <div className="absolute inset-0 bg-gray-100 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading interactive map...</p>
          </div>
        </div>
      )}

      {youthHouses.length === 0 && isMapLoaded && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-xs">
          <p className="text-sm text-gray-600">
            No youth houses available to display on the map.
          </p>
        </div>
      )}

      <style jsx>{`
        :global(.custom-popup .leaflet-popup-content-wrapper) {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        :global(.custom-popup .leaflet-popup-tip) {
          background: white;
        }
        
        :global(.line-clamp-3) {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}