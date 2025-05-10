import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
      <div className="text-center space-y-4 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Financial Health Assessment</h1>
        <p className="text-xl text-muted-foreground">
          Evaluate your financial wellness across 8 key pillars and receive personalized insights to improve your
          financial future.
        </p>
      </div>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>What You'll Discover</CardTitle>
          <CardDescription>
            This assessment will help you understand your financial strengths and areas for improvement.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">8 Financial Pillars</h3>
            <p className="text-sm text-muted-foreground">
              Evaluate your financial awareness, goals, habits, mindsets, assets, liabilities, income, and expenses.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Personalized Report</h3>
            <p className="text-sm text-muted-foreground">
              Receive a detailed analysis of your financial health with actionable recommendations.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">5-10 Minutes</h3>
            <p className="text-sm text-muted-foreground">
              Complete the assessment in just a few minutes to gain valuable insights.
            </p>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Clarity Session</h3>
            <p className="text-sm text-muted-foreground">
              Get a complimentary follow-up session to discuss your results and next steps.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/assessment/start" className="w-full">
            <Button size="lg" className="w-full">
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
        {pillars.map((pillar) => (
          <Card key={pillar.id} className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{pillar.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{pillar.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const pillars = [
  {
    id: "awareness",
    name: "Financial Awareness",
    description: "Understanding your current financial situation and economic realities.",
  },
  {
    id: "goals",
    name: "Goal Setting",
    description: "Establishing concrete, achievable financial objectives.",
  },
  {
    id: "habits",
    name: "Financial Habits",
    description: "Daily practices that impact your long-term financial health.",
  },
  {
    id: "mindsets",
    name: "Money Mindsets",
    description: "Your beliefs and attitudes about money and wealth.",
  },
  {
    id: "assets",
    name: "Asset Building",
    description: "Investments and possessions that generate passive income.",
  },
  {
    id: "liabilities",
    name: "Liability Management",
    description: "How you handle debts and financial obligations.",
  },
  {
    id: "income",
    name: "Income Streams",
    description: "Your sources of income and potential for growth.",
  },
  {
    id: "expenses",
    name: "Expense Control",
    description: "How you manage spending and budgeting practices.",
  },
]
