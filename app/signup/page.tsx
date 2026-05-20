"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  Zap,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Chrome,
  Phone,
  Check,
  Shield,
  Wrench,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

const accountTypes = [
  {
    id: "customer",
    icon: User,
    title: "Customer",
    description: "Book services for your property",
  },
  {
    id: "technician",
    icon: Wrench,
    title: "Technician",
    description: "Join our network of professionals",
  },
]

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [redirectPath, setRedirectPath] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const red = params.get("redirect")
      if (red) {
        setRedirectPath(red)
      }
    }
  }, [])

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      return
    }

    setIsLoading(true)
    setErrorMessage("")

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: accountType,
        specialty: accountType === "technician" ? specialty : undefined,
      }

      const response = await api.post("/auth/register", payload)
      const { token, redirect } = response.data

      // Store token
      localStorage.setItem("token", token)
      document.cookie = `token=${token}; path=/; max-age=31536000; SameSite=Lax`

      // Redirect
      window.location.href = redirectPath || redirect || "/customer"
    } catch (err: any) {
      console.error(err)
      const errors = err.response?.data?.errors
      let message = err.response?.data?.message || "Registration failed. Please check details."
      if (errors) {
        // Collect first error message
        const firstErrorKey = Object.keys(errors)[0]
        if (firstErrorKey && errors[firstErrorKey]?.[0]) {
          message = errors[firstErrorKey][0]
        }
      }
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Visual */}
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 via-background to-primary/20" />
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute inset-0 grid-pattern opacity-30" />

        <div className="relative flex h-full flex-col justify-center px-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-balance text-3xl font-bold text-foreground">
              Join the Future of Service Management
            </h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground">
              Create your account and experience seamless service booking with
              AI-powered dispatch and realtime tracking.
            </p>

            {/* Benefits */}
            <div className="mt-10 space-y-4">
              {[
                "Instant access to verified technicians",
                "Realtime tracking and updates",
                "Transparent pricing with no hidden fees",
                "24/7 customer support",
                "Satisfaction guaranteed",
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-12 rounded-xl border border-border bg-card/50 p-6"
            >
              <p className="italic text-muted-foreground">
                {'"'}ServiceFlow transformed how we manage our property
                maintenance. The realtime tracking and instant dispatch have
                saved us countless hours.{'"'}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    Jessica Martinez
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Property Manager
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
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
              <span className="text-xl font-bold text-foreground">
                ServiceFlow
              </span>
            </Link>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  step >= 1
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                1
              </div>
              <div
                className={cn(
                  "h-1 w-16",
                  step >= 2 ? "bg-primary" : "bg-secondary"
                )}
              />
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  step >= 2
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                2
              </div>
            </div>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {step === 1 ? "Choose account type" : "Create your account"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {step === 1
                ? "Select how you want to use ServiceFlow"
                : "Fill in your details to get started"}
            </p>
          </motion.div>

          {/* Error Message banner */}
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

          {/* Form */}
          <motion.form
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            {step === 1 ? (
              <div className="space-y-3">
                {accountTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAccountType(type.id)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all",
                      accountType === type.id
                        ? "border-primary bg-primary/10 glow-blue"
                        : "border-border bg-secondary/50 hover:border-primary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg",
                        accountType === type.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {type.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {type.description}
                      </div>
                    </div>
                    {accountType === type.id && (
                      <Check className="ml-auto h-5 w-5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                      className="bg-secondary/50 pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="bg-secondary/50 pl-10"
                      required
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
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="bg-secondary/50 pl-10"
                      required
                    />
                  </div>
                </div>

                {accountType === "technician" && (
                  <div>
                    <Label htmlFor="specialty">Technician Service Specialty</Label>
                    <div className="relative mt-2">
                      <Wrench className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <select
                        id="specialty"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="w-full rounded-md border border-input bg-secondary/50 h-10 px-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground appearance-none"
                        required
                      >
                        <option value="" disabled className="bg-background text-muted-foreground">Select a Specialty</option>
                        <option value="Electricity" className="bg-background text-foreground">Electricity</option>
                        <option value="Plumber" className="bg-background text-foreground">Plumber</option>
                        <option value="HVAC" className="bg-background text-foreground">HVAC Maintenance</option>
                        <option value="Appliance Repair" className="bg-background text-foreground">Appliance Repair</option>
                        <option value="General Maintenance" className="bg-background text-foreground">General Maintenance</option>
                        <option value="Industrial Maintenance" className="bg-background text-foreground">Industrial Maintenance</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) =>
                        updateFormData("password", e.target.value)
                      }
                      className="bg-secondary/50 pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        updateFormData("confirmPassword", e.target.value)
                      }
                      className="bg-secondary/50 pl-10 pr-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className={cn("gap-2 glow-blue", step === 1 ? "w-full" : "flex-1")}
                disabled={isLoading || (step === 1 && !accountType) || (step === 2 && accountType === "technician" && !specialty)}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : step === 1 ? (
                  <>
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {step === 2 && (
              <>
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">
                      Or sign up with
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="grid grid-cols-1">
                  <Button variant="outline" type="button" className="gap-2 w-full">
                    <Chrome className="h-5 w-5" />
                    Google
                  </Button>
                </div>
              </>
            )}
          </motion.form>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </motion.p>

          {/* Sign In Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  )
}

