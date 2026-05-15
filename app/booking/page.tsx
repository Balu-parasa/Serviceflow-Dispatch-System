"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Thermometer,
  Droplets,
  Plug,
  Wrench,
  Cog,
  AlertTriangle,
  Star,
  Shield,
  User,
  Phone,
  Mail,
  Home,
  Building,
  Factory,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, title: "Service", icon: Wrench },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Schedule", icon: Calendar },
  { id: 4, title: "Details", icon: User },
  { id: 5, title: "Confirm", icon: Check },
]

const services = [
  {
    id: "hvac",
    icon: Thermometer,
    title: "HVAC Services",
    description: "Heating, ventilation, and air conditioning",
    price: "From $89",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    id: "plumbing",
    icon: Droplets,
    title: "Plumbing",
    description: "Pipes, drains, and water systems",
    price: "From $79",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "electrical",
    icon: Plug,
    title: "Electrical",
    description: "Wiring, outlets, and electrical repairs",
    price: "From $99",
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    id: "appliance",
    icon: Wrench,
    title: "Appliance Repair",
    description: "All major household appliances",
    price: "From $69",
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    id: "industrial",
    icon: Cog,
    title: "Industrial Maintenance",
    description: "Commercial and industrial equipment",
    price: "From $149",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    id: "emergency",
    icon: AlertTriangle,
    title: "Emergency Services",
    description: "24/7 urgent technical support",
    price: "From $129",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
]

const propertyTypes = [
  { id: "home", icon: Home, title: "Residential Home" },
  { id: "commercial", icon: Building, title: "Commercial Building" },
  { id: "industrial", icon: Factory, title: "Industrial Facility" },
]

const timeSlots = [
  { id: "morning", time: "8:00 AM - 12:00 PM", label: "Morning" },
  { id: "afternoon", time: "12:00 PM - 4:00 PM", label: "Afternoon" },
  { id: "evening", time: "4:00 PM - 8:00 PM", label: "Evening" },
]

const technicians = [
  {
    id: 1,
    name: "John Mitchell",
    specialty: "HVAC Specialist",
    rating: 4.9,
    jobs: 847,
    eta: "15 min",
    available: true,
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Master Electrician",
    rating: 4.8,
    jobs: 623,
    eta: "25 min",
    available: true,
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    specialty: "Plumbing Expert",
    rating: 5.0,
    jobs: 1204,
    eta: "20 min",
    available: true,
  },
]

interface BookingData {
  service: string
  subService: string
  propertyType: string
  address: string
  city: string
  zipCode: string
  date: string
  timeSlot: string
  isEmergency: boolean
  name: string
  email: string
  phone: string
  notes: string
  technicianId: number | null
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    service: "",
    subService: "",
    propertyType: "",
    address: "",
    city: "",
    zipCode: "",
    date: "",
    timeSlot: "",
    isEmergency: false,
    name: "",
    email: "",
    phone: "",
    notes: "",
    technicianId: null,
  })

  const updateBookingData = (field: keyof BookingData, value: string | boolean | number | null) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const selectedService = services.find((s) => s.id === bookingData.service)

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

          <div className="flex items-center gap-4">
            {bookingData.isEmergency && (
              <div className="flex items-center gap-2 rounded-full bg-destructive/20 px-3 py-1 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4" />
                Emergency Mode
              </div>
            )}
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: currentStep === step.id ? 1.1 : 1,
                      backgroundColor:
                        currentStep >= step.id
                          ? "hsl(var(--primary))"
                          : "hsl(var(--secondary))",
                    }}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full transition-all",
                      currentStep >= step.id ? "glow-blue" : ""
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <step.icon
                        className={cn(
                          "h-5 w-5",
                          currentStep >= step.id
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      />
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium",
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 w-16 sm:w-24",
                      currentStep > step.id ? "bg-primary" : "bg-secondary"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground">
                    Select a Service
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Choose the type of service you need
                  </p>
                </div>

                {/* Emergency Toggle */}
                <div className="mb-8 flex justify-center">
                  <button
                    onClick={() =>
                      updateBookingData("isEmergency", !bookingData.isEmergency)
                    }
                    className={cn(
                      "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all",
                      bookingData.isEmergency
                        ? "bg-destructive text-destructive-foreground glow-blue"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {bookingData.isEmergency
                      ? "Emergency Mode Active"
                      : "Need Emergency Service?"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <motion.button
                      key={service.id}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateBookingData("service", service.id)}
                      className={cn(
                        "glass-card rounded-xl p-6 text-left transition-all",
                        bookingData.service === service.id
                          ? "border-primary/50 glow-blue"
                          : "hover:border-primary/30"
                      )}
                    >
                      <div
                        className={cn(
                          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg",
                          service.bgColor,
                          service.color
                        )}
                      >
                        <service.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">
                        {service.title}
                      </h3>
                      <p className="mb-3 text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary">
                          {service.price}
                        </span>
                        {bookingData.service === service.id && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground">
                    Service Location
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Where do you need the service?
                  </p>
                </div>

                {/* Property Type */}
                <div className="mb-8">
                  <Label className="mb-4 block text-sm font-medium">
                    Property Type
                  </Label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {propertyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          updateBookingData("propertyType", type.id)
                        }
                        className={cn(
                          "glass-card flex items-center gap-3 rounded-xl p-4 transition-all",
                          bookingData.propertyType === type.id
                            ? "border-primary/50 glow-blue"
                            : "hover:border-primary/30"
                        )}
                      >
                        <type.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">
                          {type.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                <div className="glass-card rounded-xl p-6">
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        value={bookingData.address}
                        onChange={(e) =>
                          updateBookingData("address", e.target.value)
                        }
                        className="mt-2 bg-secondary/50"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="San Francisco"
                          value={bookingData.city}
                          onChange={(e) =>
                            updateBookingData("city", e.target.value)
                          }
                          className="mt-2 bg-secondary/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="94102"
                          value={bookingData.zipCode}
                          onChange={(e) =>
                            updateBookingData("zipCode", e.target.value)
                          }
                          className="mt-2 bg-secondary/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-6 overflow-hidden rounded-xl">
                  <div className="glass-card flex h-48 items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-8 w-8 text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Live map preview
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Schedule */}
            {currentStep === 3 && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground">
                    {bookingData.isEmergency
                      ? "Emergency Dispatch"
                      : "Choose Date & Time"}
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    {bookingData.isEmergency
                      ? "We will dispatch a technician immediately"
                      : "Select your preferred appointment time"}
                  </p>
                </div>

                {bookingData.isEmergency ? (
                  <div className="glass-card rounded-xl p-8 text-center">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/20">
                      <AlertTriangle className="h-10 w-10 text-destructive" />
                    </div>
                    <h2 className="mb-2 text-2xl font-bold text-foreground">
                      Priority Dispatch Activated
                    </h2>
                    <p className="mb-6 text-muted-foreground">
                      A technician will be dispatched to your location
                      immediately
                    </p>

                    {/* Available Technicians */}
                    <div className="mt-8">
                      <h3 className="mb-4 text-left text-lg font-semibold text-foreground">
                        Available Technicians Nearby
                      </h3>
                      <div className="space-y-3">
                        {technicians.map((tech) => (
                          <button
                            key={tech.id}
                            onClick={() =>
                              updateBookingData("technicianId", tech.id)
                            }
                            className={cn(
                              "glass flex w-full items-center justify-between rounded-lg p-4 text-left transition-all",
                              bookingData.technicianId === tech.id
                                ? "border-primary/50 glow-blue"
                                : "hover:border-primary/30"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                                <User className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="font-medium text-foreground">
                                  {tech.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {tech.specialty}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-warning">
                                <Star className="h-4 w-4 fill-warning" />
                                <span className="font-medium">
                                  {tech.rating}
                                </span>
                              </div>
                              <div className="text-sm text-success">
                                ETA: {tech.eta}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-6 lg:grid-cols-2">
                    {/* Date Picker */}
                    <div className="glass-card rounded-xl p-6">
                      <Label className="mb-4 block text-sm font-medium">
                        Select Date
                      </Label>
                      <Input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) =>
                          updateBookingData("date", e.target.value)
                        }
                        className="bg-secondary/50"
                        min={new Date().toISOString().split("T")[0]}
                      />

                      {/* Calendar Preview */}
                      <div className="mt-6 grid grid-cols-7 gap-2 text-center">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                          <div
                            key={i}
                            className="text-xs font-medium text-muted-foreground"
                          >
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 35 }).map((_, i) => {
                          const day = i - 3
                          const isToday = day === 15
                          const isPast = day < 15
                          return (
                            <div
                              key={i}
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                                day > 0 && day <= 31
                                  ? isToday
                                    ? "bg-primary text-primary-foreground"
                                    : isPast
                                      ? "text-muted-foreground/50"
                                      : "text-foreground hover:bg-secondary"
                                  : ""
                              )}
                            >
                              {day > 0 && day <= 31 ? day : ""}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="glass-card rounded-xl p-6">
                      <Label className="mb-4 block text-sm font-medium">
                        Preferred Time
                      </Label>
                      <div className="space-y-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.id}
                            onClick={() =>
                              updateBookingData("timeSlot", slot.id)
                            }
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg bg-secondary/50 p-4 transition-all",
                              bookingData.timeSlot === slot.id
                                ? "border border-primary/50 glow-blue"
                                : "hover:bg-secondary"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-primary" />
                              <div className="text-left">
                                <div className="font-medium text-foreground">
                                  {slot.label}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {slot.time}
                                </div>
                              </div>
                            </div>
                            {bookingData.timeSlot === slot.id && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Contact Details */}
            {currentStep === 4 && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground">
                    Your Details
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    How can we reach you?
                  </p>
                </div>

                <div className="glass-card mx-auto max-w-lg rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative mt-2">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="John Smith"
                          value={bookingData.name}
                          onChange={(e) =>
                            updateBookingData("name", e.target.value)
                          }
                          className="bg-secondary/50 pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={bookingData.email}
                          onChange={(e) =>
                            updateBookingData("email", e.target.value)
                          }
                          className="bg-secondary/50 pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={bookingData.phone}
                          onChange={(e) =>
                            updateBookingData("phone", e.target.value)
                          }
                          className="bg-secondary/50 pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <textarea
                        id="notes"
                        placeholder="Any additional details about your service request..."
                        value={bookingData.notes}
                        onChange={(e) =>
                          updateBookingData("notes", e.target.value)
                        }
                        className="mt-2 h-24 w-full resize-none rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Confirmation */}
            {currentStep === 5 && (
              <div>
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground">
                    Confirm Booking
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Review your booking details
                  </p>
                </div>

                <div className="mx-auto max-w-2xl space-y-6">
                  {/* Service Summary */}
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Service Details
                      </h3>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    {selectedService && (
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-lg",
                            selectedService.bgColor,
                            selectedService.color
                          )}
                        >
                          <selectedService.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {selectedService.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {selectedService.description}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Location Summary */}
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Location
                      </h3>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-foreground">
                          {bookingData.address || "123 Main Street"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {bookingData.city || "San Francisco"},{" "}
                          {bookingData.zipCode || "94102"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Summary */}
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">
                        Schedule
                      </h3>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="text-foreground">
                          {bookingData.isEmergency
                            ? "Immediate Dispatch"
                            : bookingData.date || "Today"}
                        </span>
                      </div>
                      {!bookingData.isEmergency && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-primary" />
                          <span className="text-foreground">
                            {timeSlots.find(
                              (t) => t.id === bookingData.timeSlot
                            )?.time || "Morning"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Price Estimate */}
                  <div className="glass-card rounded-xl p-6">
                    <h3 className="mb-4 font-semibold text-foreground">
                      Price Estimate
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Service Fee
                        </span>
                        <span className="text-foreground">$89.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Travel Fee
                        </span>
                        <span className="text-foreground">$15.00</span>
                      </div>
                      {bookingData.isEmergency && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Emergency Fee
                          </span>
                          <span className="text-foreground">$40.00</span>
                        </div>
                      )}
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-foreground">
                            Estimated Total
                          </span>
                          <span className="text-primary">
                            ${bookingData.isEmergency ? "144.00" : "104.00"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-success" />
                      <span>Verified Technicians</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-warning" />
                      <span>Satisfaction Guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={nextStep}
              disabled={currentStep === 1 && !bookingData.service}
              className="gap-2 glow-blue"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Link href="/tracking">
              <Button className="gap-2 glow-blue">
                Confirm Booking
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
