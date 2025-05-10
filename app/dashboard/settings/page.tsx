"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserDashboardSettings, updateUserDashboardSettings } from "@/lib/supabase/progress-service"
import { useToast } from "@/hooks/use-toast"

export default function DashboardSettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    show_progress_chart: true,
    show_recommendations: true,
    default_view: "overview",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadSettings() {
      try {
        // Get user ID from localStorage
        const currentUserId = localStorage.getItem("currentUserId")

        if (!currentUserId) {
          // Redirect to login if no user info
          router.push("/assessment/start")
          return
        }

        setUserId(currentUserId)

        // Load user dashboard settings
        const userSettings = await getUserDashboardSettings(currentUserId)
        setSettings({
          show_progress_chart: userSettings.show_progress_chart,
          show_recommendations: userSettings.show_recommendations,
          default_view: userSettings.default_view,
        })
      } catch (error) {
        console.error("Error loading settings:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [router, toast])

  const handleSaveSettings = async () => {
    if (!userId) return

    setSaving(true)
    try {
      await updateUserDashboardSettings(userId, settings)

      toast({
        title: "Settings Saved",
        description: "Your dashboard settings have been updated successfully.",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="container py-12 text-center">Loading settings...</div>
  }

  return (
    <div className="container max-w-2xl py-12">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Settings</CardTitle>
          <CardDescription>Customize your financial dashboard experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-progress-chart" className="text-base">
                  Show Progress Chart
                </Label>
                <p className="text-sm text-muted-foreground">Display your progress over time on the dashboard</p>
              </div>
              <Switch
                id="show-progress-chart"
                checked={settings.show_progress_chart}
                onCheckedChange={(checked) => setSettings({ ...settings, show_progress_chart: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-recommendations" className="text-base">
                  Show Recommendations
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display personalized recommendations based on your assessment results
                </p>
              </div>
              <Switch
                id="show-recommendations"
                checked={settings.show_recommendations}
                onCheckedChange={(checked) => setSettings({ ...settings, show_recommendations: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-view" className="text-base">
                Default Dashboard View
              </Label>
              <Select
                value={settings.default_view}
                onValueChange={(value) => setSettings({ ...settings, default_view: value })}
              >
                <SelectTrigger id="default-view">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Choose which tab to show by default when you open your dashboard
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Settings"}
            {!saving && <Save className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
