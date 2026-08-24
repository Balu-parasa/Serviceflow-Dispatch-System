"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  Bell,
  ChevronRight,
  ChevronDown,
  User,
  Star,
  Navigation,
  Thermometer,
  Droplets,
  Plug,
  Wrench,
  Radio,
  Target,
  Shield,
  Layers,
  ArrowUpRight,
  Sparkles,
  X,
  MapPin,
  Search,
  Settings,
  BarChart3,
  Bot,
  HeartPulse,
  Command,
  Phone,
  MessageSquare,
  Home,
  Map,
  LogOut,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ThemeToggleCompact } from "@/components/theme-toggle"
import api from "@/lib/api"

// Realtime Data Simulation
const generateRealtimeData = () => ({
  activeTechnicians: 128 + Math.floor(Math.random() * 10),
  activeJobs: 247 + Math.floor(Math.random() * 20),
  completedToday: 892 + Math.floor(Math.random() * 15),
  revenue: 48750 + Math.floor(Math.random() * 1000),
  avgResponseTime: 12 + Math.floor(Math.random() * 3),
  satisfaction: (4.85 + Math.random() * 0.1).toFixed(2),
  queueSize: 34 + Math.floor(Math.random() * 8),
  emergencies: 3 + Math.floor(Math.random() * 2),
  systemHealth: 98 + Math.floor(Math.random() * 2),
  wsConnections: 2847 + Math.floor(Math.random() * 100),
  completionRate: 94 + Math.floor(Math.random() * 4),
  utilization: 78 + Math.floor(Math.random() * 10),
  totalTechs: 150,
})

const dispatchFeed = [
  { id: "DSP-001", technician: "John M.", customer: "Sarah Mitchell", service: "HVAC", status: "en-route", eta: "8 min", time: "Just now", icon: Thermometer, priority: "high" },
  { id: "DSP-002", technician: "Mike R.", customer: "David Chen", service: "Plumbing", status: "on-site", eta: "-", time: "2m ago", icon: Droplets, priority: "normal" },
  { id: "DSP-003", technician: "Sarah C.", customer: "Emily Davis", service: "Electrical", status: "completed", eta: "-", time: "5m ago", icon: Plug, priority: "normal" },
  { id: "DSP-004", technician: "Alex T.", customer: "James Wilson", service: "Appliance", status: "en-route", eta: "15 min", time: "8m ago", icon: Wrench, priority: "emergency" },
  { id: "DSP-005", technician: "Emily D.", customer: "Robert Brown", service: "HVAC", status: "on-site", eta: "-", time: "12m ago", icon: Thermometer, priority: "normal" },
]

const emergencyQueue = [
  { id: "EMG-001", issue: "Gas leak - Commercial", location: "789 Pine St", time: "2m", severity: "critical" },
  { id: "EMG-002", issue: "Power outage - Medical", location: "456 Oak Ave", time: "5m", severity: "critical" },
  { id: "EMG-003", issue: "Flooding - Basement", location: "123 Main St", time: "12m", severity: "high" },
]

const techniciansOnline = [
  { id: 1, name: "John Mitchell", specialty: "HVAC", status: "busy", rating: 4.9, location: { x: 22, y: 32 }, currentJob: "AC Repair", eta: "15m" },
  { id: 2, name: "Sarah Chen", specialty: "Electrical", status: "available", rating: 4.8, location: { x: 58, y: 42 } },
  { id: 3, name: "Mike Rodriguez", specialty: "Plumbing", status: "busy", rating: 5.0, location: { x: 72, y: 28 }, currentJob: "Pipe Repair", eta: "8m" },
  { id: 4, name: "Emily Davis", specialty: "Appliance", status: "available", rating: 4.7, location: { x: 38, y: 62 } },
  { id: 5, name: "Alex Thompson", specialty: "HVAC", status: "en-route", rating: 4.6, location: { x: 85, y: 52 }, currentJob: "Emergency", eta: "4m" },
  { id: 6, name: "Chris Park", specialty: "Electrical", status: "busy", rating: 4.9, location: { x: 15, y: 72 }, currentJob: "Panel Upgrade", eta: "25m" },
]

const aiInsights = [
  { message: "High HVAC demand predicted in Marina district within 2 hours", confidence: 94, type: "prediction" },
  { message: "Route optimization available for John M. - saves 23 minutes", confidence: 87, type: "optimization" },
  { message: "Equipment failure pattern detected - Customer #4521", confidence: 78, type: "alert" },
]

