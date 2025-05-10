import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AssessmentStartPage() {
  // Financial pillars data
  const financialPillars = [
    {
      id: "awareness",
      title: "Financial Awareness",
      description: "Understanding your current financial situation and knowledge level.",
      icon: "/images/financial-awareness-icon.png",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "goals",
      title: "Goal Setting",
      description: "Establishing clear, achievable financial objectives.",
      icon: "/images/goal-setting-icon.png",
      color: "bg-green-100 text-green-700",
    },
    {
      id: "habits",
      title: "Financial Habits",
      description: "Developing routines that support financial health.",
      icon: "/images/financial-habits-icon.png",
      color: "bg-purple-100 text-purple-700",
    },
    {
      id: "mindsets",
      title: "Money Mindsets",
      description: "Cultivating healthy attitudes and beliefs about money.",
      icon: "/images/money-mindsets-icon.png",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: "assets",
      title: "Asset Building",
      description: "Strategies for growing and diversifying your assets.",
      icon: "/images/asset-building-icon.png",
      color: "bg-red-100 text-red-700",
    },
    {
      id: "liabilities",
      title: "Liability Management",
      description: "Effectively managing and reducing debts and liabilities.",
      icon: "/images/liability-management-icon.png",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: "income",
      title: "Income Streams",
      description: "Developing multiple sources of income for financial security.",
      icon: "/images/income-streams-icon.png",
      color: "bg-pink-100 text-pink-700",
    },
    {
      id: "expenses",
      title: "Expense Control",
      description: "Optimizing spending and reducing unnecessary expenses.",
      icon: "/images/expense-control-icon.png",
      color: "bg-orange-100 text-orange-700",
    },
  ]

  return (
    <div className="container max-w-6xl py-12">
      <div className="grid gap-12">
        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-nairawise-dark">Financial Health Assessment</h1>
            <p className="text-lg text-gray-600">
              Discover your financial strengths and areas for improvement with our comprehensive assessment tool.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-nairawise-medium" />
                <span>Takes only 10-15 minutes to complete</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-nairawise-medium" />
                <span>Receive personalized recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-nairawise-medium" />
                <span>Track your progress over time</span>
              </div>
            </div>
            <div className="pt-4">
              <Link href="/assessment/user-info">
                <Button
                  size="lg"
                  className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
                >
                  Start Your Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px]">
            <Image
              src="/images/woman-financial-planning.png"
              alt="Financial Assessment"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* The 8 Financial Pillars Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-nairawise-dark">The 8 Financial Pillars</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our assessment evaluates your financial health across these eight critical areas to provide a
              comprehensive view of your financial situation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialPillars.map((pillar) => (
              <Card key={pillar.id} className="border-t-4 border-nairawise-medium hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-nairawise-dark">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{pillar.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-nairawise-dark">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our assessment process is simple, quick, and designed to give you valuable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-nairawise-light flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <CardTitle>Complete the Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Answer questions about your financial habits, knowledge, and situation across the 8 pillars.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-nairawise-medium flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <CardTitle>Get Your Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive a detailed breakdown of your financial health with scores for each pillar.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-nairawise-dark flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <CardTitle>Take Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Follow personalized recommendations to improve your financial health in targeted areas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-nairawise-cream rounded-lg p-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-nairawise-dark">Ready to Improve Your Financial Health?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Take the first step toward financial wellness by completing our comprehensive assessment.
          </p>
          <div className="pt-2">
            <Link href="/assessment/user-info">
              <Button
                size="lg"
                className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                Begin Assessment Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
