import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AssessmentStartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Financial Health Assessment</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover your financial strengths and areas for improvement with our comprehensive assessment
          </p>
          <div className="flex justify-center">
            <Link href="/assessment/user-info">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg flex items-center gap-2">
                Start Your Assessment <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">What You'll Discover</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-nairawise-medium mr-2 mt-0.5" />
                  <span>Your overall financial health score</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-nairawise-medium mr-2 mt-0.5" />
                  <span>Detailed breakdown across 8 financial pillars</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-nairawise-medium mr-2 mt-0.5" />
                  <span>Personalized recommendations for improvement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-nairawise-medium mr-2 mt-0.5" />
                  <span>Actionable steps to enhance your financial wellbeing</span>
                </li>
              </ul>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/financial-advisor-meeting.png"
                alt="Financial Assessment"
                width={500}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">The 8 Financial Pillars</h2>
          <p className="text-center mb-8 text-gray-600">
            Our assessment evaluates your financial health across these critical areas
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/income-streams-icon.png"
                  alt="Income Streams"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Income Streams</h3>
                <p className="text-sm text-gray-600">Evaluating your sources of income and their stability</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/expense-control-icon.png"
                  alt="Expense Control"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Expense Control</h3>
                <p className="text-sm text-gray-600">Managing your spending habits and budget discipline</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/asset-building-icon.png"
                  alt="Asset Building"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Asset Building</h3>
                <p className="text-sm text-gray-600">Growing your wealth through investments and assets</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/liability-management-icon.png"
                  alt="Liability Management"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Liability Management</h3>
                <p className="text-sm text-gray-600">Handling debts and financial obligations effectively</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/financial-habits-icon.png"
                  alt="Financial Habits"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Financial Habits</h3>
                <p className="text-sm text-gray-600">Your daily financial behaviors and practices</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image src="/images/goal-setting-icon.png" alt="Goal Setting" width={64} height={64} className="mb-3" />
                <h3 className="font-bold mb-2">Goal Setting</h3>
                <p className="text-sm text-gray-600">Planning for future financial milestones</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/retirement-planning.png"
                  alt="Retirement Planning"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Retirement Planning</h3>
                <p className="text-sm text-gray-600">Preparing for financial security in later years</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <Image
                  src="/images/investment-advisor.png"
                  alt="Financial Knowledge"
                  width={64}
                  height={64}
                  className="mb-3"
                />
                <h3 className="font-bold mb-2">Financial Knowledge</h3>
                <p className="text-sm text-gray-600">Understanding key financial concepts and principles</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Assess Your Financial Health?</h2>
          <p className="text-gray-600 mb-6">
            The assessment takes approximately 10-15 minutes to complete and provides immediate results.
          </p>
          <Link href="/assessment/user-info">
            <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg flex items-center gap-2">
              Start Your Assessment <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
