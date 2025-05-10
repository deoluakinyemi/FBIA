"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getAllQuestionsWithOptions } from "@/lib/supabase/assessment-service"
import type { Question } from "@/lib/supabase/assessment-service"

export default function AssessmentPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [pillars, setPillars] = useState<string[]>([])
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { questionId: string; optionId: string; score: number }>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user info exists
    const currentUserId = localStorage.getItem("currentUserId")

    if (!currentUserId) {
      // Redirect to start page if no user info
      router.push("/assessment/start")
      return
    }

    setUserId(currentUserId)

    async function loadQuestions() {
      try {
        const questionsData = await getAllQuestionsWithOptions()
        setQuestions(questionsData)
        setPillars(Object.keys(questionsData))
        setLoading(false)
      } catch (error) {
        console.error("Error loading questions:", error)
        setLoading(false)
      }
    }

    loadQuestions()
  }, [router])

  if (loading) {
    return <div className="container py-12 text-center">Loading assessment questions...</div>
  }

  if (pillars.length === 0) {
    return <div className="container py-12 text-center">No questions found. Please try again later.</div>
  }

  const currentPillar = pillars[currentPillarIndex]
  const currentPillarQuestions = questions[currentPillar] || []
  const currentQuestion = currentPillarQuestions[currentQuestionIndex]

  if (!currentQuestion) {
    return <div className="container py-12 text-center">Question not found. Please try again later.</div>
  }

  const totalQuestions = Object.values(questions).reduce((acc, pillarQuestions) => acc + pillarQuestions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = (answeredQuestions / totalQuestions) * 100

  const isLastQuestionInPillar = currentQuestionIndex === currentPillarQuestions.length - 1
  const isLastPillar = currentPillarIndex === pillars.length - 1

  const handleNext = () => {
    if (!selectedOption) return

    // Save the answer
    const questionId = currentQuestion.id
    const optionId = selectedOption
    const selectedOptionObj = currentQuestion.options.find((opt) => opt.id === optionId)
    const score = selectedOptionObj ? selectedOptionObj.score : 0

    const answerKey = `${currentPillar}-${currentQuestionIndex}`
    setAnswers({
      ...answers,
      [answerKey]: {
        questionId,
        optionId,
        score,
      },
    })

    // Move to next question or pillar
    if (isLastQuestionInPillar) {
      if (isLastPillar) {
        // Assessment complete, save to localStorage temporarily
        localStorage.setItem(
          "assessmentAnswers",
          JSON.stringify({
            ...answers,
            [answerKey]: {
              questionId,
              optionId,
              score,
            },
          }),
        )

        // Navigate to results page - we already have user info
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
      const prevPillarQuestions = questions[pillars[currentPillarIndex - 1]] || []
      setCurrentQuestionIndex(prevPillarQuestions.length - 1)
    }

    // Restore previous answer if available
    const prevQuestionId =
      currentQuestionIndex > 0
        ? `${currentPillar}-${currentQuestionIndex - 1}`
        : `${pillars[currentPillarIndex - 1]}-${(questions[pillars[currentPillarIndex - 1]] || []).length - 1}`

    const prevAnswer = answers[prevQuestionId]
    setSelectedOption(prevAnswer?.optionId || null)
  }

  const getPillarTitle = (pillarSlug: string) => {
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
    return pillarTitles[pillarSlug] || pillarSlug
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
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
                  {option.option_text}
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
