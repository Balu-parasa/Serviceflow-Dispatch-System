"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Send,
  Zap,
  ChevronLeft,
  MessageSquare,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Clock,
  Activity,
  CheckCircle,
  Phone,
  Shield,
  Sparkles,
  AlertTriangle,
  Smile,
  Paperclip,
} from "lucide-react"
import api from "@/lib/api"
import echoInstance from "@/lib/echo"
import { toast, Toaster } from "sonner"

interface Message {
  id: string | number
  booking_id: string | number
  sender_id: string | number
  receiver_id: string | number
  body: string
  is_read: boolean
  created_at: string
  sender?: {
    id: string | number
    name: string
    role: string
  }
}

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
  customer?: {
    id: string | number
    name: string
    email: string
    phone?: string
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
}

function ChatContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("bookingId")

  const [currentUser, setCurrentUser] = useState<any>(null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch logged in user
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me")
      if (response.data?.user) {
        setCurrentUser(response.data.user)
      } else {
        window.location.href = `/login?redirect=/chat?bookingId=${bookingId}&message=first%20u%20have%20to%20login`
      }
    } catch (error) {
      console.error("Failed to fetch user", error)
      window.location.href = `/login?redirect=/chat?bookingId=${bookingId}&message=first%20u%20have%20to%20login`
    }
  }

  // Fetch booking details & messages
  const fetchBookingAndMessages = async () => {
    if (!bookingId) return
    try {
      // 1. Fetch booking details
      const bookingRes = await api.get(`/bookings/${bookingId}`)
      setBooking(bookingRes.data.booking || bookingRes.data)

      // 2. Fetch historic messages
      const messagesRes = await api.get(`/bookings/${bookingId}/messages`)
      setMessages(messagesRes.data.messages || [])

      // 3. Mark messages as read
      await api.post(`/bookings/${bookingId}/messages/read`).catch(() => {})
      
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load booking and chat history", error)
      toast.error("Failed to retrieve service chat details.")
      setIsLoading(false)
    }
  }

  // Subscribe to Reverb/Echo channel for real-time messages
  useEffect(() => {
    if (!bookingId) return

    fetchUser()
    fetchBookingAndMessages()
  }, [bookingId])

  // Setup Echo Listener
  useEffect(() => {
    if (!bookingId || !echoInstance) return

    const channel = echoInstance.private(`chat.booking.${bookingId}`)
      .listen('.message.sent', (event: any) => {
        console.log("Realtime chat message received:", event)
        const incomingMessage: Message = event.message

        // Append message to stream if it doesn't already exist
        setMessages(prev => {
          if (prev.some(m => m.id === incomingMessage.id)) {
            return prev
          }
          return [...prev, incomingMessage]
        })

        // Instantly mark read on active viewing
        api.post(`/bookings/${bookingId}/messages/read`).catch(() => {})
      })

    return () => {
      channel.stopListening('.message.sent')
    }
  }, [bookingId])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !bookingId || isSending) return

    setIsSending(true)
    const textToSend = inputText.trim()
    setInputText("")

    try {
      const response = await api.post(`/bookings/${bookingId}/messages`, {
        body: textToSend,
      })

      const newMsg = response.data.message
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) {
          return prev
        }
        return [...prev, newMsg]
      })
    } catch (error: any) {
      console.error("Failed to transmit message", error)
      toast.error(error.response?.data?.message || "Failed to send message.")
      setInputText(textToSend) // restore message
    } finally {
      setIsSending(false)
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
      case "in-progress":
      case "in_progress":
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
        return "Service Completed"
      case "cancelled":
        return "Service Cancelled"
      case "en-route":
        return "Tech En-Route"
      case "arriving":
        return "Tech Arriving"
      case "on-site":
        return "Tech On-Site"
      case "in-progress":
      case "in_progress":
        return "In-Progress"
      case "pending":
        return "Pending Confirmation"
      case "assigned":
        return "Technician Assigned"
      default:
        return status
    }
  }

  if (!bookingId) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground p-6">
        <div className="text-center space-y-4 max-w-md glass-card p-8 rounded-2xl border border-border">
          <AlertTriangle className="mx-auto h-12 w-12 text-warning animate-bounce" />
          <h2 className="text-xl font-bold">Invalid Chat Session</h2>
          <p className="text-sm text-muted-foreground">
            No booking reference was provided. Please return to your control center to open a valid secure message terminal.
          </p>
          <Link href="/">
            <button className="h-10 px-6 mt-4 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 transition-all text-primary-foreground glow-blue">
              Back to Safety
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Synchronizing secure quantum message tunnel...</p>
        </div>
      </div>
    )
  }

  const partnerName = currentUser?.role === "customer" 
    ? booking?.technician?.name || "Assigning Technician..." 
    : booking?.customer?.name || "Client"

  const partnerRole = currentUser?.role === "customer" 
    ? booking?.technician?.technician_profile?.specialty || "Licensed Specialist" 
    : "Verified Client"

  const backLink = currentUser?.role === "customer" ? "/customer" : "/technician"

  return (
    <div className="min-h-screen max-h-screen bg-background text-foreground overflow-hidden flex relative">
      <Toaster richColors position="top-right" />

      {/* Ambient background glow mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-10 left-1/4 w-[350px] h-[350px] rounded-full bg-accent/5 blur-[100px]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.02]" />
      </div>

      <div className="flex-1 flex flex-col md:flex-row relative z-10">
        
        {/* Left Context Sidebar */}
        <aside className="w-full md:w-[350px] border-r border-border/40 glass bg-card/15 flex flex-col shrink-0 max-h-[40vh] md:max-h-screen">
          {/* Header */}
          <div className="p-4 border-b border-border/40 flex items-center justify-between">
            <Link href={backLink}>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">
                <ChevronLeft className="w-4 h-4" />
                Control Center
              </button>
            </Link>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider">
              Secure Chat
            </span>
          </div>

          {/* Partner profile card */}
          <div className="p-5 border-b border-border/40 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-primary font-bold text-lg glow-blue">
                  {partnerName[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground truncate max-w-[180px]">{partnerName}</h3>
                <p className="text-[10px] text-muted-foreground">{partnerRole}</p>
              </div>
            </div>
            
            {currentUser?.role === 'customer' && booking?.technician && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-warning font-semibold flex items-center gap-0.5 bg-warning/10 border border-warning/20 px-2 py-0.5 rounded">
                  ★ {booking.technician.technician_profile?.rating || "5.0"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({booking.technician.technician_profile?.jobs_completed || "34"} completed tasks)
                </span>
              </div>
            )}
          </div>

          {/* Booking Context Info */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Service Job</span>
              <h4 className="text-base font-extrabold text-foreground">{booking?.service?.name || "ServiceFlow Dispatch"}</h4>
              <span className="font-mono text-xs text-muted-foreground block">#{booking?.id}</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(booking?.status || "")}`}>
                  {getStatusLabel(booking?.status || "")}
                </span>
              </div>

              {booking?.is_emergency && (
                <div className="flex items-center gap-2 rounded-xl bg-destructive/10 border border-destructive/20 p-3">
                  <AlertTriangle className="h-4.5 w-4.5 text-destructive animate-pulse" />
                  <div>
                    <span className="text-[9px] font-bold text-destructive block">EMERGENCY ACTIVE</span>
                    <span className="text-[9px] text-muted-foreground">Instant technician tracking en-route.</span>
                  </div>
                </div>
              )}

              <div className="h-px bg-border/20 my-2" />

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-semibold block">{booking?.scheduled_date || "Instant Booking"}</span>
                    <span>{booking?.time_slot ? `Slot: ${booking.time_slot}` : "ASAP Dispatch"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-semibold block">{booking?.address}</span>
                    <span>{booking?.city}, {booking?.zip_code}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-foreground font-semibold block">${booking?.estimated_cost}</span>
                    <span>Estimated Contract Price</span>
                  </div>
                </div>
              </div>
            </div>

            {booking?.notes && (
              <div className="rounded-xl bg-secondary/35 p-3.5 border border-border/30">
                <span className="text-[9px] font-bold text-foreground/80 uppercase tracking-widest block mb-1">Issue Statement</span>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{booking.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Message Stream */}
        <section className="flex-1 flex flex-col bg-background/5 md:max-h-screen h-[60vh] md:h-screen">
          {/* Active Terminal Header */}
          <div className="px-6 py-3.5 border-b border-border/40 glass bg-card/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Activity className="w-4.5 h-4.5 text-primary animate-pulse" />
              <div>
                <h2 className="text-sm font-bold text-foreground">Secure Communications Stream</h2>
                <p className="text-[10px] text-muted-foreground">End-to-End Encrypted Platform Tunnel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-muted-foreground font-semibold">Active Tunnel Connection</span>
            </div>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence initial={false}>
              {messages.length > 0 ? (
                messages.map((message) => {
                  const isCurrentUserSender = message.sender_id === currentUser?.id
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 15, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex ${isCurrentUserSender ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl p-4 border shadow-md space-y-1 relative group ${
                          isCurrentUserSender
                            ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none glow-blue-sm"
                            : "bg-secondary/40 text-foreground border-border/40 rounded-tl-none"
                        }`}
                      >
                        {/* Sender Label */}
                        <div className="flex items-center gap-2 justify-between">
                          <span className={`text-[9px] font-bold uppercase tracking-wider ${
                            isCurrentUserSender ? "text-primary-foreground/75" : "text-primary"
                          }`}>
                            {isCurrentUserSender ? "You" : message.sender?.name || partnerName}
                          </span>
                          <span className={`text-[8px] shrink-0 ${
                            isCurrentUserSender ? "text-primary-foreground/60" : "text-muted-foreground"
                          }`}>
                            {new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        
                        {/* Body Text */}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap select-text">{message.body}</p>

                        {/* Read status check */}
                        {isCurrentUserSender && (
                          <div className="flex justify-end pt-1">
                            <span className={`text-[8px] font-semibold uppercase tracking-wider ${
                              message.is_read ? "text-emerald-300" : "text-primary-foreground/45"
                            }`}>
                              {message.is_read ? "• Read" : "• Transmitted"}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center border border-dashed border-border">
                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Secure Channel Opened</h3>
                    <p className="text-xs text-muted-foreground max-w-xs mt-0.5">
                      Say hello to {partnerName}! Feel free to discuss details of scheduling, arrival specifics, or parts requests.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Messaging Input Area */}
          <div className="p-4 border-t border-border/40 glass bg-card/5 shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <button
                type="button"
                className="w-10 h-10 rounded-xl hover:bg-secondary/40 text-muted-foreground hover:text-foreground flex items-center justify-center transition-all shrink-0 border border-transparent hover:border-border/30"
                title="Attach Document"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Type a secure message for ${partnerName.split(" ")[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isSending}
                  className="w-full h-11 bg-secondary/35 hover:bg-secondary/45 focus:bg-secondary/55 text-foreground placeholder:text-muted-foreground/60 rounded-xl px-4 text-sm border border-border/30 focus:border-primary/50 focus:outline-none transition-all pr-10"
                />
                
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  title="Insert Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shrink-0 font-semibold ${
                  inputText.trim() && !isSending
                    ? "bg-primary text-primary-foreground hover:bg-primary/95 glow-blue"
                    : "bg-secondary text-muted-foreground/45 border border-border/20 cursor-not-allowed"
                }`}
              >
                {isSending ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Send className="w-4.5 h-4.5" />
                )}
              </button>
            </form>

            <div className="mt-2.5 flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
              <Shield className="w-3 h-3 text-primary shrink-0" />
              <span>ServiceFlow verified communications. Content stored securely in contract logs.</span>
            </div>
          </div>

        </section>

      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Initializing secure chat portal...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  )
}

