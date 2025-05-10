"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, FileQuestion, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalPillars: 0,
    totalAssessments: 0,
    averageScore: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const supabase = createServerClient()

        // Get pillar count
        const { count: pillarCount, error: pillarError } = await supabase
          .from("pillars")
          .select("*", { count: "exact", head: true })

        if (pillarError) throw pillarError

        // Get question count
        const { count: questionCount, error: questionError } = await supabase
          .from("questions")
          .select("*", { count: "exact", head: true })

        if (questionError) throw questionError

        // Get assessment count
        const { count: assessmentCount, error: assessmentError } = await supabase
          .from("assessments")
          .select("*", { count: "exact", head: true })

        if (assessmentError) throw assessmentError

        // Get average score
        const { data: scoreData, error: scoreError } = await supabase.from("assessments").select("overall_score")

        if (scoreError) throw scoreError

        const averageScore =
          scoreData.length > 0
            ? scoreData.reduce((sum, item) => sum + (item.overall_score || 0), 0) / scoreData.length
            : 0

        setStats({
          totalPillars: pillarCount || 0,
          totalQuestions: questionCount || 0,
          totalAssessments: assessmentCount || 0,
          averageScore,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading dashboard statistics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Across {stats.totalPillars} financial pillars</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssessments}</div>
            <p className="text-xs text-muted-foreground">Total assessments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageScore * 10)}/10</div>
            <p className="text-xs text-muted-foreground">Average financial health score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Reports</CardTitle>
            <CardDescription>View and analyze completed assessments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Access detailed reports for all completed financial assessments.
            </p>
            <Link href="/admin/reports">
              <Button>View Reports</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Questions</CardTitle>
            <CardDescription>Edit assessment questions and answers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Update the questions and answer options for each financial pillar.
            </p>
            <Link href="/admin/questions">
              <Button>Manage Questions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
