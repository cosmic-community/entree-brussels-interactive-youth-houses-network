'use client'

import { useEffect, useRef } from 'react'
import { YouthHouse, SiteSettings } from '@/types'

interface InteractiveMapProps {
  youthHouses: YouthHouse[]
}

export default function InteractiveMap({ youthHouses }: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<any>(null)

  useEffect(() => {
    // Check if Mapbox GL is available and we have an access token
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    if (!accessToken || accessToken === 'pk.test') {
      console.warn('Mapbox access token not configured properly')
      return
    }

    // Dynamically import Mapbox GL to avoid SSR issues
    import('mapbox-gl').then((mapboxgl) => {
      if (!mapContainer.current || map.current) return

      mapboxgl.default.accessToken = accessToken

      map.current = new mapboxgl.default.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [4.3572, 50.8476], // Brussels center
        zoom: 12,
        attributionControl: false,
      })

      map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right')

      map.current.on('load', () => {
        // Add markers for each youth house
        youthHouses.forEach((house) => {
          if (!house.metadata.latitude || !house.metadata.longitude) return

          const lat = parseFloat(house.metadata.latitude)
          const lng = parseFloat(house.metadata.longitude)

          if (isNaN(lat) || isNaN(lng)) return

          // Create custom marker element
          const markerElement = document.createElement('div')
          markerElement.className = 'custom-marker'
          markerElement.innerHTML = `
            <div class="marker-inner">
              <div class="marker-icon">🏠</div>
            </div>
          `

          // Create popup content
          const popupContent = `
            <div class="map-popup">
              <h3 class="popup-title">${house.metadata.name}</h3>
              ${house.metadata.description ? `<div class="popup-description">${house.metadata.description.replace(/<[^>]*>/g, '').substring(0, 100)}...</div>` : ''}
              <div class="popup-details">
                ${house.metadata.phone ? `<div class="popup-phone">📞 ${house.metadata.phone}</div>` : ''}
                ${house.metadata.email ? `<div class="popup-email">✉️ ${house.metadata.email}</div>` : ''}
              </div>
              <a href="/youth-houses/${house.slug}" class="popup-link">Learn More</a>
            </div>
          `

          const popup = new mapboxgl.default.Popup({ offset: 25 }).setHTML(popupContent)

          new mapboxgl.default.Marker(markerElement)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map.current)
        })
      })
    }).catch((error) => {
      console.error('Error loading Mapbox GL:', error)
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [youthHouses])

  return (
    <div className="relative">
      {/* Map Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .mapboxgl-popup {
            max-width: 300px;
          }
          
          .mapboxgl-popup-content {
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border: none;
            padding: 0;
            overflow: hidden;
          }
          
          .mapboxgl-popup-tip {
            border-top-color: #ffffff;
          }
          
          .custom-marker {
            width: 40px;
            height: 40px;
            cursor: pointer;
            transform: translate(-50%, -100%);
            z-index: 1;
          }
          
          .marker-inner {
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #FF6B35, #4ECDC4);
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
          }
          
          .custom-marker:hover .marker-inner {
            transform: rotate(-45deg) scale(1.1);
          }
          
          .marker-icon {
            transform: rotate(45deg);
            font-size: 16px;
          }
          
          .map-popup {
            padding: 20px;
            background: white;
          }
          
          .popup-title {
            font-size: 18px;
            font-weight: bold;
            color: #2D3436;
            margin-bottom: 12px;
            line-height: 1.3;
          }
          
          .popup-description {
            font-size: 14px;
            color: #636e72;
            margin-bottom: 16px;
            line-height: 1.5;
          }
          
          .popup-details {
            margin-bottom: 16px;
          }
          
          .popup-phone,
          .popup-email {
            font-size: 13px;
            color: #2d3436;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          
          .popup-link {
            display: inline-block;
            background: linear-gradient(135deg, #FF6B35, #4ECDC4);
            color: white;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            transition: opacity 0.3s ease;
          }
          
          .popup-link:hover {
            opacity: 0.9;
          }
          
          .mapboxgl-ctrl-bottom-left,
          .mapboxgl-ctrl-bottom-right {
            display: none;
          }
          
          .mapboxgl-canvas {
            border-radius: 16px;
          }
        `
      }} />

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
        style={{ minHeight: '400px' }}
      />

      {/* Map overlay with stats */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
        <div className="text-sm font-medium text-dark">
          {youthHouses.length} Youth Houses
        </div>
        <div className="text-xs text-gray-600">
          Click markers for details
        </div>
      </div>

      {/* Loading state overlay */}
      <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    </div>
  )
}