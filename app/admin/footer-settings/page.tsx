"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Trash2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function FooterSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState({
    address: "",
    phone: "",
    email: "",
    facebook_url: "",
    twitter_url: "",
    instagram_url: "",
    linkedin_url: "",
    copyright_text: "",
    newsletter_enabled: true,
    newsletter_text: "",
  })

  const [quickLinks, setQuickLinks] = useState<
    Array<{
      id: string
      title: string
      url: string
      display_order: number
    }>
  >([])

  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
  })

  // Mock loading of data
  useEffect(() => {
    // In a real implementation, this would fetch from the API
    setTimeout(() => {
      setSettings({
        address: "123 Financial District, Lagos, Nigeria",
        phone: "+234 123 456 7890",
        email: "info@nairawise.com",
        facebook_url: "https://facebook.com",
        twitter_url: "https://twitter.com",
        instagram_url: "https://instagram.com",
        linkedin_url: "https://linkedin.com",
        copyright_text: "NairaWise. All rights reserved.",
        newsletter_enabled: true,
        newsletter_text: "Subscribe to our newsletter for financial tips and updates.",
      })

      setQuickLinks([
        { id: "1", title: "Home", url: "/", display_order: 1 },
        { id: "2", title: "Assessment", url: "/assessment/start", display_order: 2 },
        { id: "3", title: "Dashboard", url: "/dashboard", display_order: 3 },
        { id: "4", title: "Resources", url: "/resources", display_order: 4 },
        { id: "5", title: "About Us", url: "/about", display_order: 5 },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggleChange = (checked: boolean) => {
    setSettings((prev) => ({ ...prev, newsletter_enabled: checked }))
  }

  const handleQuickLinkChange = (id: string, field: string, value: string) => {
    setQuickLinks((prev) => prev.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  const handleNewLinkChange = (field: string, value: string) => {
    setNewLink((prev) => ({ ...prev, [field]: value }))
  }

  const addQuickLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL fields",
        variant: "destructive",
      })
      return
    }

    const newId = Date.now().toString()
    const maxOrder = Math.max(...quickLinks.map((link) => link.display_order), 0)

    setQuickLinks((prev) => [
      ...prev,
      {
        id: newId,
        title: newLink.title,
        url: newLink.url,
        display_order: maxOrder + 1,
      },
    ])

    setNewLink({ title: "", url: "" })

    toast({
      title: "Success",
      description: "Quick link added successfully",
    })
  }

  const removeQuickLink = (id: string) => {
    setQuickLinks((prev) => prev.filter((link) => link.id !== id))

    toast({
      title: "Success",
      description: "Quick link removed successfully",
    })
  }

  const saveSettings = () => {
    // In a real implementation, this would save to the API
    toast({
      title: "Success",
      description: "Footer settings saved successfully",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nairawise-dark"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Footer Settings</h1>

      <Tabs defaultValue="contact">
        <TabsList className="mb-6">
          <TabsTrigger value="contact">Contact Information</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
          <TabsTrigger value="links">Quick Links</TabsTrigger>
        </TabsList>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update the contact information displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={settings.address}
                  onChange={handleSettingsChange}
                  placeholder="Enter your business address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={settings.phone}
                  onChange={handleSettingsChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={settings.email}
                  onChange={handleSettingsChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright_text">Copyright Text</Label>
                <Input
                  id="copyright_text"
                  name="copyright_text"
                  value={settings.copyright_text}
                  onChange={handleSettingsChange}
                  placeholder="Enter copyright text"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Update your social media profile links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  value={settings.facebook_url}
                  onChange={handleSettingsChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter</Label>
                <Input
                  id="twitter_url"
                  name="twitter_url"
                  value={settings.twitter_url}
                  onChange={handleSettingsChange}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={settings.instagram_url}
                  onChange={handleSettingsChange}
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  name="linkedin_url"
                  value={settings.linkedin_url}
                  onChange={handleSettingsChange}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Settings</CardTitle>
              <CardDescription>Configure the newsletter subscription section in the footer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="newsletter_enabled"
                  checked={settings.newsletter_enabled}
                  onCheckedChange={handleToggleChange}
                />
                <Label htmlFor="newsletter_enabled">Enable Newsletter Subscription</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newsletter_text">Newsletter Text</Label>
                <Textarea
                  id="newsletter_text"
                  name="newsletter_text"
                  value={settings.newsletter_text}
                  onChange={handleSettingsChange}
                  placeholder="Enter text to display above the newsletter subscription form"
                  disabled={!settings.newsletter_enabled}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Manage the quick links displayed in the footer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickLinks.map((link) => (
                  <div key={link.id} className="flex items-center space-x-2">
                    <Input
                      value={link.title}
                      onChange={(e) => handleQuickLinkChange(link.id, "title", e.target.value)}
                      placeholder="Link Title"
                      className="flex-1"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => handleQuickLinkChange(link.id, "url", e.target.value)}
                      placeholder="Link URL"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuickLink(link.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Input
                    value={newLink.title}
                    onChange={(e) => handleNewLinkChange("title", e.target.value)}
                    placeholder="New Link Title"
                    className="flex-1"
                  />
                  <Input
                    value={newLink.url}
                    onChange={(e) => handleNewLinkChange("url", e.target.value)}
                    placeholder="New Link URL"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={addQuickLink}
                    className="text-nairawise-dark border-nairawise-dark hover:bg-nairawise-dark hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={saveSettings} className="bg-nairawise-dark hover:bg-nairawise-dark/90 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
