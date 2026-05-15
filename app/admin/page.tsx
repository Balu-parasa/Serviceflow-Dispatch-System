"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  User,
  Star,
  Navigation,
  Thermometer,
  Droplets,
  Plug,
  Wrench,
  MoreVertical,
  RefreshCw,
  Wifi,
  Radio,
  Target,
  Calendar,
  MessageSquare,
  Shield,
  Gauge,
  Layers,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Mock Data
const liveStats = {
  activeTechnicians: 128,
  activeJobs: 247,
  completedToday: 892,
  revenue: 48750,
  avgResponseTime: "12 min",
  satisfaction: 4.9,
}

const dispatchFeed = [
  {
    id: "DSP-001",
    technician: "John M.",
    customer: "Sarah Mitchell",
    service: "HVAC",
    status: "en-route",
    eta: "8 min",
    time: "Just now",
    icon: Thermometer,
    priority: "high",
  },
  {
    id: "DSP-002",
    technician: "Mike R.",
    customer: "David Chen",
    service: "Plumbing",
    status: "on-site",
    eta: "-",
    time: "5 min ago",
    icon: Droplets,
    priority: "normal",
  },
  {
    id: "DSP-003",
    technician: "Sarah C.",
    customer: "Emily Davis",
    service: "Electrical",
    status: "completed",
    eta: "-",
    time: "12 min ago",
    icon: Plug,
    priority: "normal",
  },
  {
    id: "DSP-004",
    technician: "Alex T.",
    customer: "James Wilson",
    service: "Appliance",
    status: "en-route",
    eta: "15 min",
    time: "18 min ago",
    icon: Wrench,
    priority: "emergency",
  },
]

const emergencyQueue = [
  {
    id: "EMG-001",
    issue: "Gas leak detected",
    location: "789 Pine St, SF",
    time: "2 min ago",
    severity: "critical",
  },
  {
    id: "EMG-002",
    issue: "Power outage - elderly resident",
    location: "456 Oak Ave, SF",
    time: "8 min ago",
    severity: "high",
  },
  {
    id: "EMG-003",
    issue: "Flooding - burst pipe",
    location: "123 Main St, SF",
    time: "15 min ago",
    severity: "high",
  },
]

const techniciansOnline = [
  {
    id: 1,
    name: "John Mitchell",
    specialty: "HVAC",
    status: "busy",
    jobs: 4,
    rating: 4.9,
    location: "Downtown",
  },
  {
    id: 2,
    name: "Sarah Chen",
    specialty: "Electrical",
    status: "available",
    jobs: 3,
    rating: 4.8,
    location: "Mission",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    specialty: "Plumbing",
    status: "busy",
    jobs: 5,
    rating: 5.0,
    location: "SoMa",
  },
  {
    id: 4,
    name: "Emily Davis",
    specialty: "Appliance",
    status: "available",
    jobs: 2,
    rating: 4.7,
    location: "Marina",
  },
  {
    id: 5,
    name: "Alex Thompson",
    specialty: "HVAC",
    status: "offline",
    jobs: 0,
    rating: 4.6,
    location: "-",
  },
]

const revenueData = [
  { hour: "6AM", value: 1200 },
  { hour: "8AM", value: 3500 },
  { hour: "10AM", value: 5800 },
  { hour: "12PM", value: 7200 },
  { hour: "2PM", value: 8900 },
  { hour: "4PM", value: 6500 },
  { hour: "6PM", value: 4200 },
  { hour: "8PM", value: 2800 },
]

