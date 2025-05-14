"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PillarScoreCard } from "@/components/pillar-score-card"
import { RadarChart } from "@/components/radar-chart"
import { useToast } from "@/hooks/use-toast"
import { calculateScores, getRecommendations } from "@/lib/scoring"

interface UserInfo {
  name: string
  email: string
  phone?: string
  marketingConsent: boolean
}

export default function ResultsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overallScore, setOverallScore] = useState(0)
  const [pillarScores, setPillarScores] = useState<Record<string, number>>({})
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({})
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // Define the consistent order of pillars
  const pillarOrder = ["awareness", "goals", "habits", "mindsets", "assets", "liabilities", "income", "expenses"]

  // Map pillar slugs to display names
  const pillarNames: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

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

      // Calculate scores using the utility function
      const scores = calculateScores(answers)

      // Log the scores to help with debugging
      console.log("Scores from calculation:", scores)

      setPillarScores(scores)

      // Calculate overall score (average of pillar scores)
      const overall = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.values(scores).length
      setOverallScore(overall)

      // Get recommendations
      const recs = getRecommendations(scores)
      setRecommendations(recs)

      setLoading(false)
    } catch (err) {
      console.error("Error processing assessment results:", err)
      setError("Error processing assessment results. Please try again.")
      setLoading(false)
    }
  }, [])

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
          <CardDescription>Your overall financial health score (out of 10)</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="text-center">
            <div
              className={`text-5xl font-bold ${
                overallScore >= 7 ? "text-green-600" : overallScore >= 4 ? "text-amber-600" : "text-red-600"
              }`}
            >
              {overallScore.toFixed(1)}/10
            </div>
            <p className="mt-2 text-nairawise-dark/80">
              {overallScore >= 7
                ? "Excellent! You have strong financial health."
                : overallScore >= 4
                  ? "Good progress, but there's room for improvement."
                  : "You have several areas that need attention."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pillar Scores</CardTitle>
          <CardDescription>Breakdown of your scores across financial pillars (out of 10)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 h-80">
            <RadarChart scores={pillarScores} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pillarOrder.map((pillar) => (
              <PillarScoreCard
                key={pillar}
                pillar={pillar}
                title={pillarNames[pillar]}
                score={pillarScores[pillar] || 0}
                recommendations={recommendations[pillar] || []}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={() => router.push("/")} className="bg-nairawise-dark hover:bg-nairawise-dark/90 text-white">
          Return to Home
        </Button>
      </div>
    </div>
  )
}
