"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  marketing_consent: boolean | null
  created_at: string
}

export default function UserEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch user")
        }
        const data = await response.json()
        setUser(data)
      } catch (err) {
        console.error("Error fetching user:", err)
        setError("Failed to load user. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [params.id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      })
      router.push("/admin/users")
    } catch (err) {
      console.error("Error updating user:", err)
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading user...</p>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || "User not found"}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/users">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit User</CardTitle>
          <CardDescription>Update user information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="marketing"
                checked={user.marketing_consent || false}
                onCheckedChange={(checked) => setUser({ ...user, marketing_consent: checked })}
              />
              <Label htmlFor="marketing">Marketing Consent</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/admin/users")}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
