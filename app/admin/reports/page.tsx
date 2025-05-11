"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, Download, Mail, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string | null
  email: string | null
}

interface Assessment {
  id: string
  user_id: string
  overall_score: number
  completed_at: string
  created_at: string
  users: User
}

export default function ReportsPage() {
  const { toast } = useToast()
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sendingEmail, setSendingEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchAssessments()
  }, [])

  async function fetchAssessments() {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/assessments")
      if (!response.ok) {
        throw new Error("Failed to fetch assessments")
      }
      const data = await response.json()
      setAssessments(data)
    } catch (err) {
      console.error("Error fetching assessments:", err)
      setError("Failed to load assessments. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  async function sendEmail(assessmentId: string) {
    setSendingEmail(assessmentId)
    try {
      const response = await fetch(`/api/admin/assessments/${assessmentId}/send-email`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast({
        title: "Success",
        description: "Assessment results email sent successfully",
      })
    } catch (err) {
      console.error("Error sending email:", err)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(null)
    }
  }

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.users?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.overall_score.toString().includes(searchTerm),
  )

  function getScoreColor(score: number) {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-blue-100 text-blue-800"
    if (score >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading assessments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={fetchAssessments}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Assessment Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>View and manage assessment reports</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No assessment reports found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.users?.name || "Anonymous"}</TableCell>
                    <TableCell>{assessment.users?.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge className={getScoreColor(assessment.overall_score)}>
                        {assessment.overall_score.toFixed(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(assessment.completed_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/reports/${assessment.id}`}>
                          <Button variant="outline" size="icon" title="View Report">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Download PDF"
                          onClick={() => window.open(`/api/admin/assessments/${assessment.id}/pdf`, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Send Email"
                          disabled={sendingEmail === assessment.id}
                          onClick={() => sendEmail(assessment.id)}
                        >
                          {sendingEmail === assessment.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
                          ) : (
                            <Mail className="h-4 w-4" />
                          )}
                          <span className="sr-only">Email</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
