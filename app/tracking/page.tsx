"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  MapPin,
  Phone,
  MessageSquare,
  Star,
  Clock,
  Navigation,
  User,
  CheckCircle,
  Shield,
  Share2,
  AlertTriangle,
  Thermometer,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

const technicianData = {
  name: "John Mitchell",
  specialty: "HVAC Specialist",
  rating: 4.9,
  totalJobs: 847,
  phone: "(555) 123-4567",
  verified: true,
  vehicle: "White Ford Transit",
  licensePlate: "ABC 1234",
}

const jobDetails = {
  id: "JOB-2847",
  service: "HVAC Repair",
  address: "123 Main Street, San Francisco, CA 94102",
  scheduledTime: "Today, 10:00 AM - 12:00 PM",
  estimatedCost: "$89 - $150",
}

const trackingSteps = [
  { id: "confirmed", label: "Booking Confirmed", time: "9:45 AM" },
  { id: "assigned", label: "Technician Assigned", time: "9:48 AM" },
  { id: "en-route", label: "En Route", time: "10:02 AM" },
  { id: "arriving", label: "Arriving Soon", time: null },
  { id: "on-site", label: "On Site", time: null },
  { id: "completed", label: "Completed", time: null },
]

export default function TrackingPage() {
  const [currentStep, setCurrentStep] = useState(2)
  const [eta, setEta] = useState(8)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [booking, setBooking] = useState<any>(null)
  const [techLocation, setTechLocation] = useState<any>(null)
  const [destination, setDestination] = useState<any>(null)
  const [loadingBooking, setLoadingBooking] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          window.location.href = "/login?redirect=/tracking&message=first%20u%20have%20to%20login"
          return
        }
        const response = await api.get("/auth/me")
        if (response.data?.user) {
          setIsAuthLoading(false)
        } else {
          localStorage.removeItem("token")
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
          window.location.href = "/login?redirect=/tracking&message=first%20u%20have%20to%20login"
        }
      } catch (err) {
        console.error("Auth check failed on tracking page:", err)
        localStorage.removeItem("token")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        window.location.href = "/login?redirect=/tracking&message=first%20u%20have%20to%20login"
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchBookingTracking = async () => {
      const searchParams = new URLSearchParams(window.location.search)
      const bookingId = searchParams.get("booking_id")
      if (!bookingId) return

      setLoadingBooking(true)
      try {
        const response = await api.get(`/bookings/${bookingId}/tracking`)
        if (response.data?.booking) {
          setBooking(response.data.booking)
          if (response.data.technician_location) {
            setTechLocation(response.data.technician_location)
          }
          if (response.data.destination) {
            setDestination(response.data.destination)
          }
        }
      } catch (err) {
        console.error("Failed to fetch booking tracking info:", err)
      } finally {
        setLoadingBooking(false)
      }
    }

    if (!isAuthLoading) {
      fetchBookingTracking()
    }
  }, [isAuthLoading])

  const resolvedTech = useMemo(() => {
    if (booking?.technician) {
      const profile = booking.technician.technician_profile || {}
      return {
        name: booking.technician.name || "Assigned Expert",
        specialty: profile.specialty || booking.service?.name || "Technician",
        rating: profile.rating || 4.9,
        totalJobs: profile.total_jobs || 150,
        phone: booking.technician.phone || "(555) 123-4567",
        verified: profile.verified !== false,
        vehicle: profile.vehicle || "White Ford Transit",
        licensePlate: profile.license_plate || "ABC 1234",
      }
    }
    return technicianData
  }, [booking])

  const resolvedJob = useMemo(() => {
    if (booking) {
      return {
        id: booking.reference || `JOB-${booking.id}`,
        service: booking.service?.name || "General Service",
        address: `${booking.address || "123 Main St"}, ${booking.city || "San Francisco"}, CA ${booking.zip_code || "94102"}`,
        scheduledTime: booking.is_emergency
          ? "Immediate Dispatch"
          : `${booking.scheduled_date || "Today"}, ${booking.specific_time || "9:00 AM"}`,
        estimatedCost: booking.estimated_cost ? `$${booking.estimated_cost}` : "$89 - $150",
      }
    }
    return jobDetails
  }, [booking])

  const resolvedStep = useMemo(() => {
    if (!booking) return currentStep
    const status = booking.status
    switch (status) {
      case "pending":
        return 0
      case "accepted":
        return 1
      case "en_route":
        return 2
      case "arriving":
        return 3
      case "on_site":
        return 4
      case "completed":
        return 5
      default:
        return 2
    }
  }, [booking, currentStep])

  const resolvedTrackingSteps = useMemo(() => {
    const steps = [
      { id: "confirmed", label: "Booking Confirmed", time: "9:45 AM" },
      { id: "assigned", label: "Technician Assigned", time: "9:48 AM" },
      { id: "en-route", label: "En Route", time: "10:02 AM" },
      { id: "arriving", label: "Arriving Soon", time: null },
      { id: "on-site", label: "On Site", time: null },
      { id: "completed", label: "Completed", time: null },
    ]
    if (booking) {
      const formatTime = (isoString: string | undefined) => {
        if (!isoString) return null
        try {
          const date = new Date(isoString)
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } catch (e) {
          return null
        }
      }
      steps[0].time = formatTime(booking.timestamps?.created_at) || "9:45 AM"
      steps[1].time = formatTime(booking.timestamps?.accepted_at || booking.timestamps?.assigned_at)
      steps[2].time = formatTime(booking.timestamps?.en_route_at)
      steps[3].time = formatTime(booking.timestamps?.started_at)
      steps[5].time = formatTime(booking.timestamps?.completed_at)
    }
    return steps
  }, [booking])

  const resolvedEta = useMemo(() => {
    if (techLocation && typeof techLocation.eta_minutes === "number") {
      return techLocation.eta_minutes
    }
    if (booking && typeof booking.eta_minutes === "number") {
      return booking.eta_minutes
    }
    return eta
  }, [techLocation, booking, eta])

  // Simulate ETA countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setCurrentStep(3)
          return 0
        }
        return prev - 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Verifying tracking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/customer" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              ServiceFlow
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/customer">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Help
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        {/* Live Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium text-success">
              Live Tracking Active
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold text-foreground">
            {resolvedEta > 0
              ? `Technician arriving in ${resolvedEta} minutes`
              : "Technician is arriving!"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {resolvedTech.name} is on the way to your location
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card overflow-hidden rounded-xl"
            >
              <div className="relative h-64 bg-secondary/30">
                <div className="absolute inset-0 grid-pattern opacity-50" />

                {/* Simulated Route */}
                <svg className="absolute inset-0 h-full w-full">
                  <motion.path
                    d="M 50 180 Q 120 120 180 100 Q 240 80 280 120"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </svg>

                {/* Technician Marker */}
                <motion.div
                  className="absolute"
                  initial={{ left: "15%", top: "70%" }}
                  animate={{ left: "45%", top: "40%" }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                  }}
                >
                  <div className="relative">
                    <div className="h-6 w-6 rounded-full bg-primary glow-blue">
                      <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                    </div>
                    <div className="absolute left-8 top-0 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium text-foreground shadow-lg">
                      {resolvedTech.name}
                    </div>
                  </div>
                </motion.div>

                {/* Destination Marker */}
                <div className="absolute right-[25%] top-[45%]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
                    <MapPin className="h-4 w-4 text-success-foreground" />
                  </div>
                  <div className="absolute left-10 top-0 whitespace-nowrap rounded bg-card px-2 py-1 text-xs text-foreground shadow-lg">
                    Your Location
                  </div>
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Navigation className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {resolvedTech.vehicle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        License: {resolvedTech.licensePlate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {resolvedEta} min
                    </div>
                    <div className="text-xs text-muted-foreground">ETA</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tracking Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="mb-6 font-semibold text-foreground">
                Tracking Status
              </h3>

              <div className="space-y-6">
                {resolvedTrackingSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          index <= resolvedStep
                            ? "bg-primary text-primary-foreground glow-blue"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {index < resolvedStep ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      {index < resolvedTrackingSteps.length - 1 && (
                        <div
                          className={cn(
                            "my-1 h-8 w-0.5",
                            index < resolvedStep ? "bg-primary" : "bg-secondary"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div
                        className={cn(
                          "font-medium",
                          index <= resolvedStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </div>
                      {step.time && (
                        <div className="text-sm text-muted-foreground">
                          {step.time}
                        </div>
                      )}
                      {index === resolvedStep && !step.time && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                          </span>
                          In Progress
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Technician Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <h3 className="font-semibold text-foreground">
                  Your Technician
                </h3>
                {resolvedTech.verified && (
                  <div className="flex items-center gap-1 rounded-full bg-success/20 px-2 py-1 text-xs text-success">
                    <Shield className="h-3 w-3" />
                    Verified
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <User className="h-8 w-8" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-success text-xs text-success-foreground">
                    <CheckCircle className="h-3 w-3" />
                  </span>
                </div>

                <div className="flex-1">
                  <div className="text-lg font-semibold text-foreground">
                    {resolvedTech.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {resolvedTech.specialty}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="h-4 w-4 fill-warning" />
                      <span className="font-medium">
                        {resolvedTech.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({resolvedTech.totalJobs} jobs)
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button className="gap-2 glow-blue">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </motion.div>

            {/* Job Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-6"
            >
              <h3 className="mb-4 font-semibold text-foreground">
                Service Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Thermometer className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <div className="font-medium text-foreground">
                      {resolvedJob.service}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Job ID: {resolvedJob.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {resolvedJob.address}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-success" />
                  <div>
                    <div className="font-medium text-foreground">
                      Scheduled Time
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {resolvedJob.scheduledTime}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Estimated Cost
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {resolvedJob.estimatedCost}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Final price determined after on-site assessment
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Safety Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">Safety Tip:</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                All ServiceFlow technicians carry ID badges. Feel free to ask for
                identification before allowing entry.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

