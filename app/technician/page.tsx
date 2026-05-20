"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  MapPin,
  Clock,
  DollarSign,
  Navigation,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  User,
  Star,
  TrendingUp,
  Bell,
  LogOut,
  Timer,
  Target,
  Award,
  Thermometer,
  Droplets,
  Plug,
  Wrench,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Camera,
  FileText,
  Send,
  Flame,
  Shield,
  Compass,
  Route,
  Gauge,
  CircleDot,
  Play,
  Pause,
  SkipForward,
  Radio,
  Crosshair,
  ArrowUpRight,
  Package,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import api from "@/lib/api"
import dynamic from "next/dynamic"
import echo from "@/lib/echo"
import { toast, Toaster } from "sonner"

const DynamicMap = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary/50">
      <span className="text-xs text-muted-foreground animate-pulse">Loading Tactical Map...</span>
    </div>
  ),
})

// Active Mission Data
const activeMission = {
  id: "MISSION-2847",
  type: "HVAC Repair",
  priority: "high",
  customer: {
    name: "Sarah Mitchell",
    phone: "(555) 234-5678",
    avatar: null,
    rating: 4.8,
    previousJobs: 3,
  },
  location: {
    address: "456 Oak Avenue",
    city: "San Francisco, CA 94102",
    building: "Apartment 12B",
    coordinates: { lat: 37.7749, lng: -122.4194 },
  },
  issue: {
    title: "AC unit not cooling",
    description: "Unit making strange noise, not reaching set temperature. Customer reports it started 2 days ago.",
    photos: 2,
  },
  timeline: {
    assigned: "10:15 AM",
    enRoute: "10:22 AM",
    arrived: "10:45 AM",
    started: "10:52 AM",
  },
  earnings: {
    base: 185,
    parts: 75,
    emergency: 0,
    total: 260,
  },
  eta: null,
  distance: "0.0 mi",
}

const missionQueue = [
  {
    id: "MISSION-2848",
    type: "Plumbing",
    priority: "normal",
    customer: "Mike Johnson",
    address: "789 Pine St, SF",
    scheduledTime: "2:00 PM",
    earnings: 145,
    icon: Droplets,
    eta: "25 min drive",
  },
  {
    id: "MISSION-2849",
    type: "Electrical",
    priority: "high",
    customer: "Emily Davis",
    address: "321 Cedar Ln, SF",
    scheduledTime: "4:30 PM",
    earnings: 195,
    icon: Plug,
    eta: "18 min drive",
  },
  {
    id: "MISSION-2850",
    type: "Appliance",
    priority: "normal",
    customer: "Robert Chen",
    address: "555 Market St, SF",
    scheduledTime: "Tomorrow 9:00 AM",
    earnings: 120,
    icon: Wrench,
    eta: "Scheduled",
  },
]

// Real-time alerts are loaded dynamically from backend notification service

const todayStats = {
  completedJobs: 4,
  totalEarnings: 742,
  avgRating: 4.9,
  hoursWorked: 6.5,
  bonusEarned: 85,
  partsUsed: 12,
}

const weeklyEarnings = [
  { day: "Mon", amount: 320, jobs: 4 },
  { day: "Tue", amount: 485, jobs: 5 },
  { day: "Wed", amount: 275, jobs: 3 },
  { day: "Thu", amount: 520, jobs: 6 },
  { day: "Fri", amount: 742, jobs: 4 },
  { day: "Sat", amount: 0, jobs: 0 },
  { day: "Sun", amount: 0, jobs: 0 },
]

const achievements = [
  { id: 1, name: "Speed Demon", description: "Complete 5 jobs under estimated time", progress: 4, total: 5, icon: Gauge },
  { id: 2, name: "Customer Favorite", description: "Maintain 4.9+ rating for a week", progress: 6, total: 7, icon: Star },
  { id: 3, name: "Early Bird", description: "Start 10 jobs before 8 AM", progress: 8, total: 10, icon: Clock },
]

