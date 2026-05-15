"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Play,
  Pause,
  Timer,
  Target,
  Award,
  Thermometer,
  Droplets,
  Plug,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const activeJob = {
  id: "JOB-2847",
  customer: "Sarah Mitchell",
  service: "HVAC Repair",
  address: "456 Oak Avenue, San Francisco, CA 94102",
  phone: "(555) 234-5678",
  issue: "AC unit not cooling properly, making strange noise",
  priority: "high",
  eta: "Arrived",
  earnings: 285,
  startTime: "10:32 AM",
}

const upcomingJobs = [
  {
    id: "JOB-2848",
    customer: "Mike Johnson",
    service: "Plumbing",
    address: "789 Pine St",
    time: "2:00 PM",
    earnings: 120,
    icon: Droplets,
  },
  {
    id: "JOB-2849",
    customer: "Emily Davis",
    service: "Electrical",
    address: "321 Cedar Ln",
    time: "4:30 PM",
    earnings: 175,
    icon: Plug,
  },
]

const todayStats = {
  completedJobs: 4,
  totalEarnings: 642,
  avgRating: 4.9,
  hoursWorked: 6.5,
}

const weeklyEarnings = [
  { day: "Mon", amount: 320 },
  { day: "Tue", amount: 485 },
  { day: "Wed", amount: 275 },
  { day: "Thu", amount: 520 },
  { day: "Fri", amount: 642 },
  { day: "Sat", amount: 0 },
  { day: "Sun", amount: 0 },
]

const alerts = [
  {
    id: 1,
    type: "urgent",
    message: "Emergency request nearby - HVAC failure",
    time: "2 min ago",
  },
  {
    id: 2,
    type: "info",
    message: "New job assigned for tomorrow",
    time: "15 min ago",
  },
  {
    id: 3,
    type: "success",
    message: "Payment received: $285",
    time: "1 hour ago",
  },
]

