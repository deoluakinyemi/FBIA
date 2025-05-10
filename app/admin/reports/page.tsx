"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Eye, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllAssessments } from "@/lib/supabase/assessment-service"

export default function ReportsPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAssessments() {
      try {
        const data = await getAllAssessments()
        setAssessments(data)
      } catch (err) {
        console.error("Error loading assessments:", err)
        setError("Failed to load assessment reports")
      } finally {
        setLoading(false)
      }
    }

    loadAssessments()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading assessment reports...</div>
  }

  if (error) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assessment Reports</CardTitle>
          <CardDescription>View, download PDFs, and manage all completed financial assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No assessments have been completed yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Overall Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">{assessment.users?.name || "N/A"}</TableCell>
                    <TableCell>{assessment.users?.email || "N/A"}</TableCell>
                    <TableCell>{new Date(assessment.completed_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {assessment.overall_score ? `${Math.round(assessment.overall_score * 10)}/10` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/reports/${assessment.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View and download report</span>
                        </Button>
                      </Link>
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
