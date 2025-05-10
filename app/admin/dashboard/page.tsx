"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, FileQuestion, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { questions } from "@/lib/questions"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalPillars: 0,
    totalUsers: 0, // This would come from a database in a real app
  })

  useEffect(() => {
    // Calculate stats
    const pillars = Object.keys(questions)
    const questionCount = Object.values(questions).reduce((sum, pillarQuestions) => sum + pillarQuestions.length, 0)

    // Get completed assessments count from localStorage
    const completedAssessments = localStorage.getItem("completedAssessments")
      ? Number.parseInt(localStorage.getItem("completedAssessments") || "0")
      : 0

    setStats({
      totalQuestions: questionCount,
      totalPillars: pillars.length,
      totalUsers: completedAssessments,
    })
  }, [])

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
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total assessments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Financial Pillars</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPillars}</div>
            <p className="text-xs text-muted-foreground">Assessment categories</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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
        <Card>
          <CardHeader>
            <CardTitle>View Assessment</CardTitle>
            <CardDescription>Preview the assessment as users will see it</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              See how the assessment appears to users and test the flow.
            </p>
            <Link href="/assessment">
              <Button variant="outline">View Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
