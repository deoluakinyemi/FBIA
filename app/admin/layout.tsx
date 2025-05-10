import type React from "react"
import { Header } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // The authentication check is handled by the Sidebar component
  // which redirects to login if not authenticated
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
