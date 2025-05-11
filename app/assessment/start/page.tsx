"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AssessmentStartPage() {
  const router = useRouter()

  const startAssessment = () => {
    router.push("/assessment/register")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nairawise-dark">Financial Health Assessment</h1>
          <p className="text-xl text-nairawise-dark/80 mb-6">
            Discover where you stand in your financial journey and get personalized recommendations
          </p>
          <div className="flex justify-center">
            <Button onClick={startAssessment} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              Start Your Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-nairawise-dark">Why Take This Assessment?</h2>
            <ul className="space-y-3">
              {[
                "Gain clarity on your current financial situation",
                "Identify your financial strengths and weaknesses",
                "Receive personalized recommendations for improvement",
                "Create a roadmap for achieving financial freedom",
                "Track your progress over time with follow-up assessments",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-nairawise-medium mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-nairawise-dark/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/images/financial-advisor-meeting.png"
              alt="Financial Assessment"
              width={400}
              height={300}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-nairawise-dark">The 8 Pillars of Financial Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: "Financial Awareness",
                description: "Understanding your current financial situation",
                icon: "/images/financial-awareness-icon.png",
              },
              {
                name: "Goal Setting",
                description: "Creating clear financial objectives",
                icon: "/images/goal-setting-icon.png",
              },
              {
                name: "Financial Habits",
                description: "Developing positive money routines",
                icon: "/images/financial-habits-icon.png",
              },
              {
                name: "Money Mindsets",
                description: "Cultivating healthy attitudes about money",
                icon: "/images/money-mindsets-icon.png",
              },
              {
                name: "Asset Building",
                description: "Growing your wealth through investments",
                icon: "/images/asset-building-icon.png",
              },
              {
                name: "Liability Management",
                description: "Handling debt and financial obligations",
                icon: "/images/liability-management-icon.png",
              },
              {
                name: "Income Streams",
                description: "Developing multiple sources of income",
                icon: "/images/income-streams-icon.png",
              },
              {
                name: "Expense Control",
                description: "Managing spending and budgeting effectively",
                icon: "/images/expense-control-icon.png",
              },
            ].map((pillar, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <Image
                      src={pillar.icon || "/placeholder.svg"}
                      alt={pillar.name}
                      width={64}
                      height={64}
                      className="h-16 w-16"
                    />
                  </div>
                  <h3 className="font-semibold text-nairawise-dark mb-1">{pillar.name}</h3>
                  <p className="text-sm text-nairawise-dark/70">{pillar.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={startAssessment} size="lg" className="bg-red-600 hover:bg-red-700 text-white">
            Start Your Assessment <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="mt-4 text-sm text-nairawise-dark/60">
            The assessment takes approximately 10-15 minutes to complete.
          </p>
        </div>
      </div>
    </div>
  )
}
