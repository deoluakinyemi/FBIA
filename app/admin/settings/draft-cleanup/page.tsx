"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Trash2 } from "lucide-react"

export default function DraftCleanupPage() {
  const [days, setDays] = useState(30)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{ count: number; timestamp: string } | null>(null)
  const { toast } = useToast()

  const handleCleanup = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      // Get the CRON_SECRET from environment or prompt admin to enter it
      const secret = prompt("Enter the CRON secret to authorize this operation:")
      if (!secret) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`/api/cron/cleanup-drafts?secret=${encodeURIComponent(secret)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to clean up draft assessments")
      }

      setResults({
        count: data.deletedDrafts.length,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Cleanup Successful",
        description: `Deleted ${data.deletedDrafts.length} expired draft assessments.`,
        variant: "default",
      })
    } catch (error) {
      console.error("Error during cleanup:", error)
      toast({
        title: "Cleanup Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Draft Assessment Cleanup</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Automatic Cleanup Settings</CardTitle>
          <CardDescription>
            Configure how long draft assessments should be kept before automatic deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="expiration-days">Expiration Period (Days)</Label>
              <Input
                id="expiration-days"
                type="number"
                min={1}
                max={365}
                value={days}
                onChange={(e) => setDays(Number.parseInt(e.target.value) || 30)}
              />
              <p className="text-sm text-gray-500">
                Draft assessments older than this many days will be automatically deleted.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCleanup} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cleaning up...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Run Cleanup Now
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Last Cleanup Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Deleted drafts:</strong> {results.count}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date(results.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">Setting Up Automatic Cleanup</h3>
        <p className="text-amber-700 mb-4">
          To enable automatic cleanup, you need to set up a scheduled job to call the cleanup API endpoint.
        </p>
        <div className="bg-amber-100 p-3 rounded-md">
          <p className="font-mono text-sm break-all">
            {`curl -X GET "${process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/api/cron/cleanup-drafts?secret=YOUR_CRON_SECRET"`}
          </p>
        </div>
        <ul className="mt-4 space-y-2 text-sm text-amber-700">
          <li>• Set up a cron job to run daily or weekly</li>
          <li>• Add a CRON_SECRET environment variable to your deployment</li>
          <li>• Use the same secret in your cron job configuration</li>
          <li>• With Vercel, use Vercel Cron Jobs in your project settings</li>
        </ul>
      </div>
    </div>
  )
}
