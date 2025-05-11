"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface AppSettings {
  site_name: string
  contact_email: string
  support_phone: string
  enable_email_notifications: boolean
  default_assessment_language: string
  privacy_policy: string
  terms_of_service: string
  maintenance_mode: boolean
  maintenance_message: string
}

interface EmailSettings {
  smtp_host: string
  smtp_port: string
  smtp_user: string
  smtp_password: string
  from_email: string
  from_name: string
  email_footer: string
  enable_welcome_email: boolean
  enable_results_email: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [appSettings, setAppSettings] = useState<AppSettings>({
    site_name: "NairaWise Financial Assessment",
    contact_email: "contact@nairawise.com",
    support_phone: "+234 800 123 4567",
    enable_email_notifications: true,
    default_assessment_language: "en",
    privacy_policy: "Default privacy policy text...",
    terms_of_service: "Default terms of service text...",
    maintenance_mode: false,
    maintenance_message: "We're currently performing maintenance. Please check back later.",
  })

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: "smtp.example.com",
    smtp_port: "587",
    smtp_user: "user@example.com",
    smtp_password: "password",
    from_email: "no-reply@nairawise.com",
    from_name: "NairaWise Assessment",
    email_footer: "© 2025 NairaWise. All rights reserved.",
    enable_welcome_email: true,
    enable_results_email: true,
  })

  useEffect(() => {
    async function fetchSettings() {
      try {
        const appResponse = await fetch("/api/admin/settings/app")
        const emailResponse = await fetch("/api/admin/settings/email")

        if (appResponse.ok) {
          const appData = await appResponse.json()
          setAppSettings(appData)
        }

        if (emailResponse.ok) {
          const emailData = await emailResponse.json()
          setEmailSettings(emailData)
        }
      } catch (error) {
        console.error("Error fetching settings:", error)
        toast({
          title: "Error",
          description: "Failed to load settings. Using defaults.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  async function saveAppSettings() {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings/app", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save app settings")
      }

      toast({
        title: "Success",
        description: "Application settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving app settings:", error)
      toast({
        title: "Error",
        description: "Failed to save application settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  async function saveEmailSettings() {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailSettings),
      })

      if (!response.ok) {
        throw new Error("Failed to save email settings")
      }

      toast({
        title: "Success",
        description: "Email settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving email settings:", error)
      toast({
        title: "Error",
        description: "Failed to save email settings",
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
        <p className="mt-2">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Tabs defaultValue="application">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="application">Application Settings</TabsTrigger>
          <TabsTrigger value="email">Email Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="application" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={appSettings.site_name}
                  onChange={(e) => setAppSettings({ ...appSettings, site_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={appSettings.contact_email}
                  onChange={(e) => setAppSettings({ ...appSettings, contact_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support_phone">Support Phone</Label>
                <Input
                  id="support_phone"
                  value={appSettings.support_phone}
                  onChange={(e) => setAppSettings({ ...appSettings, support_phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default_language">Default Assessment Language</Label>
                <Select
                  value={appSettings.default_assessment_language}
                  onValueChange={(value) => setAppSettings({ ...appSettings, default_assessment_language: value })}
                >
                  <SelectTrigger id="default_language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_notifications"
                  checked={appSettings.enable_email_notifications}
                  onCheckedChange={(checked) => setAppSettings({ ...appSettings, enable_email_notifications: checked })}
                />
                <Label htmlFor="enable_notifications">Enable Email Notifications</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>Manage privacy policy and terms of service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="privacy_policy">Privacy Policy</Label>
                <Textarea
                  id="privacy_policy"
                  rows={6}
                  value={appSettings.privacy_policy}
                  onChange={(e) => setAppSettings({ ...appSettings, privacy_policy: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms_of_service">Terms of Service</Label>
                <Textarea
                  id="terms_of_service"
                  rows={6}
                  value={appSettings.terms_of_service}
                  onChange={(e) => setAppSettings({ ...appSettings, terms_of_service: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
              <CardDescription>Configure maintenance mode settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance_mode"
                  checked={appSettings.maintenance_mode}
                  onCheckedChange={(checked) => setAppSettings({ ...appSettings, maintenance_mode: checked })}
                />
                <Label htmlFor="maintenance_mode">Enable Maintenance Mode</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maintenance_message">Maintenance Message</Label>
                <Textarea
                  id="maintenance_message"
                  value={appSettings.maintenance_message}
                  onChange={(e) => setAppSettings({ ...appSettings, maintenance_message: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveAppSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="email" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Configuration</CardTitle>
              <CardDescription>Configure email sending settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host">SMTP Host</Label>
                <Input
                  id="smtp_host"
                  value={emailSettings.smtp_host}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtp_host: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port">SMTP Port</Label>
                <Input
                  id="smtp_port"
                  value={emailSettings.smtp_port}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtp_port: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_user">SMTP Username</Label>
                <Input
                  id="smtp_user"
                  value={emailSettings.smtp_user}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtp_user: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_password">SMTP Password</Label>
                <Input
                  id="smtp_password"
                  type="password"
                  value={emailSettings.smtp_password}
                  onChange={(e) => setEmailSettings({ ...emailSettings, smtp_password: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>Configure email content settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from_email">From Email</Label>
                <Input
                  id="from_email"
                  type="email"
                  value={emailSettings.from_email}
                  onChange={(e) => setEmailSettings({ ...emailSettings, from_email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from_name">From Name</Label>
                <Input
                  id="from_name"
                  value={emailSettings.from_name}
                  onChange={(e) => setEmailSettings({ ...emailSettings, from_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email_footer">Email Footer</Label>
                <Textarea
                  id="email_footer"
                  value={emailSettings.email_footer}
                  onChange={(e) => setEmailSettings({ ...emailSettings, email_footer: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_welcome_email"
                  checked={emailSettings.enable_welcome_email}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enable_welcome_email: checked })}
                />
                <Label htmlFor="enable_welcome_email">Send Welcome Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_results_email"
                  checked={emailSettings.enable_results_email}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enable_results_email: checked })}
                />
                <Label htmlFor="enable_results_email">Send Results Email</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveEmailSettings} disabled={saving}>
              {saving ? "Saving..." : "Save Email Settings"}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
