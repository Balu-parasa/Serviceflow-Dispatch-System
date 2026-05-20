"use client"

import { useEffect, useRef } from "react"

interface MapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  technicianLocation?: { lat: number; lng: number }
  destinationLocation?: { lat: number; lng: number }
}

export default function TacticalMap({
  center = { lat: 37.7749, lng: -122.4194 },
  technicianLocation = { lat: 37.7749, lng: -122.4194 },
  destinationLocation = { lat: 37.7849, lng: -122.4094 },
}: MapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    // Set high density pixels if retina display
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const render = () => {
      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, width, height)

      // Draw Grid lines (Tactical Grid)
      ctx.strokeStyle = "rgba(59, 130, 246, 0.08)"
      ctx.lineWidth = 1
      const gridSize = 40
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw concentric radar circles
      const centerX = width / 2
      const centerY = height / 2
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY)

      ctx.lineWidth = 1.5
      for (let r = 80; r < maxRadius; r += 80) {
        ctx.strokeStyle = `rgba(59, 130, 246, ${Math.max(0.02, 0.15 - r / 600)})`
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.stroke()
        
        // Add distance labels
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
        ctx.font = "8px monospace"
        ctx.fillText(`${(r / 100).toFixed(1)} km`, centerX + r + 4, centerY + 3)
      }

      // Draw Radar Sweep
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)
      
      const sweepGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius)
      sweepGradient.addColorStop(0, "rgba(59, 130, 246, 0.15)")
      sweepGradient.addColorStop(0.2, "rgba(59, 130, 246, 0.05)")
      sweepGradient.addColorStop(1, "rgba(59, 130, 246, 0)")
      
      ctx.fillStyle = sweepGradient
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, maxRadius, -0.2, 0)
      ctx.lineTo(0, 0)
      ctx.fill()
      ctx.restore()

      // Node coordinates (mapped relative to center)
      const techX = centerX - 60
      const techY = centerY + 40
      const destX = centerX + 80
      const destY = centerY - 50

      // Draw Connection line between Technician and Destination
      ctx.beginPath()
      ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.moveTo(techX, techY)
      ctx.lineTo(destX, destY)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw Destination Node (Customer Location)
      ctx.save()
      const pulseRadius = 10 + Math.sin(Date.now() / 200) * 4
      ctx.shadowBlur = 15
      ctx.shadowColor = "#f59e0b"
      ctx.fillStyle = "rgba(245, 158, 11, 0.2)"
      ctx.beginPath()
      ctx.arc(destX, destY, pulseRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(destX, destY, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 9px system-ui"
      ctx.fillText("CLIENT (DEST)", destX + 10, destY - 2)
      ctx.fillStyle = "rgba(245, 158, 11, 0.8)"
      ctx.font = "8px monospace"
      ctx.fillText(`${destinationLocation.lat.toFixed(4)}, ${destinationLocation.lng.toFixed(4)}`, destX + 10, destY + 8)

      // Draw Technician Node (Self Location)
      ctx.save()
      ctx.shadowBlur = 20
      ctx.shadowColor = "#3b82f6"
      const techPulse = 12 + Math.cos(Date.now() / 250) * 5
      ctx.fillStyle = "rgba(59, 130, 246, 0.25)"
      ctx.beginPath()
      ctx.arc(techX, techY, techPulse, 0, Math.PI * 2)
      ctx.fill()

      // Outer ring
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(techX, techY, 8, 0, Math.PI * 2)
      ctx.stroke()

      // Core point
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(techX, techY, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 9px system-ui"
      ctx.fillText("TECH (YOU)", techX + 12, techY - 2)
      ctx.fillStyle = "rgba(59, 130, 246, 0.8)"
      ctx.font = "8px monospace"
      ctx.fillText(`${technicianLocation.lat.toFixed(4)}, ${technicianLocation.lng.toFixed(4)}`, techX + 12, techY + 8)

      // Tactical HUD details
      ctx.fillStyle = "rgba(59, 130, 246, 0.4)"
      ctx.font = "9px monospace"
      ctx.fillText("SYS: SECURE LINK // ENCRYPTED", 15, 25)
      ctx.fillText("GPS: active // 3D LOCK", 15, 38)
      
      const distance = 1.2 + Math.sin(Date.now() / 5000) * 0.1
      ctx.fillStyle = "#3b82f6"
      ctx.font = "bold 10px monospace"
      ctx.fillText(`RANGE: ${distance.toFixed(2)} mi`, 15, height - 20)

      // Sweep animation angle
      angle += 0.015
      if (angle > Math.PI * 2) {
        angle = 0
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [technicianLocation, destinationLocation])

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-xl overflow-hidden bg-slate-950/80 border border-blue-500/20 shadow-inner">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Premium HUD Overlay details */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono text-blue-400">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
        TACTICAL LIVE FEED
      </div>
    </div>
  )
}