const inventoryItems = [
  { name: "HVAC Filters", count: 8, low: false },
  { name: "Pipe Fittings", count: 15, low: false },
  { name: "Electrical Wire", count: 2, low: true },
  { name: "Capacitors", count: 4, low: false },
]

export default function TechnicianDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [missionStatus, setMissionStatus] = useState<string>("in_progress")
  const [showAlerts, setShowAlerts] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real backend states
  const [user, setUser] = useState<any>(null)
  const [activeMission, setActiveMission] = useState<any>(null)
  const [missionQueue, setMissionQueue] = useState<any[]>([])
  const [todayStats, setTodayStats] = useState<any>({
    completedJobs: 0, totalEarnings: 0, avgRating: 5.0, hoursWorked: 0, bonusEarned: 0
  })
  
  const [techLocation, setTechLocation] = useState({ lat: 37.7749, lng: -122.4194 })
  const [alerts, setAlerts] = useState<any[]>([])
  
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      const dbNotifications = res.data.data || res.data || []
      const mappedAlerts = dbNotifications.map((n: any) => {
        let actionLabel = null
        if (n.type === 'booking_assigned' || n.type === 'emergency_alert') {
          actionLabel = 'Accept'
        } else if (n.type === 'chat_message') {
          actionLabel = 'View'
        }
        return {
          id: n.id,
          type: n.type === 'emergency_alert' ? 'emergency' : n.type,
          title: n.title,
          message: n.message,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: actionLabel,
          data: n.data,
          is_read: n.is_read
        }
      })
      setAlerts(mappedAlerts)
    } catch (err) {
      console.error("Failed to load notifications", err)
    }
  }

  // Single modular data fetcher
  const fetchDashboardData = async () => {
    try {
      // Fetch dynamic user profile & enforce technician role authorization
      const meRes = await api.get('/auth/me').catch(() => null)
      if (meRes?.data?.user) {
        const currentUser = meRes.data.user
        if (currentUser.role !== 'technician') {
          // Role mismatch - redirect to correct dashboard
          if (currentUser.role === 'admin') {
            window.location.href = '/admin'
          } else {
            window.location.href = '/customer'
          }
          return
        }
        setUser(currentUser)
      } else {
        // Not authenticated
        localStorage.removeItem('token')
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        window.location.href = '/login?redirect=/technician&message=first%20u%20have%20to%20login'
        return
      }

      const assignmentsRes = await api.get('/technician/assignments')
      const bookings = assignmentsRes.data.assignments || []
      
      const active = bookings.find((b: any) => 
        ['accepted', 'en_route', 'in_progress'].includes(b.status)
      )
      const queue = bookings.filter((b: any) => b.id !== active?.id)
      
      if (active) {
        setActiveMission(active)
        setMissionStatus(active.status || "accepted")
      } else {
        setActiveMission(null)
        setMissionStatus("idle")
      }
      setMissionQueue(queue)

      fetchNotifications()

      const earningsRes = await api.get('/technician/earnings')
      if (earningsRes.data?.today) {
        setTodayStats({
          completedJobs: earningsRes.data.today.jobs,
          totalEarnings: earningsRes.data.today.earnings,
          avgRating: earningsRes.data.today.rating || 5.0,
          hoursWorked: 6.5,
          bonusEarned: earningsRes.data.today.jobs * 15,
        })
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err)
    }
  }

  // Fetch assignments & stats - Polling for real-time responsiveness
  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Real-time Echo Notification subscription
  useEffect(() => {
    if (!user?.id || !echo) return

    const channel = echo.private(`user.${user.id}`)
      .listen('.notification.created', (event: any) => {
        console.log("Realtime notification received:", event)
        const n = event.notification
        let actionLabel = null
        if (n.type === 'booking_assigned' || n.type === 'emergency_alert') {
          actionLabel = 'Accept'
        } else if (n.type === 'chat_message') {
          actionLabel = 'View'
        }
        const newAlert = {
          id: n.id,
          type: n.type === 'emergency_alert' ? 'emergency' : n.type,
          title: n.title,
          message: n.message,
          time: "Just now",
          action: actionLabel,
          data: n.data,
          is_read: n.is_read
        }
        setAlerts(prev => {
          if (prev.some(existing => existing.id === n.id)) {
            return prev
          }
          return [newAlert, ...prev]
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
          toast.info(n.title || "Notification Received", {
            description: n.message
          })
        }

        fetchDashboardData()
      })
      .listen('.booking.status.updated', (event: any) => {
        console.log("Realtime booking update received:", event)
        toast.success("Service Updated", {
          description: "An assignment update has occurred."
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
      await api.post('/auth/logout')
    } catch (err) {
      console.error("Logout request failed", err)
    } finally {
      localStorage.removeItem('token')
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      window.location.href = '/login'
    }
  }

  const handleAcceptMission = async (id: number) => {
    try {
      await api.post(`/bookings/${id}/accept`)
      await fetchDashboardData()
    } catch (err: any) {
      console.error("Failed to accept mission", err)
      alert(err.response?.data?.message || "Failed to accept mission")
    }
  }

  const handleRejectMission = async (id: number) => {
    try {
      await api.post(`/bookings/${id}/reject`)
      await fetchDashboardData()
    } catch (err: any) {
      console.error("Failed to reject mission", err)
      alert(err.response?.data?.message || "Failed to reject mission")
    }
  }

  // Ping location
  useEffect(() => {
    if (!isOnline) return
    const ping = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude }
            setTechLocation({ lat: loc.latitude, lng: loc.longitude })
            api.post('/technician/location', loc).catch(e => {})
          },
          () => {
            // Mock moving slightly if geolocation is denied/fails
            setTechLocation(prev => {
              const newLoc = { lat: prev.lat + 0.001, lng: prev.lng + 0.001 }
              api.post('/technician/location', { latitude: newLoc.lat, longitude: newLoc.lng }).catch(e => {})
              return newLoc
            })
          }
        )
      }
    }, 10000)
    return () => clearInterval(ping)
  }, [isOnline])
  
  const handleStatusUpdate = async (status: string) => {
    if (!activeMission?.id) return
    try {
      await api.post(`/bookings/${activeMission.id}/status`, { status })
      setMissionStatus(status)
      if (status === "completed") {
        setTimeout(async () => {
          await fetchDashboardData()
        }, 1500)
      }
    } catch (err) {
      console.error("Failed to update status", err)
    }
  }

  // Timer for active job
  useEffect(() => {
    if (missionStatus === "in-progress") {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [missionStatus])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const statusSteps = [
    { id: "en_route", label: "En Route", icon: Navigation, color: "primary" },
    { id: "in_progress", label: "Working", icon: Wrench, color: "warning" },
    { id: "completed", label: "Complete", icon: CheckCircle, color: "success" },
  ]

  const currentStepIndex = statusSteps.findIndex((s) => s.id === missionStatus)

  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-right" />
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
      </div>

      {/* Tactical Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50 border-b border-primary/10">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-blue">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
            </Link>

            <div className="hidden h-6 w-px bg-border sm:block" />

            {/* Status Indicators */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5 text-[10px]">
                <Signal className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">Strong</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Battery className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">92%</span>
              </div>
            </div>
          </div>

          {/* Center - Live Time */}
          <div className="hidden lg:block">
            <div className="text-center">
              <div className="text-sm font-bold tabular-nums text-foreground">
                {currentTime.toLocaleTimeString('en-US', { hour12: true })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Online Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                isOnline
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-secondary text-muted-foreground border border-border"
              )}
            >
              {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isOnline ? "Online" : "Offline"}
            </button>

            {/* Alerts */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative rounded-lg bg-secondary/50 p-2 hover:bg-secondary transition-colors"
              >
                <Bell className="h-4 w-4 text-foreground" />
                {alerts.filter(a => a.type === "emergency").length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold">
                    !
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showAlerts && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 rounded-xl glass-card border border-border/50 p-3 shadow-2xl z-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-foreground">Alerts</h3>
                      <span className="text-[10px] text-muted-foreground">{alerts.length} new</span>
                    </div>
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className={cn(
                            "rounded-lg p-2.5",
                            alert.type === "emergency" ? "bg-destructive/10 border border-destructive/30" :
                            alert.type === "bonus" ? "bg-success/10 border border-success/30" :
                            "bg-secondary/50"
                          )}
                        >
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                              alert.type === "emergency" ? "bg-destructive animate-pulse" :
                              alert.type === "bonus" ? "bg-success" :
                              alert.type === "payment" ? "bg-success" : "bg-primary"
                            )} />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-foreground">{alert.title}</div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{alert.message}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                                {alert.action && (
                                  <Button 
                                     onClick={(e) => {
                                       e.stopPropagation()
                                       if (alert.action === 'View' && alert.data?.booking_id) {
                                         window.location.href = `/chat?bookingId=${alert.data.booking_id}`
                                       } else if (alert.data?.booking_id) {
                                         handleAcceptMission(alert.data.booking_id)
                                       }
                                     }}
                                     size="sm" 
                                     variant={alert.type === "emergency" ? "destructive" : "outline"} 
                                     className="h-5 px-2 text-[10px]"
                                  >
                                    {alert.action}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary ring-2 ring-primary/30">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-medium text-foreground">{user?.name || "John Mitchell"}</div>
                <div className="flex items-center gap-1 text-[10px] text-warning">
                  <Star className="h-2.5 w-2.5 fill-warning" />
                  <span>{user?.technician_profile?.rating || "4.9"} Rating</span>
                </div>
              </div>
            </div>

            <div className="h-6 w-px bg-border/50 mx-1" />
            
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-all"
              title="Log Out"
              id="logout-button"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 pb-24 pt-20">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Content - Active Mission */}
          <div className="space-y-4 lg:col-span-2">
            {/* Active Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden rounded-xl"
            >
              {/* Mission Header */}
              {activeMission ? (
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                    <Thermometer className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-foreground">ACTIVE MISSION</h2>
                      {activeMission?.is_emergency && (
                        <span className="rounded bg-warning/20 px-1.5 py-0.5 text-[10px] font-bold text-warning">
                          EMERGENCY
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono">#{activeMission?.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-success">
                    <DollarSign className="h-4 w-4" />
                    {activeMission?.estimated_cost || 120}
                  </div>
                  <div className="text-[10px] text-muted-foreground">Est. Earnings</div>
                </div>
              </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">No active missions right now.</div>
              )}

              {/* Mission Status Progress */}
              <div className="border-b border-border/50 p-4">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleStatusUpdate(step.id)}
                          disabled={!activeMission}
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-all relative",
                            index <= currentStepIndex
                              ? step.color === "success" ? "bg-success glow-green" :
                                step.color === "warning" ? "bg-warning" :
                                step.color === "accent" ? "bg-accent glow-cyan" :
                                "bg-primary glow-blue"
                              : "bg-secondary"
                          )}
                        >
                          {index === currentStepIndex && missionStatus === "in-progress" && (
                            <span className="absolute inset-0 animate-ping rounded-full bg-warning/50" />
                          )}
                          <step.icon className={cn(
                            "h-5 w-5 relative z-10",
                            index <= currentStepIndex ? "text-background" : "text-muted-foreground"
                          )} />
                        </button>
                        <span className={cn(
                          "mt-2 text-[10px] font-medium",
                          index <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={cn(
                          "mx-2 h-0.5 w-12 sm:w-20 rounded-full transition-all",
                          index < currentStepIndex ? "bg-primary" : "bg-secondary"
                        )} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Timer */}
                {missionStatus === "in-progress" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 flex items-center justify-center gap-3"
                  >
                    <div className="flex items-center gap-2 rounded-full bg-warning/10 border border-warning/30 px-4 py-2">
                      <Timer className="h-4 w-4 text-warning animate-pulse" />
                      <span className="text-lg font-bold tabular-nums text-warning">
                        {formatElapsedTime(elapsedTime + 1847)}
                      </span>
                      <span className="text-xs text-muted-foreground">elapsed</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Mission Details */}
              {activeMission && (
              <div className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Customer Info */}
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="text-xs font-semibold text-foreground">Customer</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{activeMission?.customer?.name}</span>
                        <div className="flex items-center gap-1 text-warning">
                          <Star className="h-3 w-3 fill-warning" />
                          <span className="text-xs">5.0</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{activeMission?.customer?.phone || "(555) 234-5678"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-lg bg-secondary/30 p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-4 w-4 text-accent" />
                      <h3 className="text-xs font-semibold text-foreground">Location</h3>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-foreground">{activeMission?.address}</div>
                      <div className="text-xs text-muted-foreground">{activeMission?.city}</div>
                      <div className="text-xs text-primary font-medium">{activeMission?.property_type}</div>
                    </div>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mt-4 rounded-lg bg-secondary/30 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <h3 className="text-xs font-semibold text-foreground">Service Details</h3>
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">{activeMission?.service?.name}</div>
                  <p className="text-xs text-muted-foreground">{activeMission?.notes || "No additional notes."}</p>
                </div>

                {/* Earnings Breakdown */}
                <div className="mt-4 rounded-lg bg-success/5 border border-success/20 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">Earnings Breakdown</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm font-bold text-foreground">${activeMission?.estimated_cost || 120}</div>
                      <div className="text-[10px] text-muted-foreground">Base</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">${activeMission?.is_emergency ? 50 : 0}</div>
                      <div className="text-[10px] text-muted-foreground">Bonus</div>
                    </div>
                    <div className="border-l border-border">
                      <div className="text-sm font-bold text-success">${(activeMission?.estimated_cost || 120) + (activeMission?.is_emergency ? 50 : 0)}</div>
                      <div className="text-[10px] text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Navigation className="h-3.5 w-3.5" />
                    Navigate
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    Call
                  </Button>
                  <Link href={`/chat?bookingId=${activeMission.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="gap-1.5 w-full">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Message
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    Photo
                  </Button>
                </div>

                {missionStatus === "in-progress" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={() => handleStatusUpdate("completed")}
                      className="w-full gap-2 bg-success hover:bg-success/90 text-success-foreground glow-green"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5" />
                      Complete Mission
                    </Button>
                  </motion.div>
                )}

                {missionStatus === "completed" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 rounded-lg bg-success/10 border border-success/30 p-4 text-center"
                  >
                    <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                    <div className="text-sm font-bold text-success">Mission Complete!</div>
                    <div className="text-xs text-muted-foreground mt-1">Earned ${activeMission?.estimated_cost || 120}</div>
                  </motion.div>
                )}
              </div>
              )}
            </motion.div>

            {/* Live Map Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl overflow-hidden border border-primary/10"
            >
              <div className="relative h-64 w-full">
                <DynamicMap
                  customerLat={activeMission?.latitude ? parseFloat(activeMission.latitude) : 37.7749}
                  customerLng={activeMission?.longitude ? parseFloat(activeMission.longitude) : -122.4194}
                  techLat={techLocation.lat}
                  techLng={techLocation.lng}
                />
              </div>
            </motion.div>

            {/* Mission Queue */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl"
            >
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Mission Queue</h3>
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-medium text-primary">
                    {missionQueue.length} pending
                  </span>
                </div>
              </div>

              <div className="p-2 space-y-2">
                {missionQueue.map((mission, i) => {
                  const MissionIcon = mission.icon || Wrench
                  return (
                    <motion.div
                      key={mission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg bg-secondary/30 p-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          mission.priority === "high" || mission.is_emergency ? "bg-warning/20 text-warning" : "bg-primary/20 text-primary"
                        )}>
                          <MissionIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{mission?.customer?.name || "Customer"}</span>
                            {(mission?.is_emergency || mission.priority === "high") && (
                              <span className="rounded bg-warning/20 px-1 py-0.5 text-[8px] font-bold text-warning animate-pulse">
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">{mission?.service?.name || mission?.type || "Standard Repair"} - {mission?.address}</div>
                          <div className="text-[10px] text-primary/80 font-mono mt-0.5 uppercase tracking-wider">{mission.status || "PENDING DISPATCH"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-border/40 pt-2 sm:pt-0">
                        <div className="text-left sm:text-right">
                          <div className="text-sm font-bold text-foreground font-mono">{mission?.time_slot || "ASAP"}</div>
                          <div className="text-xs text-success font-semibold">${mission?.estimated_cost || 120}</div>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAcceptMission(mission.id)
                            }}
                            className="h-7 px-2.5 text-xs bg-success hover:bg-success/80 text-success-foreground font-semibold"
                            size="sm"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRejectMission(mission.id)
                            }}
                            variant="outline"
                            className="h-7 px-2.5 text-xs border-destructive/30 hover:bg-destructive/10 hover:text-destructive text-muted-foreground font-semibold"
                            size="sm"
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Today's Performance */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-xl"
            >
              <div className="border-b border-border/50 px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Today&apos;s Performance</h3>
              </div>

              <div className="p-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Jobs", value: todayStats.completedJobs, icon: Target, color: "text-primary" },
                  { label: "Earnings", value: `$${todayStats.totalEarnings}`, icon: DollarSign, color: "text-success" },
                  { label: "Rating", value: todayStats.avgRating, icon: Star, color: "text-warning" },
                  { label: "Hours", value: todayStats.hoursWorked, icon: Clock, color: "text-accent" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-lg bg-secondary/30 p-3"
                  >
                    <stat.icon className={cn("h-4 w-4 mb-1", stat.color)} />
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Bonus indicator */}
              <div className="mx-3 mb-3 rounded-lg bg-success/10 border border-success/30 p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-success" />
                    <span className="text-xs text-foreground">Bonus Earned</span>
                  </div>
                  <span className="text-sm font-bold text-success">+${todayStats.bonusEarned}</span>
                </div>
              </div>
            </motion.div>

            {/* Weekly Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl"
            >
              <div className="border-b border-border/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Weekly Earnings</h3>
                  <span className="text-xs text-success">$2,342 total</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-end justify-between h-24 gap-1">
                  {weeklyEarnings.map((day, i) => {
                    const maxAmount = Math.max(...weeklyEarnings.map(d => d.amount))
                    const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0
                    const isToday = i === 4

                    return (
                      <div key={day.day} className="flex flex-col items-center flex-1 gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.05, duration: 0.5 }}
                          className={cn(
                            "w-full max-w-[24px] rounded-t transition-colors",
                            isToday ? "bg-primary" : "bg-success/60"
                          )}
                          style={{ minHeight: day.amount > 0 ? '4px' : '0' }}
                        />
                        <span className={cn(
                          "text-[9px]",
                          isToday ? "text-primary font-bold" : "text-muted-foreground"
                        )}>
                          {day.day}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl"
            >
              <div className="border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-warning" />
                  <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
                </div>
              </div>

              <div className="p-2 space-y-2">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="rounded-lg bg-secondary/30 p-2.5"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-warning/20 text-warning">
                        <achievement.icon className="h-3 w-3" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{achievement.name}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mb-1.5">{achievement.description}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                          transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                          className="h-full bg-warning rounded-full"
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Inventory */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl"
            >
              <div className="border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-accent" />
                  <h3 className="text-sm font-semibold text-foreground">Inventory</h3>
                </div>
              </div>

              <div className="p-2 space-y-1.5">
                {inventoryItems.map((item, i) => (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center justify-between rounded-lg p-2",
                      item.low ? "bg-destructive/10 border border-destructive/30" : "bg-secondary/30"
                    )}
                  >
                    <span className="text-xs text-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs font-bold",
                        item.low ? "text-destructive" : "text-foreground"
                      )}>
                        {item.count}
                      </span>
                      {item.low && (
                        <span className="text-[8px] text-destructive font-bold">LOW</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Missing import fix
function Layers(props: React.ComponentProps<typeof Target>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
