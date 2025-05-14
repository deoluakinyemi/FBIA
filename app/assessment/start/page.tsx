import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StartPage() {
  return (
    <div className="container max-w-4xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-nairawise-dark">Financial Health Assessment</h1>
        <p className="text-lg text-nairawise-dark/80 max-w-2xl mx-auto">
          This assessment will help you understand your current financial health across 8 key pillars and provide
          personalized recommendations for improvement.
        </p>
      </div>

      <div className="bg-nairawise-cream p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-bold mb-4 text-nairawise-dark">What to Expect</h2>
        <ul className="space-y-2 text-nairawise-dark/80">
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nairawise-dark text-white text-sm mr-2 flex-shrink-0">
              1
            </span>
            <span>The assessment takes approximately 5-10 minutes to complete.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nairawise-dark text-white text-sm mr-2 flex-shrink-0">
              2
            </span>
            <span>You'll answer questions about your financial awareness, goals, habits, and more.</span>
          </li>
          <li className="flex items-start">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-nairawise-dark text-white text-sm mr-2 flex-shrink-0">
              3
            </span>
            <span>You'll receive a personalized report with scores and recommendations.</span>
          </li>
        </ul>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-xl font-bold mb-4 text-nairawise-dark">The 8 Financial Pillars</h2>
          <ul className="space-y-2 text-nairawise-dark/80">
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Financial Awareness</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Goal Setting</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Financial Habits</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Money Mindsets</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Asset Building</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Liability Management</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Income Streams</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-nairawise-dark mr-2"></div>
              <span>Expense Control</span>
            </li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <Image
            src="/images/financial-planning-illustration.png"
            alt="Financial Planning"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="text-center">
        <Link href="/assessment/user-info">
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-8 py-6 shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            Begin Assessment
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
