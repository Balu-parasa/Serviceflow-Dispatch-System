import * as React from "react"
import {
  Map as MapGL,
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  Source,
  Layer,
  useMap,
  MapProps as MapGLProps,
  MarkerProps,
  PopupProps
} from "react-map-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { cn } from "@/lib/utils"

// Base Map Component
export interface MapProps extends MapGLProps {
  styles?: { light: string; dark: string }
}

export const Map = React.forwardRef<any, MapProps>(
  ({ className, styles, mapStyle, children, ...props }, ref) => {
    // Default to OpenFreeMap styles if none provided
    const defaultLightStyle = "https://tiles.openfreemap.org/styles/bright"
    const defaultDarkStyle = "https://tiles.openfreemap.org/styles/liberty"
    
    // In a real implementation you might use a theme hook to switch styles,
    // but for now we'll default to the light style unless overridden.
    const resolvedStyle = mapStyle || (styles?.light ?? defaultLightStyle)

    return (
      <MapGL
        ref={ref}
        mapStyle={resolvedStyle}
        style={{ width: "100%", height: "100%" }}
        {...props}
      >
        {children}
      </MapGL>
    )
  }
)
Map.displayName = "Map"

// Map Controls
export function MapControls({
  position = "top-right",
  showZoom = true,
  showCompass = true,
  showLocate = true,
  showFullscreen = true
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  showZoom?: boolean
  showCompass?: boolean
  showLocate?: boolean
  showFullscreen?: boolean
}) {
  return (
    <>
      {showLocate && <GeolocateControl position={position} />}
      {showFullscreen && <FullscreenControl position={position} />}
      {(showZoom || showCompass) && (
        <NavigationControl 
          position={position} 
          showCompass={showCompass} 
          showZoom={showZoom} 
        />
      )}
    </>
  )
}

// Marker Components
export const MapMarker = Marker

export function MarkerContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center cursor-pointer", className)}>
      {children}
    </div>
  )
}

export function MarkerLabel({ 
  children, 
  position = "bottom",
  className 
}: { 
  children: React.ReactNode
  position?: "top" | "bottom" | "left" | "right"
  className?: string 
}) {
  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  }

  return (
    <div className={cn(
      "absolute whitespace-nowrap rounded-md bg-background/90 px-2 py-1 text-xs font-semibold shadow-md backdrop-blur",
      positionClasses[position],
      className
    )}>
      {children}
    </div>
  )
}

// Route Component
export function MapRoute({ 
  coordinates, 
  color = "#6366f1", 
  width = 5, 
  opacity = 0.8,
  onClick
}: { 
  coordinates: [number, number][]
  color?: string
  width?: number
  opacity?: number
  onClick?: () => void
}) {
  const geojson: any = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates
    }
  }

  const id = React.useId()

  return (
    <Source type="geojson" data={geojson}>
      <Layer
        id={`route-${id}`}
        type="line"
        paint={{
          "line-color": color,
          "line-width": width,
          "line-opacity": opacity
        }}
        layout={{
          "line-join": "round",
          "line-cap": "round"
        }}
      />
      {/* Invisible wider layer for easier clicking if onClick is provided */}
      {onClick && (
        <Layer
          id={`route-click-${id}`}
          type="line"
          paint={{
            "line-color": "transparent",
            "line-width": Math.max(width * 3, 15)
          }}
        />
      )}
    </Source>
  )
}

// Popup Component
export const MapPopup = Popup

// Dummy Arc type for the examples, if needed
export type MapArcDatum = { id: string; from: [number, number]; to: [number, number] }
export function MapArc<T extends MapArcDatum>(props: any) {
  // We'll skip complex arc logic for now as it's not strictly needed for the tracking map,
  // but we export it so the user's examples don't break if they copy them.
  return null
}
