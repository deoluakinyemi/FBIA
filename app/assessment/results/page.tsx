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
        // Get user info from session storage
        const userInfoJson = sessionStorage.getItem("userInfo")
        if (!userInfoJson) {
          setError("No user information found. Please restart the assessment.")
          setLoading(false)
          return
        }

        const userInfo = JSON.parse(userInfoJson)
        setUserId(userInfo.id)
        setUserName(userInfo.name)
        setUserEmail(userInfo.email)

        // Get answers from session storage
        const answersJson = sessionStorage.getItem("assessmentAnswers")
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
        try {
          // 1. Create assessment
          const assessment = await createAssessment(userInfo.id, overall)
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
          if (userInfo.email) {
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
        } catch (saveError) {
          console.error("Error saving assessment:", saveError)
          // Continue showing results even if saving fails
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
        <h1 className="text-2xl font-bold mb-4 text-nairawise-dark">Error</h1>
        <p className="mb-6 text-nairawise-dark/80">{error}</p>
        <Link href="/assessment/start">
          <Button className="bg-red-600 hover:bg-red-700 text-white">Restart Assessment</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-nairawise-dark">Your Financial Health Results</h1>
        {userName && (
          <p className="text-xl text-nairawise-dark/80">
            Hello, <span className="font-medium">{userName}</span>! Here's your personalized financial assessment.
          </p>
        )}
        <p className="text-nairawise-dark/70">
          Based on your responses, we've analyzed your financial health across 8 key pillars.
        </p>
      </div>

      <Card className="mb-8 nairawise-card nairawise-shadow">
        <CardHeader className="bg-gradient-to-r from-nairawise-dark to-nairawise-medium text-white rounded-t-lg">
          <CardTitle>Overall Financial Health Score</CardTitle>
          <CardDescription className="text-white/90">
            Your overall score is calculated as an average of all financial pillars.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center pt-6">
          <div className="text-6xl font-bold mb-4 text-nairawise-dark">{Math.round(overallScore * 10)}/10</div>
          <div className="text-lg text-center max-w-md text-nairawise-dark/80">
            {overallScore >= 0.8
              ? "Excellent! You have a strong financial foundation."
              : overallScore >= 0.6
                ? "Good. You're on the right track, but there's room for improvement."
                : overallScore >= 0.4
                  ? "Fair. You have several areas that need attention."
                  : "Needs improvement. Focus on building your financial foundation."}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 flex-wrap bg-nairawise-cream rounded-b-lg">
          {userEmail && (
            <Button
              onClick={handleSendEmail}
              disabled={sendingEmail || emailSent}
              variant={emailSent ? "outline" : "default"}
              className={
                emailSent ? "border-nairawise-dark text-nairawise-dark" : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              <Mail className="mr-2 h-4 w-4" />
              {sendingEmail ? "Sending..." : emailSent ? "Email Sent" : "Email Results"}
            </Button>
          )}
        </CardFooter>
      </Card>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="grid w-full grid-cols-2 bg-nairawise-cream">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-nairawise-dark data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="detailed"
            className="data-[state=active]:bg-nairawise-dark data-[state=active]:text-white"
          >
            Detailed Analysis
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <Card className="nairawise-shadow">
            <CardHeader className="bg-nairawise-cream">
              <CardTitle className="text-nairawise-dark">Financial Health Overview</CardTitle>
              <CardDescription className="text-nairawise-dark/70">
                This chart shows your score in each financial pillar.
              </CardDescription>
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
            {Object.entries(scores).map(([pillar, score], index) => (
              <PillarScoreCard
                key={pillar}
                pillar={pillar}
                score={score}
                recommendations={recommendations[pillar] || []}
                className={index % 2 === 0 ? "border-t-4 border-nairawise-medium" : "border-t-4 border-nairawise-gold"}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="nairawise-card nairawise-shadow">
        <CardHeader className="bg-gradient-to-r from-nairawise-dark to-nairawise-medium text-white rounded-t-lg">
          <CardTitle>Next Steps</CardTitle>
          <CardDescription className="text-white/90">
            Based on your results, here are the key areas to focus on:
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {Object.entries(scores)
              .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
              .slice(0, 3)
              .map(([pillar, score]) => (
                <div key={pillar} className="space-y-2">
                  <h3 className="font-medium capitalize text-nairawise-dark">
                    {pillar} ({Math.round(score * 10)}/10)
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {recommendations[pillar]?.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-sm text-nairawise-dark/70">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 bg-nairawise-cream rounded-b-lg">
          <p className="text-center text-sm text-nairawise-dark/70">
            {emailSent ? "We've sent your detailed results to your email. " : ""}
            We'll be in touch soon to schedule your complimentary clarity session to discuss your results and next
            steps.
          </p>
          <Link href="/" className="w-full">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
