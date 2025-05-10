"use client"

import { useEffect, useState } from "react"
import { BarChart, Calendar, LineChart, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase/server"
import { AreaChart } from "@/components/area-chart"
import { BarChartComponent } from "@/components/bar-chart"
import { PillarDistributionChart } from "@/components/pillar-distribution-chart"

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    totalAssessments: 0,
    completionRate: 0,
    averageScores: {} as Record<string, number>,
    weeklyAssessments: [] as { date: string; count: number }[],
    pillarDistribution: [] as { pillar: string; avgScore: number }[],
    weakestPillars: [] as { pillar: string; avgScore: number }[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const supabase = createServerClient()

        // Get total assessments
        const { count: assessmentCount, error: assessmentError } = await supabase
          .from("assessments")
          .select("*", { count: "exact", head: true })

        if (assessmentError) throw assessmentError

        // Get visitor count (in a real app, this would come from analytics tools)
        // For demo purposes, we'll estimate visitors as 3x the number of assessments
        const estimatedVisitors = assessmentCount ? assessmentCount * 3 : 0

        // Calculate completion rate (completed assessments / visitors)
        const completionRate = estimatedVisitors > 0 ? (assessmentCount || 0) / estimatedVisitors : 0

        // Get average scores per pillar
        const { data: pillarScores, error: pillarScoresError } = await supabase
          .from("pillar_scores")
          .select("pillar_id, score, pillars(slug, name)")

        if (pillarScoresError) throw pillarScoresError

        // Process pillar scores
        const pillarScoreMap: Record<string, { total: number; count: number; name: string }> = {}
        pillarScores.forEach((score) => {
          const pillarSlug = score.pillars?.slug || score.pillar_id
          const pillarName = score.pillars?.name || pillarSlug

          if (!pillarScoreMap[pillarSlug]) {
            pillarScoreMap[pillarSlug] = { total: 0, count: 0, name: pillarName }
          }

          pillarScoreMap[pillarSlug].total += score.score
          pillarScoreMap[pillarSlug].count += 1
        })

        // Calculate average scores
        const averageScores: Record<string, number> = {}
        const pillarDistribution: { pillar: string; avgScore: number }[] = []

        Object.entries(pillarScoreMap).forEach(([slug, data]) => {
          const avgScore = data.count > 0 ? data.total / data.count : 0
          averageScores[slug] = avgScore
          pillarDistribution.push({ pillar: data.name, avgScore: avgScore * 10 }) // Convert to 0-10 scale
        })

        // Get weakest pillars (sorted by average score)
        const weakestPillars = [...pillarDistribution].sort((a, b) => a.avgScore - b.avgScore).slice(0, 3)

        // Generate weekly assessment data (for the chart)
        // In a real app, this would be actual data from the database
        const today = new Date()
        const weeklyAssessments = Array.from({ length: 8 }, (_, i) => {
          const date = new Date(today)
          date.setDate(date.getDate() - (7 - i))
          const dateStr = date.toISOString().split("T")[0]

          // Generate a random count between 1 and 10 for demo purposes
          // In a real app, this would be actual data from the database
          const count = Math.floor(Math.random() * 10) + 1

          return { date: dateStr, count }
        })

        setAnalytics({
          totalVisitors: estimatedVisitors,
          totalAssessments: assessmentCount || 0,
          completionRate,
          averageScores,
          weeklyAssessments,
          pillarDistribution,
          weakestPillars,
        })
      } catch (error) {
        console.error("Error loading analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  if (loading) {
    return <div className="py-8 text-center">Loading analytics data...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalVisitors.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated unique visitors to the assessment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Assessments</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAssessments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total assessments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(analytics.completionRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Percentage of visitors who complete the assessment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Trend</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.weeklyAssessments[analytics.weeklyAssessments.length - 1]?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Assessments completed today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pillars">Pillar Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Completion Trend</CardTitle>
              <CardDescription>Number of assessments completed over the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <AreaChart data={analytics.weeklyAssessments} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Areas Needing Most Support</CardTitle>
                <CardDescription>Pillars with the lowest average scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.weakestPillars.map((pillar) => (
                    <div key={pillar.pillar} className="flex items-center">
                      <div className="w-full">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{pillar.pillar}</span>
                          <span className="text-sm font-medium">{pillar.avgScore.toFixed(1)}/10</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${pillar.avgScore * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Analysis of assessment data</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {analytics.completionRate > 0.5 ? "High" : "Low"} Completion Rate
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {analytics.completionRate > 0.5
                          ? "Users are highly engaged with the assessment."
                          : "Consider simplifying the assessment to improve completion rates."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Focus Area: {analytics.weakestPillars[0]?.pillar}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        This is the area where users need the most support based on assessment data.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-primary"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {analytics.weeklyAssessments[7]?.count > analytics.weeklyAssessments[0]?.count
                          ? "Increasing"
                          : "Decreasing"}{" "}
                        Trend
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Assessment completions are{" "}
                        {analytics.weeklyAssessments[7]?.count > analytics.weeklyAssessments[0]?.count
                          ? "trending upward"
                          : "trending downward"}{" "}
                        compared to last week.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pillars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Scores by Financial Pillar</CardTitle>
              <CardDescription>Analysis of strengths and weaknesses across all assessments</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <BarChartComponent data={analytics.pillarDistribution} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pillar Score Distribution</CardTitle>
              <CardDescription>Relative performance across financial pillars</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PillarDistributionChart data={analytics.pillarDistribution} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Long-term Trends</CardTitle>
              <CardDescription>In a production environment, this would show trends over longer periods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section would display long-term trends in assessment completions and scores over months or years.
                It would help identify seasonal patterns and long-term improvements in financial health.
              </p>
              <div className="mt-4 h-40 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Long-term trend visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Demographic Analysis</CardTitle>
              <CardDescription>
                In a production environment, this would show analysis by demographic factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section would break down assessment results by demographic factors such as age, income level,
                location, etc. It would help identify which groups need the most support in specific areas.
              </p>
              <div className="mt-4 h-40 bg-muted/20 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Demographic analysis visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
