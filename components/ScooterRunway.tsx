"use client"

import { useEffect, useRef } from "react"
import lottie from "lottie-web"

interface ScooterRunwayProps {
  direction?: "ltr" | "rtl"
}

export default function ScooterRunway({ direction = "ltr" }: ScooterRunwayProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scooterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !sectionRef.current) return

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/Man_riding_a_red_scooter.json",
    })

    const handleScroll = () => {
      if (!sectionRef.current || !scooterRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Calculate how far the section is through the viewport
      // Starts entering when rect.top = windowHeight
      // Leaves completely when rect.bottom = 0 (which means rect.top = -rect.height)
      const totalRange = windowHeight + rect.height
      const currentScroll = windowHeight - rect.top
      
      // Compute progress from 0 (just entering bottom) to 1 (just leaving top)
      const progress = Math.max(0, Math.min(1, currentScroll / totalRange))

      if (direction === "ltr") {
        const translatePercent = -40 + 180 * progress
        scooterRef.current.style.left = `${translatePercent}%`
      } else {
        const translatePercent = 140 - 180 * progress
        scooterRef.current.style.left = `${translatePercent}%`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll)
    // Trigger initial position calculation
    handleScroll()

    return () => {
      animation.destroy()
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [direction])

  return (
    <section ref={sectionRef} className="relative h-[40vh] w-full overflow-hidden pointer-events-none z-20 flex items-center justify-center bg-transparent">
      <div
        ref={scooterRef}
        style={{
          transform: direction === "rtl" ? "scaleX(-1)" : "none",
        }}
        className="absolute w-[280px] sm:w-[350px] aspect-square flex items-center justify-center"
      >
        <div ref={containerRef} className="w-full h-full" />
        {/* Ambient Shadow Glow */}
        <div className="absolute bottom-[10%] w-[70%] h-3.5 bg-primary/10 rounded-full blur-md -skew-x-12 animate-pulse" />
      </div>
    </section>
  )
}
