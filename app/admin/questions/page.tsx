"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Edit, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { questions as defaultQuestions } from "@/lib/questions"

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Record<string, any>>(defaultQuestions)
  const [activeTab, setActiveTab] = useState("awareness")

  useEffect(() => {
    // Load questions from localStorage if they exist
    const savedQuestions = localStorage.getItem("adminQuestions")
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  const pillars = Object.keys(questions)

  const pillarTitles: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Questions</h2>
        <Link href="/admin/questions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Question
          </Button>
        </Link>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8">
          {pillars.map((pillar) => (
            <TabsTrigger key={pillar} value={pillar}>
              {pillarTitles[pillar] || pillar}
            </TabsTrigger>
          ))}
        </TabsList>

        {pillars.map((pillar) => (
          <TabsContent key={pillar} value={pillar} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{pillarTitles[pillar] || pillar}</CardTitle>
                <CardDescription>
                  Manage questions for the {pillarTitles[pillar].toLowerCase() || pillar} pillar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions[pillar].map((question: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="py-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{question.question}</CardTitle>
                        <Link href={`/admin/questions/${pillar}/${index}`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <h4 className="text-sm font-medium mb-2">Answer Options:</h4>
                      <ol className="list-decimal pl-5 space-y-1">
                        {question.options.map((option: string, optIndex: number) => (
                          <li key={optIndex} className="text-sm">
                            {option}
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
