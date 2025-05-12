"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, Download, Mail, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  marketing_consent?: boolean
}

interface Assessment {
  id: string
  user_id: string
  overall_score: number
  completed_at: string
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
    // Simulate fetching assessments from API
    const fetchAssessments = async () => {
      try {
        // Mock data for testing
        const mockAssessments: Assessment[] = [
          {
            id: "assessment_1",
            user_id: "user_1",
            overall_score: 0.78,
            completed_at: new Date().toISOString(),
            users: {
              id: "user_1",
              name: "John Doe",
              email: "john@example.com",
              phone: "+234 800 123 4567",
              marketing_consent: true,
            },
          },
          {
            id: "assessment_2",
            user_id: "user_2",
            overall_score: 0.65,
            completed_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            users: {
              id: "user_2",
              name: "Jane Smith",
              email: "jane@example.com",
              phone: "+234 800 987 6543",
              marketing_consent: false,
            },
          },
          {
            id: "assessment_3",
            user_id: "user_3",
            overall_score: 0.42,
            completed_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            users: {
              id: "user_3",
              name: "Michael Johnson",
              email: "michael@example.com",
              phone: "+234 800 456 7890",
              marketing_consent: true,
            },
          },
          {
            id: "assessment_4",
            user_id: "user_4",
            overall_score: 0.91,
            completed_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
            users: {
              id: "user_4",
              name: "Sarah Williams",
              email: "sarah@example.com",
              phone: "+234 800 789 0123",
              marketing_consent: true,
            },
          },
          {
            id: "assessment_5",
            user_id: "user_5",
            overall_score: 0.53,
            completed_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            users: {
              id: "user_5",
              name: "David Brown",
              email: "david@example.com",
              phone: "+234 800 234 5678",
              marketing_consent: false,
            },
          },
        ]

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setAssessments(mockAssessments)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching assessments:", err)
        setError("Failed to load assessment reports. Please try again later.")
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  const handleSendEmail = async (assessmentId: string) => {
    setSendingEmail(assessmentId)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email Sent",
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
            <Button onClick={() => window.location.reload()}>Try Again</Button>
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
                      <Badge
                        className={
                          assessment.overall_score >= 0.8
                            ? "bg-green-100 text-green-800"
                            : assessment.overall_score >= 0.6
                              ? "bg-blue-100 text-blue-800"
                              : assessment.overall_score >= 0.4
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }
                      >
                        {(assessment.overall_score * 10).toFixed(1)}
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
                          onClick={() => {
                            toast({
                              title: "PDF Generated",
                              description: "Assessment PDF has been generated and downloaded",
                            })
                          }}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          title="Send Email"
                          disabled={sendingEmail === assessment.id}
                          onClick={() => handleSendEmail(assessment.id)}
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
