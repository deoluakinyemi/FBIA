"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, PieChartIcon as ChartPieIcon, FileQuestion, Home, LogOut, Settings, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If not authenticated and on login page, just show the login page
  if (!isAuthenticated && pathname === "/admin/login") {
    return <>{children}</>
  }

  // If authenticated, show admin layout with sidebar
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Financial Assessment</h2>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              <NavItem
                href="/admin/dashboard"
                icon={<BarChart3 className="h-4 w-4" />}
                active={pathname === "/admin/dashboard"}
              >
                Dashboard
              </NavItem>
              <NavItem
                href="/admin/analytics"
                icon={<ChartPieIcon className="h-4 w-4" />}
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
              <NavItem
                href="/admin/users"
                icon={<Users className="h-4 w-4" />}
                active={pathname.startsWith("/admin/users")}
              >
                Users
              </NavItem>
              <NavItem
                href="/admin/settings"
                icon={<Settings className="h-4 w-4" />}
                active={pathname.startsWith("/admin/settings")}
              >
                Settings
              </NavItem>
              <NavItem href="/" icon={<Home className="h-4 w-4" />} active={false}>
                View Site
              </NavItem>
            </nav>
            <div className="p-4 border-t mt-auto">
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b p-4">
            <h1 className="text-xl font-bold">
              {pathname === "/admin/dashboard" && "Dashboard"}
              {pathname === "/admin/questions" && "Manage Questions"}
              {pathname.startsWith("/admin/questions/") && "Edit Question"}
              {pathname === "/admin/users" && "Manage Users"}
              {pathname === "/admin/settings" && "Settings"}
            </h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    )
  }

  // Fallback - should not reach here
  return null
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
        active ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
      }`}
    >
      <span className="mr-2">{icon}</span>
      {children}
    </Link>
  )
}