const serviceBreakdown = [
  { name: "HVAC", value: 35, color: "bg-accent" },
  { name: "Plumbing", value: 28, color: "bg-primary" },
  { name: "Electrical", value: 22, color: "bg-warning" },
  { name: "Appliance", value: 15, color: "bg-success" },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden text-lg font-semibold text-foreground lg:inline">
                Command Center
              </span>
            </Link>

            {/* Live Indicator */}
            <div className="flex items-center gap-2 rounded-full bg-success/20 px-3 py-1">
              <Wifi className="h-3 w-3 text-success live-indicator" />
              <span className="text-xs font-medium text-success">
                Live Connection
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="hidden flex-1 justify-center px-8 md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search jobs, technicians, customers..."
                className="bg-secondary/50 pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="rounded-lg bg-secondary p-2 transition-colors hover:bg-secondary/80"
            >
              <RefreshCw
                className={cn(
                  "h-5 w-5 text-foreground",
                  isRefreshing && "animate-spin"
                )}
              />
            </button>

            <button className="relative rounded-lg bg-secondary p-2 transition-colors hover:bg-secondary/80">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                5
              </span>
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-foreground">Admin</div>
                <div className="text-xs text-muted-foreground">Operations</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 pb-8 pt-24 sm:px-6">
        {/* Top Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
        >
          {[
            {
              label: "Active Techs",
              value: liveStats.activeTechnicians,
              icon: Users,
              color: "text-primary",
              trend: "+12",
            },
            {
              label: "Active Jobs",
              value: liveStats.activeJobs,
              icon: Activity,
              color: "text-accent",
              trend: "+28",
            },
            {
              label: "Completed",
              value: liveStats.completedToday,
              icon: CheckCircle,
              color: "text-success",
              trend: "+156",
            },
            {
              label: "Revenue",
              value: `$${(liveStats.revenue / 1000).toFixed(1)}K`,
              icon: DollarSign,
              color: "text-success",
              trend: "+$8.2K",
            },
            {
              label: "Avg Response",
              value: liveStats.avgResponseTime,
              icon: Clock,
              color: "text-warning",
              trend: "-2 min",
            },
            {
              label: "Satisfaction",
              value: liveStats.satisfaction,
              icon: Star,
              color: "text-warning",
              trend: "+0.2",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center justify-between">
                <stat.icon className={cn("h-5 w-5", stat.color)} />
                <span className="text-xs text-success">{stat.trend}</span>
              </div>
              <div className="mt-2 text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-6 xl:grid-cols-4">
          {/* Main Content Area */}
          <div className="space-y-6 xl:col-span-3">
            {/* Live Fleet Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card overflow-hidden rounded-xl"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-foreground">
                    Live Fleet Map
                  </h2>
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
                    {liveStats.activeTechnicians} Online
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Expand
                  </Button>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative h-80 bg-secondary/30">
                <div className="absolute inset-0 grid-pattern opacity-50" />

                {/* Simulated Map Points */}
                {[
                  { x: "20%", y: "30%", status: "busy", name: "John M." },
                  { x: "45%", y: "50%", status: "available", name: "Sarah C." },
                  { x: "70%", y: "25%", status: "busy", name: "Mike R." },
                  { x: "35%", y: "70%", status: "en-route", name: "Alex T." },
                  { x: "80%", y: "60%", status: "available", name: "Emily D." },
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="absolute"
                    style={{ left: point.x, top: point.y }}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "h-4 w-4 rounded-full",
                          point.status === "busy"
                            ? "bg-warning"
                            : point.status === "available"
                              ? "bg-success"
                              : "bg-primary"
                        )}
                      >
                        {point.status === "en-route" && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
                        )}
                      </div>
                      <div className="absolute left-6 top-0 whitespace-nowrap rounded bg-card px-2 py-1 text-xs text-foreground shadow-lg">
                        {point.name}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 flex gap-4 rounded-lg bg-card/90 p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-warning" />
                    <span className="text-xs text-muted-foreground">Busy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <span className="text-xs text-muted-foreground">
                      En Route
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Two Column Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Realtime Dispatch Feed */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-xl"
              >
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <Radio className="h-5 w-5 text-accent live-indicator" />
                    <h3 className="font-semibold text-foreground">
                      Dispatch Feed
                    </h3>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Live Updates
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {dispatchFeed.map((dispatch, i) => (
                      <motion.div
                        key={dispatch.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "flex items-center gap-3 rounded-lg bg-secondary/50 p-3",
                          dispatch.priority === "emergency" &&
                            "border border-destructive/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                            dispatch.status === "completed"
                              ? "bg-success/20 text-success"
                              : dispatch.status === "on-site"
                                ? "bg-accent/20 text-accent"
                                : "bg-primary/20 text-primary"
                          )}
                        >
                          <dispatch.icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {dispatch.technician}
                            </span>
                            {dispatch.priority === "emergency" && (
                              <span className="rounded bg-destructive/20 px-1.5 py-0.5 text-xs text-destructive">
                                EMERGENCY
                              </span>
                            )}
                          </div>
                          <div className="truncate text-sm text-muted-foreground">
                            {dispatch.service} - {dispatch.customer}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={cn(
                              "text-xs font-medium",
                              dispatch.status === "completed"
                                ? "text-success"
                                : dispatch.status === "on-site"
                                  ? "text-accent"
                                  : "text-primary"
                            )}
                          >
                            {dispatch.status === "en-route"
                              ? `ETA: ${dispatch.eta}`
                              : dispatch.status}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {dispatch.time}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Emergency Queue */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-xl"
              >
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-foreground">
                      Emergency Queue
                    </h3>
                    <span className="rounded-full bg-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive">
                      {emergencyQueue.length} Active
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {emergencyQueue.map((emergency, i) => (
                      <motion.div
                        key={emergency.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          "rounded-lg border p-4",
                          emergency.severity === "critical"
                            ? "border-destructive/50 bg-destructive/10"
                            : "border-warning/50 bg-warning/10"
                        )}
                      >
                        <div className="mb-2 flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={cn(
                                "h-4 w-4",
                                emergency.severity === "critical"
                                  ? "text-destructive"
                                  : "text-warning"
                              )}
                            />
                            <span
                              className={cn(
                                "text-xs font-medium uppercase",
                                emergency.severity === "critical"
                                  ? "text-destructive"
                                  : "text-warning"
                              )}
                            >
                              {emergency.severity}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {emergency.time}
                          </span>
                        </div>
                        <div className="mb-2 font-medium text-foreground">
                          {emergency.issue}
                        </div>
                        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {emergency.location}
                        </div>
                        <Button
                          size="sm"
                          className="w-full gap-2"
                          variant={
                            emergency.severity === "critical"
                              ? "destructive"
                              : "default"
                          }
                        >
                          <Navigation className="h-4 w-4" />
                          Dispatch Now
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Revenue & Analytics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    {"Today's"} Revenue
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  +24% vs yesterday
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Chart */}
                <div className="lg:col-span-2">
                  <div className="flex h-48 items-end justify-between gap-2">
                    {revenueData.map((data, i) => {
                      const maxValue = Math.max(...revenueData.map((d) => d.value))
                      const height = (data.value / maxValue) * 100
                      return (
                        <div key={i} className="flex flex-1 flex-col items-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                            className="w-full rounded-t bg-gradient-to-t from-primary/50 to-primary"
                          />
                          <span className="mt-2 text-xs text-muted-foreground">
                            {data.hour}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Service Breakdown */}
                <div>
                  <h4 className="mb-4 text-sm font-medium text-foreground">
                    Service Breakdown
                  </h4>
                  <div className="space-y-3">
                    {serviceBreakdown.map((service, i) => (
                      <div key={i}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {service.name}
                          </span>
                          <span className="text-foreground">
                            {service.value}%
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${service.value}%` }}
                            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                            className={cn("h-full rounded-full", service.color)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Technicians Online */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <h3 className="font-semibold text-foreground">
                  Technician Fleet
                </h3>
                <Link
                  href="#"
                  className="text-xs text-primary hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="max-h-96 overflow-y-auto p-4">
                <div className="space-y-3">
                  {techniciansOnline.map((tech, i) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                    >
                      <div className="relative">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                          <User className="h-5 w-5" />
                        </div>
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                            tech.status === "available"
                              ? "bg-success"
                              : tech.status === "busy"
                                ? "bg-warning"
                                : "bg-muted-foreground"
                          )}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate font-medium text-foreground">
                            {tech.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{tech.specialty}</span>
                          <span>•</span>
                          <span>{tech.jobs} jobs</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-foreground">{tech.rating}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-3/20 text-chart-3">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-foreground">AI Insights</h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    insight: "HVAC demand expected to spike 40% this weekend due to heatwave",
                    type: "prediction",
                  },
                  {
                    insight: "3 technicians available in high-demand Marina area",
                    type: "opportunity",
                  },
                  {
                    insight: "Average job completion time improved by 12 min today",
                    type: "performance",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground"
                  >
                    {item.insight}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-xl p-4"
            >
              <h3 className="mb-4 font-semibold text-foreground">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Navigation, label: "Dispatch", color: "text-primary" },
                  { icon: Users, label: "Manage", color: "text-accent" },
                  { icon: BarChart3, label: "Reports", color: "text-success" },
                  { icon: Settings, label: "Settings", color: "text-muted-foreground" },
                ].map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto flex-col gap-2 py-4"
                  >
                    <action.icon className={cn("h-5 w-5", action.color)} />
                    <span className="text-xs">{action.label}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
