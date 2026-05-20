"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  MapPin,
  Clock,
  DollarSign,
  User,
  Star,
  Bell,
  LogOut,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Phone,
  MessageSquare,
  Compass,
  Navigation,
  ArrowRight,
  Shield,
  Layers,
  Wrench,
  ThumbsUp,
  X,
  FileText,
  Calendar,
  Eye,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import { ThemeToggleCompact } from "@/components/theme-toggle"
import echoInstance from "@/lib/echo"
import { toast, Toaster } from "sonner"

interface Booking {
  id: string
  service_id: string
  customer_id: string
  technician_id: string | null
  status: string
  property_type: string
  address: string
  city: string
  zip_code: string
  scheduled_date: string | null
  time_slot: string | null
  specific_time: string | null
  is_emergency: boolean
  estimated_cost: number | string
  notes: string | null
  created_at: string
  service?: {
    id: string | number
    name: string
    description: string
    base_price: number | string
  }
  technician?: {
    id: string | number
    name: string
    email: string
    technician_profile?: {
      specialty: string
      rating: number | string
      jobs_completed: number
    }
  }
  payment?: {
    id: string | number
    amount: number | string
    status: string
  }
  review?: {
    id: string | number
    rating: number
    comment: string | null
  }
}

interface DashboardData {
  active_booking: Booking | null
  upcoming: Booking[]
  recent: Booking[]
  stats: {
    total_bookings: number
    completed: number
    active: number
    unread_notifications: number
  }
  notifications: any[]
}

const mockDashboardData: DashboardData = {
  active_booking: {
    id: "JOB-2847",
    service_id: "1",
    customer_id: "1",
    technician_id: "2",
    status: "en-route",
    property_type: "home",
    address: "456 Oak Avenue",
    city: "San Francisco",
    zip_code: "94102",
    scheduled_date: "2026-05-18",
    time_slot: "morning",
    specific_time: "10:15 AM",
    is_emergency: true,
    estimated_cost: 185,
    notes: "AC unit making a rattling noise and not cooling down the upper floor.",
    created_at: "2026-05-18T08:00:00Z",
    service: {
      id: "1",
      name: "HVAC Repair & Service",
      description: "AC, Heating, and Ventilation diagnosis and fix",
      base_price: 89,
    },
    technician: {
      id: "2",
      name: "John Mitchell",
      email: "john.mitchell@ServiceFlow.com",
      technician_profile: {
        specialty: "HVAC Specialist",
        rating: 4.9,
        jobs_completed: 847,
      },
    },
  },
  upcoming: [
    {
      id: "JOB-2849",
      service_id: "3",
      customer_id: "1",
      technician_id: null,
      status: "pending",
      property_type: "home",
      address: "456 Oak Avenue",
      city: "San Francisco",
      zip_code: "94102",
      scheduled_date: "2026-05-20",
      time_slot: "afternoon",
      specific_time: "2:00 PM",
      is_emergency: false,
      estimated_cost: 85,
      notes: "Install smart switches in kitchen and hallway.",
      created_at: "2026-05-17T12:00:00Z",
      service: {
        id: "3",
        name: "Electrical Inspection",
        description: "Wiring, Panels, and smart lighting installation",
        base_price: 85,
      },
    },
  ],
  recent: [
    {
      id: "JOB-2840",
      service_id: "2",
      customer_id: "1",
      technician_id: "3",
      status: "completed",
      property_type: "home",
      address: "456 Oak Avenue",
      city: "San Francisco",
      zip_code: "94102",
      scheduled_date: "2026-05-12",
      time_slot: "morning",
      specific_time: "9:00 AM",
      is_emergency: false,
      estimated_cost: 115,
      notes: "Kitchen sink drain pipe clogged.",
      created_at: "2026-05-12T08:00:00Z",
      service: {
        id: "2",
        name: "Plumbing Service",
        description: "Leaks, pipe replacement and clog repairs",
        base_price: 75,
      },
      technician: {
        id: "3",
        name: "Sarah Chen",
        email: "sarah.chen@ServiceFlow.com",
      },
      review: {
        id: "101",
        rating: 5,
        comment: "Excellent service! Very prompt and resolved the clog in minutes.",
      },
    },
    {
      id: "JOB-2835",
      service_id: "4",
      customer_id: "1",
      technician_id: "4",
      status: "completed",
      property_type: "home",
      address: "456 Oak Avenue",
      city: "San Francisco",
      zip_code: "94102",
      scheduled_date: "2026-05-05",
      time_slot: "evening",
      specific_time: "5:30 PM",
      is_emergency: false,
      estimated_cost: 95,
      notes: "Dishwasher not draining water at the end of the cycle.",
      created_at: "2026-05-05T12:00:00Z",
      service: {
        id: "4",
        name: "Appliance Repair",
        description: "Ovens, fridges, washers, and dryers services",
        base_price: 69,
      },
      technician: {
        id: "4",
        name: "Mike Rodriguez",
        email: "mike.rodriguez@ServiceFlow.com",
      },
    },
  ],
  stats: {
    total_bookings: 3,
    completed: 2,
    active: 1,
    unread_notifications: 2,
  },
  notifications: [
    { id: "1", message: "Your HVAC repair technician John Mitchell is en-route.", time: "10 min ago", is_read: false },
    { id: "2", message: "Invoice for Job #2840 has been paid successfully.", time: "6 days ago", is_read: true },
  ],
}

