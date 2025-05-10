"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/radar-chart"
import { PillarScoreCard } from "@/components/pillar-score-card"
import { getAssessmentDetails } from "@/lib/supabase/assessment-service"

export default function ResultsPage() {
  const [assessment, setAssessment] = useState<any>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [recommendations, setRecommendations] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResults() {
      try {
        // Get assessment ID from localStorage
        const assessmentId = localStorage.getItem("currentAssessmentId")
        if (!assessmentId) {
          setError("No assessment found. Please complete the assessment first.")
          setLoading(false)
          return
        }

        // Get assessment details from Supabase
        const assessmentDetails = await getAssessmentDetails(assessmentId)
        if (!assessmentDetails) {
          setError("Assessment not found. Please complete the assessment again.")
          setLoading(false)
          return
        }

        setAssessment(assessmentDetails)

        // Extract pillar scores
        const pillarScoresMap: Record<string, number> = {}
        assessmentDetails.pillarScores.forEach((score: any) => {
          pillarScoresMap[score.pillars.slug] = score.score
        })
        setScores(pillarScoresMap)

        // For now, use hardcoded recommendations
        // In a real app, these would come from the database
        setRecommendations(getRecommendations(pillarScoresMap))

        setLoading(false)
      } catch (err) {
        console.error("Error loading results:", err)
        setError("An error occurred while loading your results.")
        setLoading(false)
      }
    }

    loadResults()
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

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6">{error}</p>
        <Link href="/assessment">
          <Button>Take the Assessment</Button>
        </Link>
      </div>
    )
  }

  if (!assessment) {
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

  const overallScore = assessment.overall_score

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

// Temporary function to generate recommendations
// In a real app, these would come from the database
function getRecommendations(scores: Record<string, number>): Record<string, string[]> {
  const recommendations: Record<string, string[]> = {}

  // Awareness recommendations
  if (scores.awareness < 0.6) {
    recommendations.awareness = [
      "Set up a system to track all your income and expenses",
      "Schedule monthly financial review sessions",
      "Subscribe to financial news sources or podcasts",
      "Take a basic financial literacy course",
      "Create a detailed list of all your assets and liabilities",
    ]
  } else {
    recommendations.awareness = [
      "Deepen your understanding of advanced financial concepts",
      "Set up more detailed tracking of investment performance",
      "Analyze economic trends that might affect your specific financial situation",
      "Consider working with a financial advisor for specialized knowledge",
    ]
  }

  // Goals recommendations
  if (scores.goals < 0.6) {
    recommendations.goals = [
      "Define 3-5 specific, measurable financial goals with deadlines",
      "Break down each goal into smaller, actionable steps",
      "Create a vision board or written statement about your financial future",
      "Schedule quarterly reviews of your progress toward goals",
      "Adjust unrealistic goals to be challenging but achievable",
    ]
  } else {
    recommendations.goals = [
      "Create more detailed implementation plans for each goal",
      "Set up automated systems to support your goals",
      "Add stretch goals to push your financial growth",
      "Develop contingency plans for potential obstacles",
    ]
  }

  // Habits recommendations
  if (scores.habits < 0.6) {
    recommendations.habits = [
      "Set up automatic transfers to savings on payday",
      "Implement a 24-hour rule before making non-essential purchases",
      "Track all spending for 30 days to identify patterns",
      "Schedule 15 minutes weekly for financial management",
      "Create a system for handling financial windfalls before they occur",
    ]
  } else {
    recommendations.habits = [
      "Optimize your financial automation systems",
      "Develop more sophisticated tracking methods",
      "Create accountability systems for your financial habits",
      "Share your knowledge by mentoring others",
    ]
  }

  // Mindsets recommendations
  if (scores.mindsets < 0.6) {
    recommendations.mindsets = [
      "Read books on financial mindset and psychology of money",
      "Practice gratitude for your current financial situation while working to improve it",
      "Challenge negative beliefs about money with evidence",
      "Find role models who have achieved what you want to achieve",
      "Journal about your emotional reactions to financial events",
    ]
  } else {
    recommendations.mindsets = [
      "Mentor others on developing healthy money mindsets",
      "Explore more advanced wealth psychology concepts",
      "Challenge yourself to take calculated financial risks",
      "Develop systems to maintain optimism during market downturns",
    ]
  }

  // Assets recommendations
  if (scores.assets < 0.6) {
    recommendations.assets = [
      "Start investing regularly, even with small amounts",
      "Learn about different asset classes and their characteristics",
      "Set up automatic investments into index funds or other diversified assets",
      "Explore ways to generate passive income from your skills or resources",
      "Create a plan to gradually increase your investment percentage",
    ]
  } else {
    recommendations.assets = [
      "Optimize your asset allocation for your specific goals",
      "Explore more sophisticated investment strategies",
      "Consider alternative investments to further diversify",
      "Develop systems to increase your passive income streams",
    ]
  }

  // Liabilities recommendations
  if (scores.liabilities < 0.6) {
    recommendations.liabilities = [
      "List all debts with interest rates and minimum payments",
      "Create a debt repayment strategy (snowball or avalanche method)",
      "Consolidate high-interest debt if possible",
      "Negotiate with creditors for better terms",
      "Develop criteria for when to take on new debt",
    ]
  } else {
    recommendations.liabilities = [
      "Optimize your debt repayment strategy",
      "Consider leveraging strategic debt for asset acquisition",
      "Refinance existing debt to better terms",
      "Develop a more sophisticated approach to using credit",
    ]
  }

  // Income recommendations
  if (scores.income < 0.6) {
    recommendations.income = [
      "Identify skills you can develop to increase your primary income",
      "Explore side hustle opportunities aligned with your skills",
      "Network strategically in your industry",
      "Research salary ranges for your position and prepare for negotiation",
      "Set specific income growth targets for 1, 3, and 5 years",
    ]
  } else {
    recommendations.income = [
      "Develop more passive income streams",
      "Consider entrepreneurial opportunities",
      "Optimize your existing income streams for efficiency",
      "Explore ways to scale your highest-performing income sources",
    ]
  }

  // Expenses recommendations
  if (scores.expenses < 0.6) {
    recommendations.expenses = [
      "Create a detailed budget aligned with your values",
      "Identify and eliminate unnecessary recurring expenses",
      "Implement a category-based spending plan",
      "Practice zero-based budgeting for one month",
      "Audit your subscriptions and memberships",
    ]
  } else {
    recommendations.expenses = [
      "Optimize spending to maximize value rather than just cutting costs",
      "Implement more sophisticated budgeting techniques",
      "Develop systems to automatically categorize and analyze expenses",
      "Create spending policies for different areas of your life",
    ]
  }

  return recommendations
}
