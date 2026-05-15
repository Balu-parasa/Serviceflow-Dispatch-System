"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Schneider
            </span>
          </Link>

          <div className="flex items-center gap-3">
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
            {eta > 0
              ? `Technician arriving in ${eta} minutes`
              : "Technician is arriving!"}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {technicianData.name} is on the way to your location
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
                      {technicianData.name}
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
                        {technicianData.vehicle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        License: {technicianData.licensePlate}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {eta} min
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
                {trackingSteps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          index <= currentStep
                            ? "bg-primary text-primary-foreground glow-blue"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm">{index + 1}</span>
                        )}
                      </div>
                      {index < trackingSteps.length - 1 && (
                        <div
                          className={cn(
                            "my-1 h-8 w-0.5",
                            index < currentStep ? "bg-primary" : "bg-secondary"
                          )}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div
                        className={cn(
                          "font-medium",
                          index <= currentStep
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
                      {index === currentStep && !step.time && (
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
                {technicianData.verified && (
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
                    {technicianData.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {technicianData.specialty}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1 text-warning">
                      <Star className="h-4 w-4 fill-warning" />
                      <span className="font-medium">
                        {technicianData.rating}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({technicianData.totalJobs} jobs)
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
                      {jobDetails.service}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Job ID: {jobDetails.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Location</div>
                    <div className="text-sm text-muted-foreground">
                      {jobDetails.address}
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
                      {jobDetails.scheduledTime}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Estimated Cost
                    </span>
                    <span className="text-lg font-semibold text-foreground">
                      {jobDetails.estimatedCost}
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
                All Schneider technicians carry ID badges. Feel free to ask for
                identification before allowing entry.
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