export default function TechnicianDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [jobStatus, setJobStatus] = useState<
    "en-route" | "arrived" | "in-progress" | "completed"
  >("in-progress")
  const [showAlerts, setShowAlerts] = useState(false)

  const statusSteps = [
    { id: "en-route", label: "En Route", icon: Navigation },
    { id: "arrived", label: "Arrived", icon: MapPin },
    { id: "in-progress", label: "In Progress", icon: Timer },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ]

  const currentStepIndex = statusSteps.findIndex((s) => s.id === jobStatus)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass fixed left-0 right-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden text-lg font-semibold text-foreground sm:inline">
                Technician Portal
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Status Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                isOnline
                  ? "bg-success/20 text-success"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  isOnline ? "bg-success live-indicator" : "bg-muted-foreground"
                )}
              />
              {isOnline ? "Online" : "Offline"}
            </button>

            {/* Alerts */}
            <div className="relative">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className="relative rounded-lg bg-secondary p-2 transition-colors hover:bg-secondary/80"
              >
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                  3
                </span>
              </button>

              {showAlerts && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card absolute right-0 top-12 w-80 rounded-xl p-4"
                >
                  <h3 className="mb-3 font-semibold text-foreground">Alerts</h3>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex gap-3 rounded-lg bg-secondary/50 p-3"
                      >
                        <div
                          className={cn(
                            "mt-0.5 h-2 w-2 shrink-0 rounded-full",
                            alert.type === "urgent"
                              ? "bg-destructive"
                              : alert.type === "success"
                                ? "bg-success"
                                : "bg-primary"
                          )}
                        />
                        <div>
                          <p className="text-sm text-foreground">
                            {alert.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-foreground">
                  John Mitchell
                </div>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3 w-3 fill-warning" />
                  4.9
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Active Job */}
          <div className="space-y-6 lg:col-span-2">
            {/* Active Job Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card overflow-hidden rounded-xl"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
                    <Thermometer className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      Active Job
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {activeJob.id}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "rounded-full px-3 py-1 text-sm font-medium",
                    activeJob.priority === "high"
                      ? "bg-warning/20 text-warning"
                      : "bg-primary/20 text-primary"
                  )}
                >
                  {activeJob.priority === "high" ? "Priority" : "Standard"}
                </div>
              </div>

              {/* Job Status Progress */}
              <div className="border-b border-border p-4">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() =>
                            setJobStatus(
                              step.id as
                                | "en-route"
                                | "arrived"
                                | "in-progress"
                                | "completed"
                            )
                          }
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full transition-all",
                            index <= currentStepIndex
                              ? "bg-primary glow-blue"
                              : "bg-secondary"
                          )}
                        >
                          <step.icon
                            className={cn(
                              "h-5 w-5",
                              index <= currentStepIndex
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                        <span
                          className={cn(
                            "mt-2 text-xs",
                            index <= currentStepIndex
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={cn(
                            "mx-2 h-0.5 w-8 sm:w-16",
                            index < currentStepIndex
                              ? "bg-primary"
                              : "bg-secondary"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Job Details */}
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">
                      Customer Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">
                          {activeJob.customer}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                        <span className="text-foreground">
                          {activeJob.address}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span className="text-foreground">
                          {activeJob.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-3 font-semibold text-foreground">
                      Service Details
                    </h3>
                    <div className="rounded-lg bg-secondary/50 p-3">
                      <div className="mb-2 text-sm font-medium text-foreground">
                        {activeJob.service}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {activeJob.issue}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Started: {activeJob.startTime}
                      </div>
                      <div className="flex items-center gap-2 font-semibold text-success">
                        <DollarSign className="h-4 w-4" />
                        {activeJob.earnings}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button className="flex-1 gap-2 glow-blue sm:flex-none">
                    <Navigation className="h-4 w-4" />
                    Navigate
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 sm:flex-none"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 sm:flex-none"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                  {jobStatus === "in-progress" && (
                    <Button
                      onClick={() => setJobStatus("completed")}
                      className="flex-1 gap-2 bg-success text-success-foreground hover:bg-success/90 sm:flex-none"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Complete Job
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card overflow-hidden rounded-xl"
            >
              <div className="flex h-64 items-center justify-center bg-secondary/30">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-primary" />
                  <p className="mt-2 text-muted-foreground">
                    Live Navigation Map
                  </p>
                  <p className="text-sm text-muted-foreground">
                    456 Oak Avenue, San Francisco
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Upcoming Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Upcoming Jobs</h3>
                <Link
                  href="#"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <job.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {job.customer}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{job.service}</span>
                          <span>•</span>
                          <span>{job.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-foreground">
                        {job.time}
                      </div>
                      <div className="text-sm text-success">${job.earnings}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Stats & Earnings */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-xl p-4"
            >
              <h3 className="mb-4 font-semibold text-foreground">
                {"Today's"} Performance
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span className="text-xs">Jobs</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {todayStats.completedJobs}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Earnings</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold text-success">
                    ${todayStats.totalEarnings}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span className="text-xs">Rating</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold text-warning">
                    {todayStats.avgRating}
                  </div>
                </div>

                <div className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Hours</span>
                  </div>
                  <div className="mt-1 text-2xl font-bold text-foreground">
                    {todayStats.hoursWorked}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Weekly Earnings Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Weekly Earnings
                </h3>
                <div className="flex items-center gap-1 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  +18%
                </div>
              </div>

              <div className="flex h-32 items-end justify-between gap-2">
                {weeklyEarnings.map((day, i) => {
                  const maxAmount = Math.max(...weeklyEarnings.map((d) => d.amount))
                  const height =
                    day.amount > 0 ? (day.amount / maxAmount) * 100 : 5
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t",
                          i === 4
                            ? "bg-primary glow-blue"
                            : day.amount > 0
                              ? "bg-primary/50"
                              : "bg-secondary"
                        )}
                      />
                      <span className="mt-2 text-xs text-muted-foreground">
                        {day.day}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">
                  Weekly Total
                </span>
                <span className="text-lg font-bold text-foreground">
                  $
                  {weeklyEarnings.reduce((sum, day) => sum + day.amount, 0)}
                </span>
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-xl p-4"
            >
              <h3 className="mb-4 font-semibold text-foreground">
                Achievements
              </h3>

              <div className="space-y-3">
                {[
                  {
                    icon: Award,
                    title: "Top Rated",
                    desc: "4.9+ rating this month",
                    color: "text-warning",
                  },
                  {
                    icon: Target,
                    title: "Quick Responder",
                    desc: "Avg response under 10 min",
                    color: "text-success",
                  },
                  {
                    icon: Star,
                    title: "100 Jobs",
                    desc: "Milestone reached!",
                    color: "text-primary",
                  },
                ].map((achievement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-secondary",
                        achievement.color
                      )}
                    >
                      <achievement.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {achievement.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-xl p-4"
            >
              <h3 className="mb-4 font-semibold text-foreground">
                Quick Actions
              </h3>

              <div className="space-y-2">
                <Link href="/technician/schedule">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    View Schedule
                  </Button>
                </Link>
                <Link href="/technician/earnings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <DollarSign className="h-5 w-5 text-success" />
                    Earnings Report
                  </Button>
                </Link>
                <Link href="/technician/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    Settings
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
