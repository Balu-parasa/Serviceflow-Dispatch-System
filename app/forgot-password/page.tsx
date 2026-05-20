"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  Mail,
  ArrowRight,
  Shield,
  Clock,
  Star,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/api"

const features = [
  {
    icon: Shield,
    title: "Verified Technicians",
    description: "All our technicians are background-checked and licensed",
  },
  {
    icon: Clock,
    title: "Fast Response",
    description: "Average response time under 15 minutes",
  },
  {
    icon: Star,
    title: "Quality Guaranteed",
    description: "4.9 average rating from 50,000+ reviews",
  },
]

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [infoMessage, setInfoMessage] = useState("")
  const [redirectPath, setRedirectPath] = useState("")

  // Capture optional redirect/message from query (e.g., after a password reset)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const msg = params.get("message")
      const red = params.get("redirect")
      if (msg) setInfoMessage(msg)
      if (red) setRedirectPath(red)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage("")
    try {
      const response = await api.post("/auth/forgot-password", { email })
      const message = response.data.message || "Password reset instructions have been sent to your email."
      // Redirect to login with a success message
      const encoded = encodeURIComponent(message)
      window.location.href = `/login?message=${encoded}`
    } catch (err: any) {
      console.error(err)
      const message = err.response?.data?.message || "Failed to request password reset."
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 bg-background">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary glow-blue">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ServiceFlow</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Forgot Password
            </h1>
            <p className="mt-2 text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </motion.div>

          {/* Info / Error banners */}
          <AnimatePresence>
            {infoMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2.5 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-sm text-blue-400"
              >
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{infoMessage}</span>
              </motion.div>
            )}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-sm text-destructive"
              >
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/50 pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 glow-blue"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Back to Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            {"Remembered your password? "}
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </motion.p>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative flex h-full flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-balance text-3xl font-bold text-foreground">
              AI-Powered Service Dispatch at Your Fingertips
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Join thousands of customers who trust ServiceFlow for their home,
              commercial, and industrial service needs.
            </p>

            {/* Features */}
            <div className="mt-10 space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <feature.icon className="h-5 w-5" />
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex gap-8"
            >
              {[
                { value: "50K+", label: "Jobs Completed" },
                { value: "2,800+", label: "Technicians" },
                { value: "4.9", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


