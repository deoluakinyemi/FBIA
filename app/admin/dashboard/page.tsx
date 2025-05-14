"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllAssessments } from "@/lib/supabase/assessment-service"

export default function AdminDashboardPage() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getAllAssessments()
        setAssessments(data)
      } catch (err) {
        console.error("Error fetching assessments:", err)
        setError("Failed to load assessments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [])

  // Calculate statistics
  const totalAssessments = assessments.length
  const totalUsers = new Set(assessments.map((a) => a.user_id)).size
  const averageScore =
    assessments.length > 0 ? assessments.reduce((sum, a) => sum + Number(a.overall_score), 0) / assessments.length : 0

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAssessments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(averageScore * 10).toFixed(1)}/10</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>Showing the {Math.min(10, assessments.length)} most recent assessments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Score</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {assessments.slice(0, 10).map((assessment) => (
                  <tr key={assessment.id} className="border-b">
                    <td className="p-2">{assessment.users?.name || "Anonymous"}</td>
                    <td className="p-2">{assessment.users?.email || "N/A"}</td>
                    <td className="p-2">{(assessment.overall_score * 10).toFixed(1)}/10</td>
                    <td className="p-2">{new Date(assessment.completed_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
