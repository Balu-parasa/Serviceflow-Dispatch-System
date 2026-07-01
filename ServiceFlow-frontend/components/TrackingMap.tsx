"use client"

import { useEffect, useState, useRef } from "react"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapRoute,
  MapControls
} from "@/components/ui/map"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TrackingMapProps {
  techLocation: { lat?: number; lng?: number; latitude?: number; longitude?: number } | null
  destination: { lat?: number; lng?: number; latitude?: number; longitude?: number } | null
  techName: string
}

interface RouteData {
  coordinates: [number, number][]
  duration: number
  distance: number
}

export default function TrackingMap({ techLocation, destination, techName }: TrackingMapProps) {
  const mapRef = useRef<any>(null)
  const [route, setRoute] = useState<RouteData | null>(null)
  const [isLoadingRoute, setIsLoadingRoute] = useState(false)

  const techLat = techLocation?.lat ?? techLocation?.latitude
  const techLng = techLocation?.lng ?? techLocation?.longitude
  const destLat = destination?.lat ?? destination?.latitude
  const destLng = destination?.lng ?? destination?.longitude

  // Default to San Francisco if no coordinates are provided
  const centerLng = destLng ?? techLng ?? -122.4194
  const centerLat = destLat ?? techLat ?? 37.7749

  // Fetch OSRM Route
  useEffect(() => {
    async function fetchRoute() {
      if (techLat === undefined || techLng === undefined || destLat === undefined || destLng === undefined) {
        return
      }

      setIsLoadingRoute(true)
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${techLng},${techLat};${destLng},${destLat}?overview=full&geometries=geojson`
        )
        const data = await response.json()

        if (data.routes?.length > 0) {
          const r = data.routes[0]
          setRoute({
            coordinates: r.geometry.coordinates,
            duration: r.duration,
            distance: r.distance,
          })

          // Animate the map to fit the route with a cool 3D perspective
          if (mapRef.current) {
            const map = mapRef.current.getMap()
            
            // Calculate bounds
            const bounds = r.geometry.coordinates.reduce(
              (bounds: any, coord: any) => bounds.extend(coord),
              new window.maplibregl.LngLatBounds(r.geometry.coordinates[0], r.geometry.coordinates[0])
            )

            map.fitBounds(bounds, {
              padding: { top: 60, bottom: 60, left: 60, right: 60 },
              pitch: 45, // 3D Tilt!
              duration: 2000 // Smooth fly-to animation
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch route:", error)
        toast.error("Failed to calculate live route")
      } finally {
        setIsLoadingRoute(false)
      }
    }

    fetchRoute()
  }, [techLat, techLng, destLat, destLng])

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 14,
          pitch: 0,
        }}
        styles={{
          light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
          dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        }}
      >
        <MapControls showCompass showLocate showZoom={false} showFullscreen={false} position="bottom-right" />

        {/* The glowing OSRM Route */}
        {route && (
          <MapRoute
            coordinates={route.coordinates}
            color="hsl(var(--primary))"
            width={6}
            opacity={0.8}
          />
        )}

        {/* Technician Marker */}
        {techLat !== undefined && techLng !== undefined && (
          <MapMarker longitude={techLng} latitude={techLat} anchor="center">
            <MarkerContent>
              {/* Outer pulsing ring */}
              <div className="absolute -inset-2 animate-ping rounded-full bg-primary/40 opacity-75" />
              {/* Inner glowing dot */}
              <div className="relative h-4 w-4 rounded-full bg-primary shadow-[0_0_15px_3px_hsl(var(--primary))] border-2 border-background z-10" />
              <MarkerLabel position="top" className="whitespace-nowrap font-bold text-primary shadow-xl">
                {techName}
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}

        {/* Destination Marker */}
        {destLat !== undefined && destLng !== undefined && (
          <MapMarker longitude={destLng} latitude={destLat} anchor="bottom">
            <MarkerContent>
              {/* Stand pin style */}
              <div className="relative flex flex-col items-center">
                <div className="h-6 w-6 rounded-full bg-success flex items-center justify-center shadow-lg border-2 border-background z-10">
                  <div className="h-2 w-2 rounded-full bg-background" />
                </div>
                {/* Pin bottom needle */}
                <div className="h-2 w-1 bg-success rounded-b-sm" />
              </div>
              <MarkerLabel position="bottom" className="font-semibold text-success shadow-lg">
                Your Location
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}
      </Map>

      {/* Loading Overlay */}
      {isLoadingRoute && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-sm z-20 transition-opacity">
          <div className="flex flex-col items-center gap-2 rounded-xl bg-background/90 px-4 py-3 shadow-xl backdrop-blur">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-xs font-medium text-foreground">Calculating Live Route...</span>
          </div>
        </div>
      )}
    </div>
  )
}
