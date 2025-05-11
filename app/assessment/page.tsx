"use client"

import { useEffect, useState } from "react"
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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user info exists in session storage
    const userInfo = sessionStorage.getItem("userInfo")

    if (!userInfo) {
      // Redirect to registration page if no user info
      router.push("/assessment/register")
      return
    }

    async function loadQuestions() {
      try {
        setLoading(true)
        const questionsData = await getAllQuestionsWithOptions()

        if (Object.keys(questionsData).length === 0) {
          setError("No questions found. Please try again later.")
          return
        }

        setQuestions(questionsData)
        setPillars(Object.keys(questionsData))
      } catch (err) {
        console.error("Error loading questions:", err)
        setError("Failed to load assessment questions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [router])

  // Check if we have a current question
  const currentPillar = pillars[currentPillarIndex]
  const currentPillarQuestions = questions[currentPillar] || []
  const currentQuestion = currentPillarQuestions[currentQuestionIndex]

  // Calculate progress
  const totalQuestions = Object.values(questions).reduce((acc, pillarQuestions) => acc + pillarQuestions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

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
        // Assessment complete, save to sessionStorage temporarily
        sessionStorage.setItem(
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

        // Navigate to results page
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

  if (loading) {
    return (
      <div className="container py-12 text-center">
        <p className="text-xl text-nairawise-dark">Loading assessment questions...</p>
        <Progress value={100} className="h-2 mt-4 max-w-md mx-auto animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-nairawise-dark">Error</h1>
        <p className="mb-6 text-nairawise-dark/80">{error}</p>
        <Button onClick={() => router.push("/assessment/start")} className="bg-red-600 hover:bg-red-700 text-white">
          Try Again
        </Button>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4 text-nairawise-dark">No Questions Available</h1>
        <p className="mb-6 text-nairawise-dark/80">
          We couldn't find any questions for this assessment. Please try again later.
        </p>
        <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700 text-white">
          Return to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold text-nairawise-dark">Financial Assessment</h1>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-nairawise-dark/80">Progress: {Math.round(progress)}%</span>
            <span className="text-nairawise-dark/80">
              Pillar: {currentPillarIndex + 1}/{pillars.length} - {getPillarTitle(currentPillar)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-nairawise-dark">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption}>
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 py-2">
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer text-nairawise-dark/90">
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
            className="border-nairawise-dark text-nairawise-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={handleNext} disabled={!selectedOption} className="bg-red-600 hover:bg-red-700 text-white">
            {isLastPillar && isLastQuestionInPillar ? "Complete" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <p className="text-center text-sm text-nairawise-dark/60">
        Question {currentQuestionIndex + 1} of {currentPillarQuestions.length} in this section
      </p>
    </div>
  )
}
