"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, FileText, Layout, LogOut, PieChart, Settings, Users, FileQuestion, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const adminAuthenticated = localStorage.getItem("adminAuthenticated") === "true"
    setIsAuthenticated(adminAuthenticated)
    setIsLoading(false)

    // Redirect to login if not authenticated and not already on login page
    if (!adminAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    router.push("/admin/login")
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-64 bg-white border-r border-nairawise-medium/20 h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nairawise-dark"></div>
      </div>
    )
  }

  // If not authenticated, show nothing
  if (!isAuthenticated && pathname === "/admin/login") {
    return null
  }

  // If authenticated, show sidebar
  return (
    <div className="w-64 bg-white border-r border-nairawise-medium/20 h-screen flex flex-col">
      <div className="p-4 border-b border-nairawise-medium/20 bg-nairawise-dark text-white">
        <div className="flex justify-center mb-2">
          <Image src="/images/nairawise-logo.png" alt="NairaWise" width={120} height={48} className="h-10 w-auto" />
        </div>
        <p className="text-sm text-white/80 text-center">Admin Dashboard</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavItem
          href="/admin/dashboard"
          icon={<BarChart3 className="h-4 w-4" />}
          active={pathname === "/admin/dashboard"}
        >
          Dashboard
        </NavItem>
        <NavItem
          href="/admin/analytics"
          icon={<PieChart className="h-4 w-4" />}
          active={pathname === "/admin/analytics"}
        >
          Analytics
        </NavItem>
        <NavItem
          href="/admin/questions"
          icon={<FileQuestion className="h-4 w-4" />}
          active={pathname.startsWith("/admin/questions")}
        >
          Questions
        </NavItem>
        <NavItem href="/admin/users" icon={<Users className="h-4 w-4" />} active={pathname.startsWith("/admin/users")}>
          Users
        </NavItem>
        <NavItem
          href="/admin/reports"
          icon={<FileText className="h-4 w-4" />}
          active={pathname.startsWith("/admin/reports")}
        >
          Reports
        </NavItem>
        <NavItem
          href="/admin/footer-settings"
          icon={<Layout className="h-4 w-4" />}
          active={pathname === "/admin/footer-settings"}
        >
          Footer Settings
        </NavItem>
        <NavItem href="/admin/settings" icon={<Settings className="h-4 w-4" />} active={pathname === "/admin/settings"}>
          Settings
        </NavItem>
        <NavItem href="/" icon={<Globe className="h-4 w-4" />} active={false}>
          View Site
        </NavItem>
      </nav>

      <div className="p-4 border-t border-nairawise-medium/20 mt-auto">
        <Button
          variant="outline"
          className="w-full justify-start border-nairawise-dark text-nairawise-dark hover:bg-nairawise-dark hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  active: boolean
  children: React.ReactNode
}

function NavItem({ href, icon, active, children }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm rounded-md ${
        active ? "bg-nairawise-dark text-white" : "text-nairawise-dark hover:bg-nairawise-cream"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Link>
  )
}
