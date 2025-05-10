"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/radar-chart"
import { ProgressOverTime } from "@/components/progress-over-time"
import { ProgressGoals } from "@/components/progress-goals"
import { AssessmentHistory } from "@/components/assessment-history"
import {
  getUserDashboardSettings,
  getUserProgressGoals,
  getUserAssessmentHistory,
  hasUserCompletedAssessments,
} from "@/lib/supabase/progress-service"
import { getPillars } from "@/lib/supabase/assessment-service"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [settings, setSettings] = useState<any>(null)
  const [goals, setGoals] = useState<any[]>([])
  const [assessments, setAssessments] = useState<any[]>([])
  const [pillars, setPillars] = useState<any[]>([])
  const [latestScores, setLatestScores] = useState<Record<string, number>>({})
  const [hasAssessments, setHasAssessments] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function loadUserData() {
      try {
        // Get user ID from localStorage
        const currentUserId = localStorage.getItem("currentUserId")
        const name = localStorage.getItem("userName")

        if (!currentUserId) {
          // Redirect to login if no user info
          window.location.href = "/assessment/start"
          return
        }

        setUserId(currentUserId)
        setUserName(name)

        // Check if user has completed any assessments
        const completed = await hasUserCompletedAssessments(currentUserId)
        setHasAssessments(completed)

        if (!completed) {
          setLoading(false)
          return
        }

        // Load user dashboard settings
        const userSettings = await getUserDashboardSettings(currentUserId)
        setSettings(userSettings)
        setActiveTab(userSettings.default_view)

        // Load pillars
        const pillarData = await getPillars()
        setPillars(pillarData)

        // Load progress goals
        const goalData = await getUserProgressGoals(currentUserId)
        setGoals(goalData)

        // Load assessment history
        const assessmentData = await getUserAssessmentHistory(currentUserId)
        setAssessments(assessmentData)

        // Extract latest scores
        if (assessmentData.length > 0) {
          const latest = assessmentData[0]
          const scores: Record<string, number> = {}

          latest.pillarScores.forEach((score: any) => {
            const pillarSlug = score.pillars?.slug || ""
            scores[pillarSlug] = score.score
          })

          setLatestScores(scores)
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [toast])

  const handleGoalsUpdated = async () => {
    if (!userId) return

    try {
      const goalData = await getUserProgressGoals(userId)
      setGoals(goalData)
    } catch (error) {
      console.error("Error refreshing goals:", error)
    }
  }

  if (loading) {
    return <div className="container py-12 text-center">Loading your dashboard...</div>
  }

  if (!hasAssessments) {
    return (
      <div className="container max-w-4xl py-12">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Financial Dashboard</CardTitle>
            <CardDescription>
              Complete your first assessment to start tracking your financial health progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="mb-6">
              Your dashboard will show your progress over time, help you set financial goals, and track your
              improvement.
            </p>
            <Link href="/assessment/start">
              <Button size="lg">
                Take Your First Assessment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Financial Dashboard</h1>
          {userName && <p className="text-muted-foreground">Welcome back, {userName}</p>}
        </div>
        <Link href="/dashboard/settings">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Dashboard Settings</span>
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
              <CardDescription>
                Your latest assessment results from{" "}
                {assessments[0]
                  ? new Date(assessments[0].completed_at).toLocaleDateString()
                  : "your most recent assessment"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <div className="w-full max-w-md aspect-square">
                <RadarChart scores={latestScores} />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Goals</CardTitle>
                <CardDescription>Track your financial improvement goals</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No goals set yet. Add goals in the Progress tab.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal) => (
                      <div key={goal.id} className="flex justify-between items-center">
                        <div className={goal.completed ? "line-through text-muted-foreground" : ""}>
                          <p className="font-medium">{goal.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Target: {Math.round(goal.target_score * 10)}/10
                          </p>
                        </div>
                        <div className="text-sm">
                          {goal.completed
                            ? "Completed"
                            : goal.target_date
                              ? `Due: ${new Date(goal.target_date).toLocaleDateString()}`
                              : "No deadline"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Assessments</CardTitle>
                <CardDescription>Your financial health journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assessments.slice(0, 3).map((assessment) => (
                    <div key={assessment.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Assessment Report</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(assessment.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-lg font-bold">{Math.round(assessment.overall_score * 10)}/10</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/assessment/start">
              <Button>
                Take Another Assessment <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6 mt-6">
          {settings?.show_progress_chart && <ProgressOverTime userId={userId || ""} pillars={pillars} />}

          <ProgressGoals userId={userId || ""} goals={goals} pillars={pillars} onGoalsUpdated={handleGoalsUpdated} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <AssessmentHistory assessments={assessments} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
