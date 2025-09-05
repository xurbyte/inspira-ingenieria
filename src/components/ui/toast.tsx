"use client"

import * as React from "react"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertTitle, AlertDescription } from "./alert"

export type ToastType = "success" | "error" | "info"

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const toastVariants = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
}

export function Toast({ id, type, title, description, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLeaving, setIsLeaving] = React.useState(false)

  React.useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = React.useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }, [id, onClose])

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const Icon = toastIcons[type]

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 max-w-sm transition-all duration-300 ease-in-out",
        isVisible && !isLeaving 
          ? "translate-x-0 opacity-100" 
          : "translate-x-full opacity-0"
      )}
    >
      <Alert className={cn("shadow-lg border", toastVariants[type])}>
        <Icon className="h-4 w-4" />
        <div className="flex-1">
          <AlertTitle className="flex items-center justify-between">
            {title}
            <button
              onClick={handleClose}
              className="ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </AlertTitle>
          {description && (
            <AlertDescription className="mt-1">
              {description}
            </AlertDescription>
          )}
        </div>
      </Alert>
    </div>
  )
}

export interface ToastContextType {
  showToast: (type: ToastType, title: string, description?: string, duration?: number) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const showToast = React.useCallback((
    type: ToastType, 
    title: string, 
    description?: string, 
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: ToastProps = {
      id,
      type,
      title,
      description,
      duration,
      onClose: (toastId) => {
        setToasts(prev => prev.filter(toast => toast.id !== toastId))
      }
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{
              transform: `translateY(${index * 80}px)`,
              zIndex: 50 - index
            }}
          >
            <Toast {...toast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
