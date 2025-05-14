"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, Download, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getAllAssessments } from "@/lib/supabase/assessment-service"

export default function ReportsPage() {
  const { toast } = useToast()
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAllAssessments()
        setAssessments(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching assessments:", err)
        setError("Failed to load assessment reports. Please try again later.")
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

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
    <div className="space-y-6 p-6">
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
                            window.open(`/api/admin/assessments/${assessment.id}/pdf`, "_blank")
                            toast({
                              title: "PDF Generated",
                              description: "Assessment PDF has been generated and downloaded",
                            })
                          }}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
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
