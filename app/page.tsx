"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  Shield,
  Clock,
  MapPin,
  Wrench,
  Thermometer,
  Droplets,
  Plug,
  Cog,
  AlertTriangle,
  ArrowRight,
  Play,
  Check,
  Star,
  Users,
  Activity,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Navbar Component
function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-blue">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              Schneider
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#services"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Services
            </Link>
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="sm" className="glow-blue">
                Book Service
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-pattern" />

      {/* Animated Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            {/* Live Badge */}
            <motion.div variants={fadeInUp} className="mb-6 inline-flex">
              <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="text-sm font-medium text-primary">
                  2,847 technicians online now
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Realtime Smart Service{" "}
              <span className="text-glow-blue text-primary">
                Dispatch Platform
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl"
            >
              Book trusted technicians for home, commercial, and industrial
              services with AI-powered realtime tracking and dispatching.
            </motion.p>

            {/* Stats Row */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-wrap justify-center gap-8 lg:justify-start"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">
                  Jobs Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {"<"}15min
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg Response Time
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
            >
              <Link href="/booking">
                <Button size="lg" className="gap-2 glow-blue">
                  Book Service
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="h-4 w-4" />
                  Explore Platform
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="glass-card relative overflow-hidden rounded-2xl p-1">
              <div className="rounded-xl bg-card p-6">
                {/* Mini Dashboard */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Live Dispatch Feed
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                    <span className="text-xs text-success">Live</span>
                  </div>
                </div>

                {/* Activity Items */}
                <div className="space-y-3">
                  {[
                    {
                      name: "John D.",
                      service: "HVAC Repair",
                      status: "En Route",
                      time: "2 min",
                      icon: Thermometer,
                      color: "text-accent",
                    },
                    {
                      name: "Sarah M.",
                      service: "Plumbing",
                      status: "On Site",
                      time: "12 min",
                      icon: Droplets,
                      color: "text-primary",
                    },
                    {
                      name: "Mike R.",
                      service: "Electrical",
                      status: "Completed",
                      time: "Just now",
                      icon: Plug,
                      color: "text-success",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-secondary ${item.color}`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {item.service}
                          </span>
                          <span
                            className={`text-xs ${item.status === "Completed" ? "text-success" : item.status === "On Site" ? "text-accent" : "text-warning"}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: "Active", value: "128", trend: "+12%" },
                    { label: "Pending", value: "47", trend: "-5%" },
                    { label: "Today", value: "892", trend: "+23%" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-secondary/30 p-3 text-center"
                    >
                      <div className="text-lg font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="floating absolute -left-8 top-1/4 rounded-lg bg-card p-3 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 text-success">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">
                    Job Completed
                  </div>
                  <div className="text-xs text-muted-foreground">
                    AC Repair - $285
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="floating absolute -right-4 bottom-1/4 rounded-lg bg-card p-3 shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">
                    Tech Arriving
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ETA: 8 minutes
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Services Section
function ServicesSection() {
  const services = [
    {
      icon: Thermometer,
      title: "HVAC Services",
      description:
        "Heating, ventilation, and air conditioning installation, repair, and maintenance.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Droplets,
      title: "Plumbing",
      description:
        "Expert plumbing solutions for residential and commercial properties.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Plug,
      title: "Electrical",
      description:
        "Licensed electricians for all your electrical needs and emergencies.",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      icon: Wrench,
      title: "Appliance Repair",
      description:
        "Fast and reliable repair services for all major appliances.",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: Cog,
      title: "Industrial Maintenance",
      description:
        "Comprehensive industrial equipment maintenance and repair services.",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      icon: AlertTriangle,
      title: "Emergency Services",
      description:
        "24/7 emergency technical services with rapid response times.",
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ]

  return (
    <section id="services" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Comprehensive technical services for home, commercial, and
            industrial needs with AI-powered dispatch and realtime tracking.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group glass-card cursor-pointer rounded-xl p-6 transition-all hover:border-primary/30"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${service.bgColor} ${service.color}`}
              >
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>Book Now</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Features Section
function FeaturesSection() {
  const features = [
    {
      icon: Activity,
      title: "Realtime Tracking",
      description:
        "Track your technician in real-time with live GPS updates and ETA notifications.",
    },
    {
      icon: Zap,
      title: "AI-Powered Dispatch",
      description:
        "Smart matching algorithm assigns the best technician based on skills, location, and availability.",
    },
    {
      icon: Shield,
      title: "Verified Professionals",
      description:
        "All technicians are background-checked, licensed, and insured for your peace of mind.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description:
        "Round-the-clock service availability with priority emergency response.",
    },
  ]

  return (
    <section id="features" className="relative py-24">
      <div className="absolute inset-0 gradient-radial opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose Our Platform
            </h2>
            <p className="mt-4 text-muted-foreground">
              Experience the future of service booking with our cutting-edge
              technology and premium service quality.
            </p>

            <div className="mt-10 space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-semibold text-foreground">
                Platform Analytics
              </h3>
              <div className="flex items-center gap-2 text-xs text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+24% this month</span>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="mb-6 h-48 rounded-lg bg-secondary/30 p-4">
              <div className="flex h-full items-end justify-between gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className="w-full rounded-t bg-gradient-to-t from-primary/50 to-primary"
                    />
                  )
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Jobs", value: "12,847", change: "+12%" },
                { label: "Active Users", value: "8,432", change: "+8%" },
                { label: "Avg Rating", value: "4.92", change: "+0.3" },
                { label: "Response Time", value: "12 min", change: "-15%" },
              ].map((stat, i) => (
                <div key={i} className="rounded-lg bg-secondary/30 p-4">
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-xs text-success">{stat.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Jessica Martinez",
      role: "Homeowner",
      content:
        "The realtime tracking feature is incredible. I knew exactly when the technician would arrive and could follow their progress. The repair was quick and professional.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Property Manager",
      content:
        "Managing multiple properties used to be a nightmare. Now I can dispatch technicians to any location instantly and track all jobs from one dashboard.",
      rating: 5,
    },
    {
      name: "Sarah Thompson",
      role: "Business Owner",
      content:
        "The emergency response time is unmatched. When our HVAC system failed during a heatwave, they had a technician on-site within 20 minutes.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join thousands of satisfied customers who trust our platform for
            their service needs.
          </p>
        </motion.div>

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="glass-card rounded-xl p-6"
            >
              <div className="mb-4 flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="mb-6 text-muted-foreground">
                {'"'}
                {testimonial.content}
                {'"'}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-12"
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Join thousands of satisfied customers and experience the future of
            service booking today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/booking">
              <Button size="lg" className="gap-2 glow-blue">
                Book Your First Service
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/technician">
              <Button size="lg" variant="outline">
                Become a Technician
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            No credit card required. Start with a free consultation.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-foreground">
                Schneider
              </span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              AI-powered realtime technician booking and dispatch platform for
              home, commercial, and industrial services.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Services</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>HVAC Services</li>
              <li>Plumbing</li>
              <li>Electrical</li>
              <li>Appliance Repair</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Schneider Smart Service Platform.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Main Landing Page
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