const navItems = [
  { icon: Home, label: "Overview", active: true },
  { icon: Map, label: "Fleet" },
  { icon: AlertTriangle, label: "Emergencies", count: 3 },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Team" },
  { icon: Settings, label: "Settings" },
]

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
    </span>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(generateRealtimeData())
  const [selectedTech, setSelectedTech] = useState<number | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showSearch, setShowSearch] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          window.location.href = "/login?redirect=/admin&message=first%20u%20have%20to%20login"
          return
        }
        const response = await api.get("/auth/me")
        if (response.data?.user) {
          const currentUser = response.data.user
          if (currentUser.role !== 'admin') {
            if (currentUser.role === 'technician') {
              window.location.href = '/technician'
            } else {
              window.location.href = '/customer'
            }
            return
          }
          setUser(currentUser)
          setIsAuthLoading(false)
        } else {
          localStorage.removeItem("token")
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
          window.location.href = "/login?redirect=/admin&message=first%20u%20have%20to%20login"
        }
      } catch (err) {
        console.error("Auth check failed on admin page:", err)
        localStorage.removeItem("token")
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
        window.location.href = "/login?redirect=/admin&message=first%20u%20have%20to%20login"
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthLoading) return
    const interval = setInterval(() => {
      setStats(generateRealtimeData())
      setCurrentTime(new Date())
    }, 3000)
    return () => clearInterval(interval)
  }, [isAuthLoading])

  const handleLogout = () => {
    api.post("/auth/logout").catch((error) => {
      console.error("Background logout failed", error)
    })
    localStorage.removeItem("token")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    window.location.href = "/login"
  }

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  }, [])



  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Minimal Left Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 border-r border-border/50 bg-sidebar">
        <Link href="/" className="mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"><div className="w-5 h-5 bg-white" style={{ maskImage: "url('/Final_logo_transparent.png')", WebkitMaskImage: "url('/Final_logo_transparent.png')", maskSize: "contain", WebkitMaskSize: "contain", maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center" }} /></div>
        </Link>
        
        <nav className="flex-1 flex flex-col items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                item.active 
                  ? "bg-primary/10 text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.count && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 flex items-center justify-center transition-all"
          title="Log Out"
        >
          <LogOut className="w-[18px] h-[18px]" />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-border/50 bg-background/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-6">
            <h1 className="text-[15px] font-semibold text-foreground">Command Center</h1>
            
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <LiveDot />
              <span className="text-xs font-medium text-emerald-400">{stats.wsConnections.toLocaleString()} connected</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <button 
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* AI */}
            <button className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center hover:bg-violet-500/20 transition-colors">
              <Bot className="w-4 h-4 text-violet-400" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggleCompact />

            {/* Notifications */}
            <button className="relative w-8 h-8 rounded-lg hover:bg-secondary/50 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
            </button>

            {/* Time */}
            <div className="text-sm font-mono text-muted-foreground tabular-nums">
              {formatTime(currentTime)}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-border/50">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="h-12 flex items-center gap-8 px-6 border-b border-border/50 bg-card/50 shrink-0">
          {[
            { label: "Active Techs", value: stats.activeTechnicians, icon: Users, color: "text-blue-400" },
            { label: "Live Jobs", value: stats.activeJobs, icon: Activity, color: "text-cyan-400" },
            { label: "Total Techs", value: stats.totalTechs.toString(), icon: Users, color: "text-blue-400" },
            { label: "Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-emerald-400" },
            { label: "Avg Response", value: `${stats.avgResponseTime}m`, icon: Clock, color: "text-amber-400" },
            { label: "Queue", value: stats.queueSize, icon: Layers, color: "text-amber-400" },
            { label: "Emergencies", value: stats.emergencies, icon: AlertTriangle, color: "text-red-400" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <stat.icon className={cn("w-4 h-4", stat.color)} />
              <span className="text-sm font-semibold text-foreground tabular-nums">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Map Area */}
          <div className="flex-1 relative">
            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
            
            {/* Map Header */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card">
                <Radio className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-medium text-foreground">Live Fleet</span>
                <span className="text-xs text-muted-foreground">
                  {techniciansOnline.length} active
                </span>
              </div>

              <div className="flex items-center gap-4 px-3 py-2 rounded-lg glass-card">
                {[
                  { color: "bg-emerald-500", label: "Available" },
                  { color: "bg-amber-500", label: "Busy" },
                  { color: "bg-blue-500", label: "En Route" },
                  { color: "bg-red-500", label: "Emergency" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5">
                    <div className={cn("w-2 h-2 rounded-full", item.color)} />
                    <span className="text-[11px] text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Overlays */}
            {[
              { name: "Downtown", x: 18, y: 18, w: 26, h: 28, demand: "high", jobs: 45 },
              { name: "SoMa", x: 50, y: 28, w: 20, h: 24, demand: "medium", jobs: 28 },
              { name: "Mission", x: 30, y: 55, w: 24, h: 28, demand: "medium", jobs: 32 },
              { name: "Marina", x: 8, y: 55, w: 18, h: 24, demand: "low", jobs: 18 },
            ].map((zone, i) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={cn(
                  "absolute rounded-lg border transition-all cursor-pointer",
                  zone.demand === "high" 
                    ? "border-red-500/30 bg-red-500/[0.03] hover:bg-red-500/[0.06]" 
                    : zone.demand === "medium"
                    ? "border-amber-500/30 bg-amber-500/[0.03] hover:bg-amber-500/[0.06]"
                    : "border-emerald-500/30 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]"
                )}
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
              >
                <div className="absolute left-2 top-2 flex items-center gap-2">
                  <span className="text-[11px] font-medium text-foreground/70">{zone.name}</span>
                  <span className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                    zone.demand === "high" ? "bg-red-500/20 text-red-400" :
                    zone.demand === "medium" ? "bg-amber-500/20 text-amber-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {zone.jobs}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Technician Markers */}
            {techniciansOnline.map((tech, i) => (
              <motion.div
                key={tech.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.03, type: "spring", stiffness: 400 }}
                className="absolute cursor-pointer z-20"
                style={{ left: `${tech.location.x}%`, top: `${tech.location.y}%` }}
                onClick={() => setSelectedTech(selectedTech === tech.id ? null : tech.id)}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  {tech.status === "en-route" && (
                    <span className="absolute inset-0 -m-1.5 rounded-full bg-blue-500/30 animate-ping" />
                  )}
                  
                  <div className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-lg",
                    tech.status === "busy" ? "bg-amber-500" :
                    tech.status === "available" ? "bg-emerald-500" : "bg-blue-500",
                    selectedTech === tech.id && "ring-2 ring-white ring-offset-2 ring-offset-background scale-110"
                  )}>
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>

                  <AnimatePresence>
                    {selectedTech === tech.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute left-10 top-0 w-52 rounded-xl bg-card border border-border p-3 shadow-2xl z-30"
                      >
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedTech(null) }}
                          className="absolute right-2 top-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className={cn(
                            "w-9 h-9 rounded-full flex items-center justify-center",
                            tech.status === "busy" ? "bg-amber-500/20" :
                            tech.status === "available" ? "bg-emerald-500/20" : "bg-blue-500/20"
                          )}>
                            <User className={cn(
                              "w-4 h-4",
                              tech.status === "busy" ? "text-amber-400" :
                              tech.status === "available" ? "text-emerald-400" : "text-blue-400"
                            )} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{tech.name}</div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span>{tech.specialty}</span>
                              <span className="flex items-center gap-0.5 text-amber-400">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {tech.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {tech.currentJob && (
                          <div className="text-xs bg-secondary rounded-lg px-2.5 py-2 mb-3 border border-border">
                            <span className="text-muted-foreground">Current: </span>
                            <span className="text-foreground font-medium">{tech.currentJob}</span>
                            {tech.eta && <span className="text-blue-400 ml-1.5">ETA {tech.eta}</span>}
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs bg-secondary border-border hover:bg-muted">
                            <Phone className="w-3 h-3 mr-1.5" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs bg-secondary border-border hover:bg-muted">
                            <MessageSquare className="w-3 h-3 mr-1.5" />
                            Message
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}

            {/* Emergency Markers */}
            {emergencyQueue.slice(0, 2).map((emergency, i) => (
              <motion.div
                key={emergency.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute z-30"
                style={{ left: `${45 + i * 18}%`, top: `${42 + i * 12}%` }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <span className="absolute inset-0 -m-2 rounded-full bg-red-500/25 animate-ping" />
                  <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                    <AlertTriangle className="w-3 h-3 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Bottom Analytics Row */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-3 z-10">
              {[
                { label: "Completion Rate", value: `${stats.completionRate}%`, trend: "+3%", up: true, icon: Target },
                { label: "Utilization", value: `${stats.utilization}%`, trend: "+5%", up: true, icon: Activity },
                { label: "Satisfaction", value: stats.satisfaction, trend: "+0.2", up: true, icon: Star },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center gap-3 px-4 py-2.5 rounded-lg glass-card">
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-semibold text-foreground tabular-nums">{metric.value}</div>
                    <div className="text-[10px] text-muted-foreground">{metric.label}</div>
                  </div>
                  <div className={cn("flex items-center gap-0.5 text-[11px] font-medium", metric.up ? "text-emerald-400" : "text-red-400")}>
                    {metric.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {metric.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <aside className="w-80 border-l border-border/50 bg-sidebar flex flex-col shrink-0">
            {/* Live Dispatch */}
            <div className="flex-1 flex flex-col border-b border-border/50 min-h-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-foreground">Live Dispatch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LiveDot />
                  <span className="text-[11px] text-emerald-400">Streaming</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {dispatchFeed.map((dispatch, i) => (
                  <motion.div
                    key={dispatch.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-2.5 mb-1.5 transition-colors cursor-pointer",
                      dispatch.priority === "emergency" 
                        ? "bg-red-500/10 hover:bg-red-500/15" 
                        : "hover:bg-secondary/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                      dispatch.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                      dispatch.status === "on-site" ? "bg-cyan-500/15 text-cyan-400" :
                      "bg-blue-500/15 text-blue-400"
                    )}>
                      <dispatch.icon className="w-4 h-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground">{dispatch.technician}</span>
                        <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
                        <span className="text-xs text-muted-foreground truncate">{dispatch.customer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{dispatch.service}</span>
                        {dispatch.priority === "emergency" && (
                          <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">EMERGENCY</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <div className={cn(
                        "text-[11px] font-medium",
                        dispatch.status === "completed" ? "text-emerald-400" :
                        dispatch.status === "on-site" ? "text-cyan-400" : "text-blue-400"
                      )}>
                        {dispatch.status === "en-route" ? `ETA ${dispatch.eta}` : dispatch.status}
                      </div>
                      <div className="text-[10px] text-muted-foreground/60 mt-0.5">{dispatch.time}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Emergency Queue */}
            <div className="border-b border-border/50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-foreground">Emergencies</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-red-500 text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {emergencyQueue.length}
                </span>
              </div>
              
              <div className="p-2 space-y-1.5 max-h-36 overflow-y-auto">
                {emergencyQueue.map((emergency, i) => (
                  <motion.div
                    key={emergency.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    className={cn(
                      "rounded-lg p-2.5",
                      emergency.severity === "critical" ? "bg-red-500/10" : "bg-amber-500/10"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn(
                            "text-[9px] font-bold uppercase px-1.5 py-0.5 rounded",
                            emergency.severity === "critical" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                          )}>
                            {emergency.severity}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{emergency.time} ago</span>
                        </div>
                        <p className="text-xs font-medium text-foreground">{emergency.issue}</p>
                        <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {emergency.location}
                        </p>
                      </div>
                      <Button size="sm" className="h-7 px-2.5 text-[10px] bg-red-500 hover:bg-red-600 shrink-0">
                        Dispatch
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-medium text-foreground">AI Insights</span>
                </div>
                <span className="text-[10px] text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded-full font-medium">
                  {aiInsights.length} new
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {aiInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="rounded-lg bg-secondary/50 border border-border p-3 hover:border-violet-500/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-2.5 mb-2.5">
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                        insight.type === "prediction" ? "bg-blue-500/15 text-blue-400" :
                        insight.type === "optimization" ? "bg-cyan-500/15 text-cyan-400" :
                        "bg-amber-500/15 text-amber-400"
                      )}>
                        {insight.type === "prediction" && <TrendingUp className="w-3 h-3" />}
                        {insight.type === "optimization" && <Navigation className="w-3 h-3" />}
                        {insight.type === "alert" && <AlertTriangle className="w-3 h-3" />}
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{insight.message}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-14 rounded-full bg-muted overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${insight.confidence}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-blue-500 rounded-full" 
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{insight.confidence}%</span>
                      </div>
                      <button className="text-[11px] text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1">
                        Apply
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technicians, customers, jobs..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  autoFocus
                />
                <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">ESC</kbd>
              </div>
              <div className="p-2">
                <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-1.5">Quick Actions</div>
                {[
                  { icon: Users, label: "View all technicians", shortcut: "T" },
                  { icon: AlertTriangle, label: "Emergency dispatch", shortcut: "E" },
                  { icon: BarChart3, label: "Open analytics", shortcut: "A" },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 hover:bg-secondary transition-colors"
                  >
                    <action.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1 text-left">{action.label}</span>
                    <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{action.shortcut}</kbd>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
