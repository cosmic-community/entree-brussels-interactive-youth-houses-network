'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { YouthHouse } from '@/types'

// Set Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZW50cmVlYnJ1c3NlbHMiLCJhIjoiY2x1eGJ5M3p5MDJ5cDJrbzM0YW84ZGQzdiJ9.X8f_123456789'

interface InteractiveMapProps {
  youthHouses: YouthHouse[]
  centerLat?: string
  centerLng?: string
  zoom?: number
}

export default function InteractiveMap({ 
  youthHouses, 
  centerLat = '50.8476', 
  centerLng = '4.3572', 
  zoom = 12 
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Ensure map container exists before initializing
    if (!mapContainerRef.current) {
      console.error('Map container ref is null')
      return
    }

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current, // Now guaranteed to be non-null
      style: 'mapbox://styles/mapbox/light-v11',
      center: [parseFloat(centerLng), parseFloat(centerLat)],
      zoom: zoom,
      attributionControl: false
    })

    mapRef.current = map

    // Add custom controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({
      compact: true,
      customAttribution: '© Entree Brussels'
    }), 'bottom-right')

    map.on('load', () => {
      setIsLoaded(true)
      
      // Add markers for each youth house
      youthHouses.forEach((youthHouse) => {
        if (!youthHouse.metadata?.latitude || !youthHouse.metadata?.longitude) {
          console.warn(`Youth house ${youthHouse.title} missing coordinates`)
          return
        }

        // Create popup content with null checks
        const popupContent = createPopupContent(youthHouse)
        
        // Create popup
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(popupContent) // popupContent is now guaranteed to be a string

        // Create custom marker element
        const markerElement = document.createElement('div')
        markerElement.className = 'custom-marker'
        markerElement.innerHTML = `
          <div class="marker-pulse"></div>
          <div class="marker-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#FF6B35"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          </div>
        `

        // Add click handler with proper typing
        markerElement.addEventListener('click', function(this: HTMLDivElement, e: MouseEvent) {
          e.stopPropagation()
          // Toggle popup visibility
          if (popup.isOpen()) {
            popup.remove()
          } else {
            popup.addTo(map)
          }
        })

        // Create marker
        new mapboxgl.Marker(markerElement)
          .setLngLat([
            parseFloat(youthHouse.metadata.longitude),
            parseFloat(youthHouse.metadata.latitude)
          ])
          .setPopup(popup)
          .addTo(map)
      })
    })

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
      }
    }
  }, [youthHouses, centerLat, centerLng, zoom])

  // Helper function to create popup content with proper typing
  function createPopupContent(youthHouse: YouthHouse): string {
    const name = youthHouse.metadata?.name || youthHouse.title
    const description = youthHouse.metadata?.description || ''
    const address = youthHouse.metadata?.address || ''
    const phone = youthHouse.metadata?.phone || ''
    const email = youthHouse.metadata?.email || ''
    const website = youthHouse.metadata?.website || ''
    const imageUrl = youthHouse.metadata?.featured_image?.imgix_url

    return `
      <div class="popup-content">
        ${imageUrl ? `<img src="${imageUrl}?w=300&h=200&fit=crop&auto=format,compress" alt="${name}" class="popup-image" />` : ''}
        <div class="popup-text">
          <h3 class="popup-title">${name}</h3>
          ${description ? `<p class="popup-description">${description.replace(/<[^>]*>/g, '').slice(0, 100)}...</p>` : ''}
          ${address ? `<p class="popup-address"><strong>📍</strong> ${address.split('\n')[0]}</p>` : ''}
          <div class="popup-actions">
            ${phone ? `<a href="tel:${phone}" class="popup-link">📞 Call</a>` : ''}
            ${email ? `<a href="mailto:${email}" class="popup-link">✉️ Email</a>` : ''}
            ${website ? `<a href="${website}" target="_blank" rel="noopener noreferrer" class="popup-link">🌐 Website</a>` : ''}
            <a href="/youth-houses/${youthHouse.slug}" class="popup-link popup-link-primary">View Details</a>
          </div>
        </div>
      </div>
    `
  }

  return (
    <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <div 
        ref={mapContainerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Custom CSS - removing jsx prop and using dangerouslySetInnerHTML */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-marker {
            position: relative;
            cursor: pointer;
            transform: translate(-12px, -24px);
          }
          
          .marker-pulse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40px;
            height: 40px;
            background: rgba(255, 107, 53, 0.3);
            border-radius: 50%;
            animation: pulse 2s infinite;
          }
          
          .marker-content {
            position: relative;
            z-index: 1;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
            transition: transform 0.2s ease;
          }
          
          .custom-marker:hover .marker-content {
            transform: scale(1.1);
          }
          
          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0;
            }
          }

          .mapboxgl-popup-content {
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            max-width: 350px;
          }

          .popup-content {
            border-radius: 12px;
            overflow: hidden;
          }

          .popup-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
          }

          .popup-text {
            padding: 16px;
          }

          .popup-title {
            font-size: 18px;
            font-weight: bold;
            color: #2D3436;
            margin: 0 0 8px 0;
          }

          .popup-description {
            font-size: 14px;
            color: #636e72;
            margin: 0 0 12px 0;
            line-height: 1.4;
          }

          .popup-address {
            font-size: 13px;
            color: #636e72;
            margin: 0 0 12px 0;
          }

          .popup-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
          }

          .popup-link {
            font-size: 12px;
            padding: 6px 12px;
            border-radius: 20px;
            text-decoration: none;
            background: #f8f9fa;
            color: #2D3436;
            border: 1px solid #e9ecef;
            transition: all 0.2s ease;
          }

          .popup-link:hover {
            background: #e9ecef;
            transform: translateY(-1px);
          }

          .popup-link-primary {
            background: #FF6B35;
            color: white;
            border-color: #FF6B35;
          }

          .popup-link-primary:hover {
            background: #e55a2b;
            color: white;
          }

          .mapboxgl-popup-close-button {
            color: #2D3436;
            font-size: 20px;
            font-weight: bold;
            right: 8px;
            top: 8px;
          }
        `
      }} />
    </div>
  )
}