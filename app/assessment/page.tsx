"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getQuestions } from "@/lib/admin-questions"

export default function AssessmentPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Record<string, any>>({})
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load questions
    const loadedQuestions = getQuestions()
    setQuestions(loadedQuestions)
    setLoading(false)
  }, [])

  if (loading) {
    return <div className="container py-12 text-center">Loading assessment questions...</div>
  }

  const pillars = Object.keys(questions)
  const currentPillar = pillars[currentPillarIndex]
  const currentPillarQuestions = questions[currentPillar]
  const currentQuestion = currentPillarQuestions[currentQuestionIndex]

  const totalQuestions = Object.values(questions).reduce((acc, pillarQuestions) => acc + pillarQuestions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

  const isLastQuestionInPillar = currentQuestionIndex === currentPillarQuestions.length - 1
  const isLastPillar = currentPillarIndex === pillars.length - 1

  const handleNext = () => {
    if (!selectedOption) return

    // Save the answer
    const questionId = `${currentPillar}-${currentQuestionIndex}`
    setAnswers({ ...answers, [questionId]: Number.parseInt(selectedOption) })

    // Move to next question or pillar
    if (isLastQuestionInPillar) {
      if (isLastPillar) {
        // Assessment complete, navigate to results
        localStorage.setItem(
          "assessmentResults",
          JSON.stringify({ ...answers, [questionId]: Number.parseInt(selectedOption) }),
        )

        // Increment completed assessments count
        const completedAssessments = localStorage.getItem("completedAssessments")
          ? Number.parseInt(localStorage.getItem("completedAssessments") || "0") + 1
          : 1
        localStorage.setItem("completedAssessments", completedAssessments.toString())

        router.push("/assessment/results")
      } else {
        // Move to next pillar
        setCurrentPillarIndex(currentPillarIndex + 1)
        setCurrentQuestionIndex(0)
        setSelectedOption(null)
      }
    } else {
      // Move to next question in current pillar
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    } else if (currentPillarIndex > 0) {
      setCurrentPillarIndex(currentPillarIndex - 1)
      setCurrentQuestionIndex(questions[pillars[currentPillarIndex - 1]].length - 1)
    }

    // Restore previous answer if available
    const prevQuestionId =
      currentQuestionIndex > 0
        ? `${currentPillar}-${currentQuestionIndex - 1}`
        : `${pillars[currentPillarIndex - 1]}-${questions[pillars[currentPillarIndex - 1]].length - 1}`

    setSelectedOption(answers[prevQuestionId]?.toString() || null)
  }

  const getPillarTitle = (pillarKey: string) => {
    const titles: Record<string, string> = {
      awareness: "Financial Awareness",
      goals: "Goal Setting",
      habits: "Financial Habits",
      mindsets: "Money Mindsets",
      assets: "Asset Building",
      liabilities: "Liability Management",
      income: "Income Streams",
      expenses: "Expense Control",
    }
    return titles[pillarKey] || pillarKey
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Financial Assessment</h1>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress: {Math.round(progress)}%</span>
            <span>
              Pillar: {currentPillarIndex + 1}/{pillars.length} - {getPillarTitle(currentPillar)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
            {currentQuestion.options.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPillarIndex === 0 && currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedOption}>
            {isLastPillar && isLastQuestionInPillar ? "Complete" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
