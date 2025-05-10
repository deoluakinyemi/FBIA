"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { calculateScores, getRecommendations } from "@/lib/scoring"
import { RadarChart } from "@/components/radar-chart"
import { PillarScoreCard } from "@/components/pillar-score-card"

export default function ResultsPage() {
  const [scores, setScores] = useState<Record<string, number>>({})
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResults = localStorage.getItem("assessmentResults")
    if (storedResults) {
      const answers = JSON.parse(storedResults)
      const calculatedScores = calculateScores(answers)
      const calculatedRecommendations = getRecommendations(calculatedScores)

      setScores(calculatedScores)
      setRecommendations(calculatedRecommendations)
    }
    setLoading(false)
  }, [])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Financial Health Assessment Results",
        text: "Check out my financial health assessment results!",
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy: ", err))
    }
  }

  const handleDownload = () => {
    // In a real implementation, this would generate a PDF report
    alert("This would download a PDF report in a production environment")
  }

  if (loading) {
    return <div className="container py-12 text-center">Loading your results...</div>
  }

  if (Object.keys(scores).length === 0) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No assessment results found</h1>
        <p className="mb-6">You haven't completed the assessment yet.</p>
        <Link href="/assessment">
          <Button>Take the Assessment</Button>
        </Link>
      </div>
    )
  }

  const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Your Financial Health Results</h1>
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
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleDownload} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share Results
          </Button>
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
        <CardFooter>
          <Link href="/" className="w-full">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
