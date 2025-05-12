"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PillarScoreCard } from "@/components/pillar-score-card"
import { RadarChart } from "@/components/radar-chart"
import { toast } from "@/hooks/use-toast"
import { createAssessment, createUser, savePillarScores, saveAnswers } from "@/lib/supabase/assessment-service"

interface UserInfo {
  name: string
  email: string
  phone?: string
  marketingConsent: boolean
}

export default function ResultsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [pillarScores, setPillarScores] = useState<Record<string, number>>({})
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({})
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  useEffect(() => {
    // Get user info and assessment answers from localStorage
    const userInfoStr = localStorage.getItem("userInfo")
    const answersStr = localStorage.getItem("assessmentAnswers")

    if (!userInfoStr || !answersStr) {
      setError("Assessment data not found. Please retake the assessment.")
      setLoading(false)
      return
    }

    try {
      const userInfo = JSON.parse(userInfoStr)
      const answers = JSON.parse(answersStr)

      setUserInfo(userInfo)

      // Calculate scores
      const pillarScores: Record<string, number> = {}
      const pillarAnswers: Record<string, { count: number; total: number }> = {}

      // Process answers to calculate scores by pillar
      Object.entries(answers).forEach(([key, value]: [string, any]) => {
        const [pillar] = key.split("-")

        if (!pillarAnswers[pillar]) {
          pillarAnswers[pillar] = { count: 0, total: 0 }
        }

        pillarAnswers[pillar].count += 1
        pillarAnswers[pillar].total += value.score
      })

      // Calculate average score for each pillar
      Object.entries(pillarAnswers).forEach(([pillar, data]) => {
        pillarScores[pillar] = Math.round((data.total / data.count) * 100) / 100
      })

      // Calculate overall score (average of pillar scores)
      const overallScore =
        Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.values(pillarScores).length

      setPillarScores(pillarScores)
      setOverallScore(Math.round(overallScore * 100) / 100)

      // Save assessment to Supabase
      saveAssessmentToSupabase(userInfo, pillarScores, answers, overallScore)

      setLoading(false)
    } catch (err) {
      console.error("Error processing assessment results:", err)
      setError("Error processing assessment results. Please try again.")
      setLoading(false)
    }
  }, [])

  const saveAssessmentToSupabase = async (
    userInfo: UserInfo,
    pillarScores: Record<string, number>,
    answers: Record<string, { questionId: string; optionId: string; score: number }>,
    overallScore: number,
  ) => {
    setSaving(true)
    try {
      // 1. Create or get user
      const user = await createUser(userInfo.email, userInfo.name, userInfo.phone, userInfo.marketingConsent)

      // 2. Create assessment
      const assessment = await createAssessment(user.id, overallScore)
      setAssessmentId(assessment.id)

      // 3. Save pillar scores
      await savePillarScores(assessment.id, pillarScores)

      // 4. Save individual answers
      const formattedAnswers: Record<string, { questionId: string; optionId: string }> = {}
      Object.entries(answers).forEach(([key, value]) => {
        formattedAnswers[key] = {
          questionId: value.questionId,
          optionId: value.optionId,
        }
      })
      await saveAnswers(assessment.id, formattedAnswers)

      toast({
        title: "Assessment saved",
        description: "Your assessment has been successfully saved.",
      })
    } catch (err) {
      console.error("Error saving assessment:", err)
      toast({
        title: "Error saving assessment",
        description: "There was an error saving your assessment. Your results are still visible.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!assessmentId) {
      toast({
        title: "Cannot download PDF",
        description: "Assessment data is not available.",
        variant: "destructive",
      })
      return
    }

    try {
      // Redirect to PDF download endpoint
      window.open(`/api/admin/assessments/${assessmentId}/pdf`, "_blank")
    } catch (err) {
      console.error("Error downloading PDF:", err)
      toast({
        title: "Error downloading PDF",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-xl text-nairawise-dark">Calculating your results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-nairawise-dark">Error</h1>
        <p className="mb-6 text-nairawise-dark/80">{error}</p>
        <Button onClick={() => router.push("/assessment/start")} className="bg-red-600 hover:bg-red-700 text-white">
          Retake Assessment
        </Button>
      </div>
    )
  }

  const getPillarTitle = (pillarSlug: string) => {
    const pillarTitles: Record<string, string> = {
      awareness: "Financial Awareness",
      goals: "Goal Setting",
      habits: "Financial Habits",
      mindsets: "Money Mindsets",
      assets: "Asset Building",
      liabilities: "Liability Management",
      income: "Income Streams",
      expenses: "Expense Control",
    }
    return pillarTitles[pillarSlug] || pillarSlug
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-nairawise-dark">Your Financial Assessment Results</h1>
        <p className="mt-2 text-nairawise-dark/80">
          Thank you for completing the assessment. Here's a breakdown of your financial health.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Score</CardTitle>
          <CardDescription>Your overall financial health score</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-center">
            <div
              className={`text-5xl font-bold ${
                overallScore >= 0.7 ? "text-green-600" : overallScore >= 0.4 ? "text-amber-600" : "text-red-600"
              }`}
            >
              {(overallScore * 100).toFixed(0)}%
            </div>
            <p className="mt-2 text-nairawise-dark/80">
              {overallScore >= 0.7
                ? "Excellent! You have strong financial health."
                : overallScore >= 0.4
                  ? "Good progress, but there's room for improvement."
                  : "You have several areas that need attention."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pillar Scores</CardTitle>
          <CardDescription>Breakdown of your scores across financial pillars</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 h-80">
            <RadarChart
              data={Object.entries(pillarScores).map(([key, value]) => ({
                pillar: getPillarTitle(key),
                score: value * 100,
              }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(pillarScores).map(([pillar, score]) => (
              <PillarScoreCard key={pillar} title={getPillarTitle(pillar)} score={score} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button
          onClick={handleDownloadPDF}
          disabled={saving || !assessmentId}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF Report
        </Button>
      </div>
    </div>
  )
}
