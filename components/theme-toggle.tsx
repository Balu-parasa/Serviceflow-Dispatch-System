"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/50 animate-pulse" />
    )
  }

  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 },
  }

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.15 }
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl 
                   bg-secondary/50 hover:bg-secondary border border-border/50
                   transition-colors duration-200 overflow-hidden
                   focus:outline-none focus:ring-2 focus:ring-primary/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {/* Animated glow background */}
        <motion.div
          className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: resolvedTheme === 'dark' 
              ? 'radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, transparent 70%)'
          }}
        />
        
        <AnimatePresence mode="wait" initial={false}>
          {resolvedTheme === "dark" ? (
            <motion.div
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Moon className="w-5 h-5 text-blue-400" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Sun className="w-5 h-5 text-amber-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 z-50 w-40 
                         rounded-xl border border-border/50 
                         bg-card/95 backdrop-blur-xl shadow-xl
                         overflow-hidden"
            >
              <div className="p-1">
                <ThemeOption
                  icon={<Sun className="w-4 h-4" />}
                  label="Light"
                  active={theme === "light"}
                  onClick={() => {
                    setTheme("light")
                    setIsOpen(false)
                  }}
                />
                <ThemeOption
                  icon={<Moon className="w-4 h-4" />}
                  label="Dark"
                  active={theme === "dark"}
                  onClick={() => {
                    setTheme("dark")
                    setIsOpen(false)
                  }}
                />
                <ThemeOption
                  icon={<Monitor className="w-4 h-4" />}
                  label="System"
                  active={theme === "system"}
                  onClick={() => {
                    setTheme("system")
                    setIsOpen(false)
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function ThemeOption({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm
                  transition-colors duration-150
                  ${active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className={active ? "text-primary" : ""}>{icon}</span>
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div
          layoutId="activeTheme"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

// Compact toggle for navbars
export function ThemeToggleCompact() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8 rounded-lg bg-secondary/50 animate-pulse" />
  }

  const toggle = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={toggle}
      className="relative flex items-center justify-center w-8 h-8 rounded-lg 
                 bg-secondary/50 hover:bg-secondary border border-border/30
                 transition-colors duration-200 overflow-hidden
                 focus:outline-none focus:ring-2 focus:ring-primary/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === "dark" ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-4 h-4 text-blue-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-4 h-4 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
