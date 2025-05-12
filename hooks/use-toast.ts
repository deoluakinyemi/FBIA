"use client"

import { useState, useEffect } from "react"

type ToastVariant = "default" | "destructive"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
}

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
}

// Create a standalone toast function for direct import
let toastContainer: HTMLElement | null = null
let activeToasts: Toast[] = []

// Standalone toast function that can be imported directly
export const toast = ({ title, description, variant = "default" }: ToastOptions) => {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast = { id, title, description, variant }

  activeToasts = [...activeToasts, newToast]
  renderToasts()

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    activeToasts = activeToasts.filter((toast) => toast.id !== id)
    renderToasts()
  }, 5000)
}

function renderToasts() {
  if (!document) return

  if (!toastContainer) {
    toastContainer = document.getElementById("toast-container")
    if (!toastContainer) {
      toastContainer = document.createElement("div")
      toastContainer.id = "toast-container"
      toastContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      document.body.appendChild(toastContainer)
    }
  }

  if (toastContainer) {
    toastContainer.innerHTML = ""
    activeToasts.forEach((toast) => {
      const toastElement = document.createElement("div")
      toastElement.className = `p-4 rounded-md shadow-md ${
        toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
      } animate-in slide-in-from-right-full`

      const titleElement = document.createElement("div")
      titleElement.className = "font-medium"
      titleElement.textContent = toast.title
      toastElement.appendChild(titleElement)

      if (toast.description) {
        const descriptionElement = document.createElement("div")
        descriptionElement.className = "text-sm mt-1"
        descriptionElement.textContent = toast.description
        toastElement.appendChild(descriptionElement)
      }

      toastContainer.appendChild(toastElement)
    })

    if (activeToasts.length === 0 && toastContainer.parentNode) {
      document.body.removeChild(toastContainer)
      toastContainer = null
    }
  }
}

// Hook version for component use
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = ({ title, description, variant = "default" }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant }
    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)
  }

  // Render toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const toastContainer = document.getElementById("toast-container")
      if (!toastContainer) {
        const container = document.createElement("div")
        container.id = "toast-container"
        container.className = "fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
        document.body.appendChild(container)
      }
    }

    return () => {
      const toastContainer = document.getElementById("toast-container")
      if (toastContainer && toasts.length === 0) {
        document.body.removeChild(toastContainer)
      }
    }
  }, [toasts])

  // Render each toast
  useEffect(() => {
    const toastContainer = document.getElementById("toast-container")
    if (toastContainer) {
      toastContainer.innerHTML = ""
      toasts.forEach((toast) => {
        const toastElement = document.createElement("div")
        toastElement.className = `p-4 rounded-md shadow-md ${
          toast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
        } animate-in slide-in-from-right-full`

        const titleElement = document.createElement("div")
        titleElement.className = "font-medium"
        titleElement.textContent = toast.title
        toastElement.appendChild(titleElement)

        if (toast.description) {
          const descriptionElement = document.createElement("div")
          descriptionElement.className = "text-sm mt-1"
          descriptionElement.textContent = toast.description
          toastElement.appendChild(descriptionElement)
        }

        toastContainer.appendChild(toastElement)
      })
    }
  }, [toasts])

  return { toast: showToast }
}
