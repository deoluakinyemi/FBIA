"use client"

import { useState, useEffect } from "react"
import { Calendar, Mail, RefreshCw, Send, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ReminderSettings {
  daysSinceLastUpdate: number
  maxReminders: number
  batchSize: number
  enabled: boolean
  sendTime: string
}

interface ReminderStatistics {
  totalDrafts: number
  draftsWithReminders: number
  completedAfterReminder: number
  conversionRate: number
}

interface IncompleteAssessment {
  id: string
  userId: string
  userName: string
  userEmail: string
  lastUpdated: string
  daysAgo: number
  remindersSent: number
}

export default function RemindersPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [settings, setSettings] = useState<ReminderSettings>({
    daysSinceLastUpdate: 3,
    maxReminders: 3,
    batchSize: 50,
    enabled: true,
    sendTime: "03:00",
  })
  const [statistics, setStatistics] = useState<ReminderStatistics | null>(null)
  const [incompleteAssessments, setIncompleteAssessments] = useState<IncompleteAssessment[]>([])

  // Fetch reminder settings and statistics
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch settings
        const settingsResponse = await fetch("/api/admin/settings/reminders")
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }

        // Fetch statistics
        await refreshStatistics()

        // Fetch incomplete assessments
        await refreshIncompleteAssessments()
      } catch (error) {
        console.error("Error fetching reminder data:", error)
        toast({
          title: "Error",
          description: "Failed to load reminder data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Refresh statistics
  async function refreshStatistics() {
    try {
      setRefreshing(true)
      const statsResponse = await fetch("/api/admin/reminders/statistics")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStatistics(statsData)
      }
    } catch (error) {
      console.error("Error fetching reminder statistics:", error)
      toast({
        title: "Error",
        description: "Failed to load reminder statistics",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Refresh incomplete assessments list
  async function refreshIncompleteAssessments() {
    try {
      setRefreshing(true)
      const assessmentsResponse = await fetch("/api/admin/reminders/incomplete")
      if (assessmentsResponse.ok) {
        const assessmentsData = await assessmentsResponse.json()
        setIncompleteAssessments(assessmentsData)
      }
    } catch (error) {
      console.error("Error fetching incomplete assessments:", error)
      toast({
        title: "Error",
        description: "Failed to load incomplete assessments",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  // Save reminder settings
  async function saveSettings() {
    try {
      setSaving(true)
      const response = await fetch("/api/admin/settings/reminders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save reminder settings")
      }

      toast({
        title: "Success",
        description: "Reminder settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving reminder settings:", error)
      toast({
        title: "Error",
        description: "Failed to save reminder settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Send reminders manually
  async function sendReminders() {
    try {
      setSending(true)
      const response = await fetch(
        `/api/admin/reminders/send?days=${settings.daysSinceLastUpdate}&maxReminders=${settings.maxReminders}&batchSize=${settings.batchSize}`,
      )

      if (!response.ok) {
        throw new Error("Failed to send reminders")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: `Sent ${data.successCount} reminder emails successfully`,
      })

      // Refresh data after sending
      await refreshStatistics()
      await refreshIncompleteAssessments()
    } catch (error) {
      console.error("Error sending reminders:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder emails",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading reminder data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Assessment Reminders</h1>
        <Button onClick={refreshStatistics} variant="outline" size="sm" disabled={refreshing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete Assessments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Draft Assessments</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.totalDrafts || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reminders Sent</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.draftsWithReminders || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed After Reminder</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics?.completedAfterReminder || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statistics ? `${(statistics.conversionRate * 100).toFixed(1)}%` : "0%"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send Reminders</CardTitle>
              <CardDescription>Manually send reminder emails to users with incomplete assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This will send reminder emails to users who started an assessment but haven't completed it. Only users
                who haven't updated their assessment in the last {settings.daysSinceLastUpdate} days and have received
                fewer than {settings.maxReminders} reminders will be notified.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="days">Days Since Last Update</Label>
                  <Select
                    value={settings.daysSinceLastUpdate.toString()}
                    onValueChange={(value) =>
                      setSettings({ ...settings, daysSinceLastUpdate: Number.parseInt(value, 10) })
                    }
                  >
                    <SelectTrigger id="days">
                      <SelectValue placeholder="Select days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="maxReminders">Max Reminders Per User</Label>
                  <Select
                    value={settings.maxReminders.toString()}
                    onValueChange={(value) => setSettings({ ...settings, maxReminders: Number.parseInt(value, 10) })}
                  >
                    <SelectTrigger id="maxReminders">
                      <SelectValue placeholder="Select max reminders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 reminder</SelectItem>
                      <SelectItem value="2">2 reminders</SelectItem>
                      <SelectItem value="3">3 reminders</SelectItem>
                      <SelectItem value="5">5 reminders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Select
                    value={settings.batchSize.toString()}
                    onValueChange={(value) => setSettings({ ...settings, batchSize: Number.parseInt(value, 10) })}
                  >
                    <SelectTrigger id="batchSize">
                      <SelectValue placeholder="Select batch size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 emails</SelectItem>
                      <SelectItem value="25">25 emails</SelectItem>
                      <SelectItem value="50">50 emails</SelectItem>
                      <SelectItem value="100">100 emails</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={sendReminders} disabled={sending}>
                {sending ? "Sending..." : "Send Reminders"}
                {!sending && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Settings</CardTitle>
              <CardDescription>Configure automated reminder emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={settings.enabled}
                  onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="enabled">Enable Automated Reminders</Label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="daysSinceLastUpdate">Days Since Last Update</Label>
                  <Input
                    id="daysSinceLastUpdate"
                    type="number"
                    min="1"
                    max="30"
                    value={settings.daysSinceLastUpdate}
                    onChange={(e) =>
                      setSettings({ ...settings, daysSinceLastUpdate: Number.parseInt(e.target.value, 10) })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of days to wait after the last update before sending a reminder
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxReminders">Maximum Reminders</Label>
                  <Input
                    id="maxReminders"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.maxReminders}
                    onChange={(e) => setSettings({ ...settings, maxReminders: Number.parseInt(e.target.value, 10) })}
                  />
                  <p className="text-xs text-muted-foreground">Maximum number of reminder emails to send to a user</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchSize">Batch Size</Label>
                  <Input
                    id="batchSize"
                    type="number"
                    min="10"
                    max="500"
                    value={settings.batchSize}
                    onChange={(e) => setSettings({ ...settings, batchSize: Number.parseInt(e.target.value, 10) })}
                  />
                  <p className="text-xs text-muted-foreground">Number of emails to send in each batch</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sendTime">Send Time (UTC)</Label>
                  <Input
                    id="sendTime"
                    type="time"
                    value={settings.sendTime}
                    onChange={(e) => setSettings({ ...settings, sendTime: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Time of day to send reminder emails (in UTC)</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
                {!saving && <Settings className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reminder Schedule</CardTitle>
              <CardDescription>Configure when reminder emails are sent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Reminder emails are sent automatically according to the schedule below. You can also send reminders
                manually from the Overview tab.
              </p>

              <div className="rounded-md border p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="font-medium">Daily at {settings.sendTime} UTC</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reminders will be sent to users who haven't updated their assessment in the last{" "}
                  {settings.daysSinceLastUpdate} days and have received fewer than {settings.maxReminders} reminders.
                </p>
              </div>

              <div className="mt-4 text-sm">
                <p className="font-medium">To set up the scheduled job:</p>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Create a cron job that runs daily at {settings.sendTime} UTC</li>
                  <li>The cron job should call the following URL:</li>
                  <code className="block bg-muted p-2 rounded-md mt-1 text-xs overflow-x-auto">
                    {`${process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"}/api/cron/send-reminders?secret=YOUR_CRON_SECRET&days=${settings.daysSinceLastUpdate}&maxReminders=${settings.maxReminders}&batchSize=${settings.batchSize}`}
                  </code>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incomplete" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Incomplete Assessments</CardTitle>
              <CardDescription>Users who started but haven't completed their assessment</CardDescription>
            </CardHeader>
            <CardContent>
              {incompleteAssessments.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No incomplete assessments found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Days Ago</TableHead>
                      <TableHead>Reminders Sent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incompleteAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">{assessment.userName}</TableCell>
                        <TableCell>{assessment.userEmail}</TableCell>
                        <TableCell>{new Date(assessment.lastUpdated).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              assessment.daysAgo > 7 ? "destructive" : assessment.daysAgo > 3 ? "secondary" : "outline"
                            }
                          >
                            {assessment.daysAgo} {assessment.daysAgo === 1 ? "day" : "days"}
                          </Badge>
                        </TableCell>
                        <TableCell>{assessment.remindersSent}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
