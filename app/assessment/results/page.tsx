"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/radar-chart"
import { PillarScoreCard } from "@/components/pillar-score-card"
import {
  createAssessment,
  savePillarScores,
  saveAnswers,
  sendAssessmentResultsEmail,
} from "@/lib/supabase/assessment-service"
import { calculateScores, getRecommendations } from "@/lib/scoring"
import { useToast } from "@/hooks/use-toast"

export default function ResultsPage() {
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({})
  const [overallScore, setOverallScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    async function processResults() {
      try {
        // Get user ID from localStorage
        const currentUserId = localStorage.getItem("currentUserId")
        const name = localStorage.getItem("userName")
        const email = localStorage.getItem("userEmail")

        if (!currentUserId) {
          setError("No user information found. Please restart the assessment.")
          setLoading(false)
          return
        }

        setUserId(currentUserId)
        setUserName(name)
        setUserEmail(email)

        // Get answers from localStorage
        const answersJson = localStorage.getItem("assessmentAnswers")
        if (!answersJson) {
          setError("No assessment data found. Please retake the assessment.")
          setLoading(false)
          return
        }

        const answers = JSON.parse(answersJson) as Record<
          string,
          { questionId: string; optionId: string; score: number }
        >

        // Calculate scores
        const calculatedScores = calculateScores(
          Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, value.score])),
        )

        setScores(calculatedScores)

        // Calculate overall score
        const overall =
          Object.values(calculatedScores).reduce((sum, score) => sum + score, 0) / Object.keys(calculatedScores).length

        setOverallScore(overall)

        // Get recommendations
        setRecommendations(getRecommendations(calculatedScores))

        // Save to Supabase
        // 1. Create assessment
        const assessment = await createAssessment(currentUserId, overall)
        setAssessmentId(assessment.id)

        // 2. Save pillar scores
        await savePillarScores(assessment.id, calculatedScores)

        // 3. Save individual answers
        await saveAnswers(
          assessment.id,
          Object.fromEntries(
            Object.entries(answers).map(([key, value]) => [
              key,
              { questionId: value.questionId, optionId: value.optionId },
            ]),
          ),
        )

        // 4. Send email notification automatically
        if (email) {
          try {
            setSendingEmail(true)
            await sendAssessmentResultsEmail(assessment.id)
            setEmailSent(true)
            toast({
              title: "Email Sent",
              description: "Your assessment results have been sent to your email.",
            })
          } catch (emailError) {
            console.error("Error sending email:", emailError)
            // Don't show error to user, just log it
          } finally {
            setSendingEmail(false)
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Error processing results:", err)
        setError("An error occurred while processing your results.")
        setLoading(false)
      }
    }

    processResults()
  }, [toast])

  const handleSendEmail = async () => {
    if (!assessmentId || !userEmail) return

    try {
      setSendingEmail(true)
      await sendAssessmentResultsEmail(assessmentId)
      setEmailSent(true)
      toast({
        title: "Email Sent",
        description: "Your assessment results have been sent to your email.",
      })
    } catch (err) {
      console.error("Error sending email:", err)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return <div className="container py-12 text-center">Processing your results...</div>
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">{error}</p>
        <Link href="/assessment/start">
          <Button>Restart Assessment</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Your Financial Health Results</h1>
        {userName && (
          <p className="text-xl">
            Hello, <span className="font-medium">{userName}</span>! Here's your personalized financial assessment.
          </p>
        )}
        <p className="text-muted-foreground">
          Based on your responses, we've analyzed your financial health across 8 key pillars.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Financial Health Score</CardTitle>
          <CardDescription>Your overall score is calculated as an average of all financial pillars.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="text-6xl font-bold mb-4">{Math.round(overallScore * 10)}/10</div>
          <div className="text-lg text-center max-w-md">
            {overallScore >= 0.8
              ? "Excellent! You have a strong financial foundation."
              : overallScore >= 0.6
                ? "Good. You're on the right track, but there's room for improvement."
                : overallScore >= 0.4
                  ? "Fair. You have several areas that need attention."
                  : "Needs improvement. Focus on building your financial foundation."}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 flex-wrap">
          {userEmail && (
            <Button
              onClick={handleSendEmail}
              disabled={sendingEmail || emailSent}
              variant={emailSent ? "outline" : "default"}
            >
              <Mail className="mr-2 h-4 w-4" />
              {sendingEmail ? "Sending..." : emailSent ? "Email Sent" : "Email Results"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
              <CardDescription>This chart shows your score in each financial pillar.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <div className="w-full max-w-md aspect-square">
                <RadarChart scores={scores} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="detailed" className="pt-4">
          <div className="grid gap-6 sm:grid-cols-2">
            {Object.entries(scores).map(([pillar, score]) => (
              <PillarScoreCard
                key={pillar}
                pillar={pillar}
                score={score}
                recommendations={recommendations[pillar] || []}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Based on your results, here are the key areas to focus on:</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(scores)
              .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
              .slice(0, 3)
              .map(([pillar, score]) => (
                <div key={pillar} className="space-y-2">
                  <h3 className="font-medium capitalize">
                    {pillar} ({Math.round(score * 10)}/10)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations[pillar]?.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            {emailSent ? "We've sent your detailed results to your email. " : ""}
            We'll be in touch soon to schedule your complimentary clarity session to discuss your results and next
            steps.
          </p>
          <Link href="/" className="w-full">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