export default function CustomerDashboard() {
  const [data, setData] = useState<DashboardData>(mockDashboardData)
  const [isLoading, setIsLoading] = useState(true)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [user, setUser] = useState<any>(null)

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/customer/dashboard")
      setData(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load customer dashboard from API, using simulated data", error)
      setData(mockDashboardData)
      setIsLoading(false)
    }
  }

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me")
      if (response.data?.user) {
        const currentUser = response.data.user
        if (currentUser.role !== 'customer') {
          // Role mismatch - redirect
          if (currentUser.role === 'technician') {
            window.location.href = '/technician'
          } else if (currentUser.role === 'admin') {
            window.location.href = '/admin'
          }
          return
        }
        setUser(currentUser)
      } else {
        localStorage.removeItem('token')
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        window.location.href = "/login?redirect=/customer&message=first%20u%20have%20to%20login"
      }
    } catch (error) {
      console.error("Failed to fetch logged-in user profile", error)
      localStorage.removeItem('token')
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      window.location.href = "/login?redirect=/customer&message=first%20u%20have%20to%20login"
    }
  }

  useEffect(() => {
    fetchDashboardData()
    fetchUser()
  }, [])

  useEffect(() => {
    if (!user?.id || !echoInstance) return

    const channel = echoInstance.private(`user.${user.id}`)
      .listen('.notification.created', (event: any) => {
        console.log("Realtime customer notification received:", event)
        const n = event.notification
        
        setData(prev => {
          const newNotif = {
            id: n.id,
            message: n.message,
            time: "Just now",
            is_read: n.is_read || false,
            type: n.type,
            data: n.data
          }
          
          if (prev.notifications.some(existing => existing.id === n.id)) {
            return prev;
          }

          return {
            ...prev,
            stats: {
              ...prev.stats,
              unread_notifications: (prev.stats.unread_notifications || 0) + 1
            },
            notifications: [newNotif, ...prev.notifications]
          }
        })

        if (n.type === 'chat_message') {
          toast.info(n.title || "New Message", {
            description: n.message,
            action: {
              label: "View",
              onClick: () => {
                window.location.href = `/chat?bookingId=${n.data?.booking_id}`
              }
            }
          })
        } else {
          toast.info(n.title || "Alert", {
            description: n.message
          })
        }

        fetchDashboardData()
      })
      .listen('.booking.status.updated', (event: any) => {
        console.log("Realtime booking update received:", event)
        toast.success("Service Status Updated", {
          description: `Your service status has been updated to: ${getStatusLabel(event.booking.status)}`
        })
        fetchDashboardData()
      })

    return () => {
      channel.stopListening('.notification.created')
      channel.stopListening('.booking.status.updated')
    }
  }, [user?.id])

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout")
      localStorage.removeItem("token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed", error)
      localStorage.removeItem("token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
      window.location.href = "/login"
    }
  }

  const openReviewModal = (booking: Booking) => {
    setSelectedBooking(booking)
    setRating(5)
    setComment("")
    setReviewModalOpen(true)
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedBooking) return

    setIsSubmittingReview(true)
    try {
      await api.post(`/bookings/${selectedBooking.id}/reviews`, {
        rating,
        comment,
      })
      setReviewModalOpen(false)
      fetchDashboardData()
      alert("Thank you for your rating! Your review helps us maintain premium quality services.")
    } catch (error: any) {
      console.error("Failed to submit review", error)
      alert(error.response?.data?.message || "Failed to submit review. Please try again.")
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      case "cancelled":
        return "text-destructive bg-destructive/10 border-destructive/20"
      case "en-route":
      case "arriving":
      case "on-site":
      case "in_progress":
      case "in-progress":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20 animate-pulse"
      case "pending":
      case "assigned":
      default:
        return "text-amber-400 bg-amber-500/10 border-amber-500/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      case "en-route":
        return "Technician En-Route"
      case "arriving":
        return "Arriving Soon"
      case "on-site":
        return "Technician On-Site"
      case "in-progress":
      case "in_progress":
        return "Service In-Progress"
      case "pending":
        return "Awaiting Confirmation"
      case "assigned":
        return "Technician Assigned"
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">Syncing customer command center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative pb-16">
      <Toaster richColors position="top-right" />
      {/* Ambient Radial Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      </div>

      {/* Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">ServiceFlow</span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Customer Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggleCompact />

            <div className="relative">
              <button className="relative w-9 h-9 rounded-lg hover:bg-secondary/50 flex items-center justify-center transition-colors">
                <Bell className="w-4.5 h-4.5 text-muted-foreground" />
                {data.stats.unread_notifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                )}
              </button>
            </div>

            <div className="h-6 w-px bg-border/50" />

            {/* Profile & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="text-xs font-semibold text-foreground">{user?.name || "Premium Client"}</div>
                <div className="text-[10px] text-muted-foreground">{user?.email || "customer@ServiceFlow.com"}</div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold border border-primary/30">
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-all"
                title="Log Out"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Space */}
      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Hello, {user?.name ? user.name.split(" ")[0] : "Client"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Monitor your active services, manage scheduling, and book verified technicians in realtime.
            </p>
          </div>
          <Link href="/booking">
            <Button className="h-11 px-6 rounded-xl gap-2 text-sm font-semibold glow-blue shadow-lg">
              Book New Service
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Analytics Stats Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Total Bookings", value: data.stats.total_bookings, icon: Layers, color: "text-blue-400 bg-blue-500/10" },
            { label: "Active Requests", value: data.stats.active, icon: Activity, color: "text-amber-400 bg-amber-500/10" },
            { label: "Completed Services", value: data.stats.completed, icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10" },
            { label: "Unread Messages", value: data.stats.unread_notifications, icon: Bell, color: "text-violet-400 bg-violet-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 border border-border/40"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", stat.color)}>
                  <stat.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-foreground tabular-nums">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Sections Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          
          {/* Ongoing Service Command Card (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Booking Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card overflow-hidden rounded-2xl border border-border/50 shadow-xl"
            >
              <div className="border-b border-border/50 px-6 py-4 bg-gradient-to-r from-primary/5 to-transparent flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wrench className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">ACTIVE SERVICE REQUEST</h2>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {data.active_booking ? `#${data.active_booking.id}` : "No active requests"}
                    </p>
                  </div>
                </div>
                {data.active_booking && (
                  <span className={cn("text-[11px] font-bold px-3 py-1 rounded-full border", getStatusColor(data.active_booking.status))}>
                    {getStatusLabel(data.active_booking.status)}
                  </span>
                )}
              </div>

              {data.active_booking ? (
                <div className="p-6 space-y-6">
                  
                  {/* Service Description Info */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Requested Service</h3>
                      <p className="mt-1.5 text-lg font-bold text-primary">
                        {data.active_booking.service?.name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {data.active_booking.notes || "No description provided."}
                      </p>

                      <div className="mt-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {data.active_booking.address}, {data.active_booking.city}
                        </span>
                      </div>
                    </div>

                    {/* Cost & Emergency Banner */}
                    <div className="rounded-xl bg-secondary/30 p-4 border border-border/30 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Est. Cost</span>
                        {data.active_booking.is_emergency && (
                          <span className="flex items-center gap-1 rounded bg-destructive/15 px-2 py-0.5 text-[9px] font-bold text-destructive border border-destructive/20 animate-pulse">
                            <AlertTriangle className="h-3 w-3" />
                            EMERGENCY DISPATCH
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-extrabold text-foreground">
                          ${data.active_booking.estimated_cost}
                        </span>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Base pricing, verified on-site by technician
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Technician Info */}
                  {data.active_booking.technician ? (
                    <div className="rounded-xl border border-border/40 p-4 bg-background/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-6 w-6" />
                          </div>
                          <span className="absolute -bottom-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-success text-success-foreground border border-background">
                            <CheckCircle className="h-3 w-3" />
                          </span>
                        </div>

                        <div>
                          <div className="text-sm font-bold text-foreground">
                            {data.active_booking.technician.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {data.active_booking.technician.technician_profile?.specialty || "Licensed Specialist"}
                          </div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <span className="flex items-center gap-0.5 text-[11px] font-medium text-warning">
                              <Star className="w-3.5 h-3.5 fill-warning" />
                              {data.active_booking.technician.technician_profile?.rating || "5.0"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              ({data.active_booking.technician.technician_profile?.jobs_completed || "25+"} jobs completed)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Communications */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/tracking?bookingId=${data.active_booking.id}`}>
                          <Button size="sm" className="h-9 px-4 text-xs font-semibold glow-blue">
                            <Compass className="w-3.5 h-3.5 mr-1.5" />
                            Live Tracking
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline" className="h-9 w-9 p-0 hover:bg-secondary">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Link href={`/chat?bookingId=${data.active_booking.id}`}>
                          <Button size="sm" variant="outline" className="h-9 w-9 p-0 hover:bg-secondary" title="Open Chat Portal">
                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-border/40 p-4 bg-background/50 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-2">
                        <Clock className="w-5 h-5 animate-spin" />
                      </div>
                      <p className="text-xs font-semibold text-foreground">Finding nearby technician...</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Our smart AI dispatch system is matching your emergency request with licensed professionals.</p>
                    </div>
                  )}

                </div>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/50 text-muted-foreground border border-dashed border-border">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">No Active Services</h3>
                    <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                      All your service requests have been completed. Need help with plumbing, heating, electrical, or industrial repairs?
                    </p>
                  </div>
                  <Link href="/booking">
                    <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg font-semibold hover:bg-secondary">
                      Book Service Now
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Past Services / Booking History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl border border-border/50 shadow-lg overflow-hidden"
            >
              <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Recent Service History</h3>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {data.recent.length > 0 ? (
                  data.recent.map((booking, i) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-foreground">
                              {booking.service?.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              #{booking.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {booking.scheduled_date}
                            </span>
                            {booking.technician && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5" />
                                Tech: {booking.technician.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-border/30 pt-3 md:pt-0">
                        <div className="text-left md:text-right shrink-0">
                          <div className="text-sm font-bold text-foreground">
                            ${booking.estimated_cost}
                          </div>
                          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                            Paid successfully
                          </span>
                        </div>

                        <div className="shrink-0">
                          {booking.review ? (
                            <div className="flex items-center gap-1 bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-lg text-xs font-semibold text-warning" title={booking.review.comment || ""}>
                              <Star className="w-3.5 h-3.5 fill-warning shrink-0" />
                              <span>{booking.review.rating} / 5</span>
                            </div>
                          ) : booking.status === 'completed' ? (
                            <Button
                              onClick={() => openReviewModal(booking)}
                              size="sm"
                              className="h-8 text-xs font-bold glow-blue"
                            >
                              Write Review
                            </Button>
                          ) : (
                            <span className="text-[11px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg border border-border/30">
                              Service Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-8">No historical bookings found.</p>
                )}
              </div>
            </motion.div>

          </div>

          {/* Right Column - Upcoming, Notifications */}
          <div className="space-y-6">
            
            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl border border-border/50 shadow-md"
            >
              <div className="border-b border-border/50 px-5 py-3.5 flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Upcoming Service Schedule</h3>
              </div>

              <div className="p-3 space-y-3">
                {data.upcoming.length > 0 ? (
                  data.upcoming.map((booking) => (
                    <div key={booking.id} className="p-3 rounded-xl bg-secondary/30 border border-border/30 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">{booking.service?.name}</h4>
                          <p className="text-[10px] font-mono text-muted-foreground mt-0.5">#{booking.id}</p>
                        </div>
                        <span className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded border shrink-0", getStatusColor(booking.status))}>
                          {getStatusLabel(booking.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/20 pt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-1 font-medium text-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{booking.scheduled_date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{booking.specific_time || "Pending"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-6">No scheduled services on the horizon.</p>
                )}
              </div>
            </motion.div>

            {/* Unread Alerts & Push Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl border border-border/50 shadow-md"
            >
              <div className="border-b border-border/50 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4.5 h-4.5 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Realtime Alerts</h3>
                </div>
                {data.stats.unread_notifications > 0 && (
                  <span className="h-4.5 px-1.5 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-bold text-primary flex items-center justify-center">
                    {data.stats.unread_notifications} unread
                  </span>
                )}
              </div>

              <div className="p-3 space-y-2">
                {data.notifications.length > 0 ? (
                  data.notifications.map((notif, idx) => (
                    <div
                      key={notif.id || idx}
                      className={cn(
                        "p-3 rounded-lg flex items-start gap-2.5 transition-colors border border-transparent",
                        notif.is_read ? "bg-secondary/20" : "bg-primary/5 border-primary/10"
                      )}
                    >
                      <div className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", notif.is_read ? "bg-muted-foreground/35" : "bg-primary")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/90 leading-relaxed font-medium">{notif.message}</p>
                        <span className="text-[9px] text-muted-foreground mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-6">No alerts received.</p>
                )}
              </div>
            </motion.div>

            {/* Quick Safety Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card/40 p-4 border-dashed"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>SAFETY PROTOCOLS & ID VERIFICATION</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                Every technician is fully background-checked, licensed, and insured. For maximum security, always check the technician's digital identity card upon arrival and match their vehicle details.
              </p>
            </motion.div>

          </div>

        </div>

      </main>

      {/* Write Review Dialog Modal */}
      <AnimatePresence>
        {reviewModalOpen && selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewModalOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl p-6 overflow-hidden z-10 space-y-6"
            >
              <button
                onClick={() => setReviewModalOpen(false)}
                className="absolute right-4 top-4 w-7 h-7 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning mb-3">
                  <Star className="h-6 w-6 fill-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Rate your Service</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  How was your experience with tech for job <span className="font-mono">#{selectedBooking.id}</span>?
                </p>
              </div>

              <form onSubmit={submitReview} className="space-y-4">
                {/* Star Picker */}
                <div className="flex items-center justify-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-9 h-9 transition-colors",
                          star <= rating ? "fill-warning text-warning" : "text-muted-foreground/35"
                        )}
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment" className="text-xs font-semibold">Your Review Details</Label>
                  <Textarea
                    id="comment"
                    placeholder="Tell us what you liked about the technician or how we can improve our services..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="h-28 bg-secondary/40 border-border/60 text-sm resize-none rounded-xl"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full h-11 text-sm font-semibold glow-blue rounded-xl"
                >
                  {isSubmittingReview ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mx-auto" />
                  ) : (
                    "Submit Premium Review"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

