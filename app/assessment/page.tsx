"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  getAllQuestionsWithOptions,
  createAssessment,
  savePillarScores,
  saveAnswers,
} from "@/lib/supabase/assessment-service"

// Define types locally to avoid import issues
interface Option {
  id: string
  option_text: string
  score: number
}

interface Question {
  id: string
  question: string
  options: Option[]
}

interface UserInfo {
  id: string
  name: string
  email: string
  phone?: string
  marketingConsent?: boolean
}

// Mock questions for fallback
const mockQuestions = {
  awareness: [
    {
      id: "q1",
      question: "How would you rate your understanding of your current financial situation?",
      options: [
        { id: "q1a1", option_text: "Very poor - I have no idea about my finances", score: 0.1 },
        { id: "q1a2", option_text: "Poor - I have a vague idea but many gaps", score: 0.3 },
        { id: "q1a3", option_text: "Average - I understand the basics of my finances", score: 0.5 },
        { id: "q1a4", option_text: "Good - I have a solid understanding of my finances", score: 0.7 },
        { id: "q1a5", option_text: "Excellent - I have complete knowledge of my finances", score: 0.9 },
      ],
    },
    {
      id: "q2",
      question: "How often do you review your financial statements?",
      options: [
        { id: "q2a1", option_text: "Never", score: 0.1 },
        { id: "q2a2", option_text: "Rarely (once a year or less)", score: 0.3 },
        { id: "q2a3", option_text: "Sometimes (every few months)", score: 0.5 },
        { id: "q2a4", option_text: "Often (monthly)", score: 0.7 },
        { id: "q2a5", option_text: "Very frequently (weekly or more)", score: 0.9 },
      ],
    },
  ],
  goals: [
    {
      id: "q3",
      question: "Do you have clearly defined financial goals?",
      options: [
        { id: "q3a1", option_text: "No goals at all", score: 0.1 },
        { id: "q3a2", option_text: "Vague ideas but nothing specific", score: 0.3 },
        { id: "q3a3", option_text: "Some goals but not well-defined", score: 0.5 },
        { id: "q3a4", option_text: "Several clear goals", score: 0.7 },
        { id: "q3a5", option_text: "Comprehensive, specific goals with timelines", score: 0.9 },
      ],
    },
    {
      id: "q4",
      question: "How often do you review and adjust your financial goals?",
      options: [
        { id: "q4a1", option_text: "Never", score: 0.1 },
        { id: "q4a2", option_text: "Rarely (once a year or less)", score: 0.3 },
        { id: "q4a3", option_text: "Sometimes (every few months)", score: 0.5 },
        { id: "q4a4", option_text: "Often (monthly)", score: 0.7 },
        { id: "q4a5", option_text: "Very frequently (weekly or more)", score: 0.9 },
      ],
    },
  ],
  habits: [
    {
      id: "q5",
      question: "How consistently do you follow a budget?",
      options: [
        { id: "q5a1", option_text: "I don't have a budget", score: 0.1 },
        { id: "q5a2", option_text: "I have a budget but rarely follow it", score: 0.3 },
        { id: "q5a3", option_text: "I follow my budget sometimes", score: 0.5 },
        { id: "q5a4", option_text: "I follow my budget most of the time", score: 0.7 },
        { id: "q5a5", option_text: "I strictly follow my budget all the time", score: 0.9 },
      ],
    },
    {
      id: "q6",
      question: "How often do you save money?",
      options: [
        { id: "q6a1", option_text: "Never", score: 0.1 },
        { id: "q6a2", option_text: "Rarely (when I have extra money)", score: 0.3 },
        { id: "q6a3", option_text: "Sometimes (not consistently)", score: 0.5 },
        { id: "q6a4", option_text: "Often (most months)", score: 0.7 },
        { id: "q6a5", option_text: "Always (every month without fail)", score: 0.9 },
      ],
    },
  ],
  mindsets: [
    {
      id: "q7",
      question: "How do you view money in your life?",
      options: [
        { id: "q7a1", option_text: "Money is always a source of stress and worry", score: 0.1 },
        { id: "q7a2", option_text: "Money is often a problem in my life", score: 0.3 },
        { id: "q7a3", option_text: "Money is a necessary tool but I'm neutral about it", score: 0.5 },
        { id: "q7a4", option_text: "Money is an opportunity for growth and security", score: 0.7 },
        { id: "q7a5", option_text: "Money is a positive force that enables my goals", score: 0.9 },
      ],
    },
    {
      id: "q8",
      question: "How confident are you in making financial decisions?",
      options: [
        { id: "q8a1", option_text: "Not confident at all - I avoid financial decisions", score: 0.1 },
        { id: "q8a2", option_text: "Slightly confident - I make decisions but with great anxiety", score: 0.3 },
        { id: "q8a3", option_text: "Moderately confident - I can make basic decisions", score: 0.5 },
        { id: "q8a4", option_text: "Very confident - I make most decisions with ease", score: 0.7 },
        { id: "q8a5", option_text: "Extremely confident - I make all financial decisions comfortably", score: 0.9 },
      ],
    },
  ],
}

export default function AssessmentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [questions, setQuestions] = useState<Record<string, Question[]>>({})
  const [pillars, setPillars] = useState<string[]>([])
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { questionId: string; optionId: string; score: number }>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  // One-time initialization
  useEffect(() => {
    // Check if user info exists
    const userInfoStr = localStorage.getItem("userInfo")
    if (!userInfoStr) {
      // Redirect to user info page if no user info
      router.push("/assessment/user-info")
      return
    }

    try {
      // Parse user info
      const parsedUserInfo = JSON.parse(userInfoStr) as UserInfo
      setUserInfo(parsedUserInfo)

      // Load questions
      const loadQuestions = async () => {
        try {
          const questionsData = await getAllQuestionsWithOptions()

          if (questionsData && Object.keys(questionsData).length > 0) {
            setQuestions(questionsData)
            setPillars(Object.keys(questionsData))
          } else {
            console.log("No questions returned from Supabase, using mock data")
            setQuestions(mockQuestions)
            setPillars(Object.keys(mockQuestions))
          }

          setLoading(false)
        } catch (err) {
          console.error("Error loading questions:", err)
          setQuestions(mockQuestions)
          setPillars(Object.keys(mockQuestions))
          setLoading(false)
        }
      }

      loadQuestions()
    } catch (err) {
      console.error("Error parsing user info:", err)
      router.push("/assessment/user-info")
    }
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
    if (!selectedOption || !currentQuestion || !userInfo) return

    // Save the answer
    const questionId = currentQuestion.id
    const optionId = selectedOption
    const selectedOptionObj = currentQuestion.options.find((opt) => opt.id === optionId)
    const score = selectedOptionObj ? selectedOptionObj.score : 0

    const answerKey = `${currentPillar}-${currentQuestionIndex}`
    const updatedAnswers = {
      ...answers,
      [answerKey]: {
        questionId,
        optionId,
        score,
      },
    }

    setAnswers(updatedAnswers)

    // Move to next question or pillar
    if (isLastQuestionInPillar) {
      if (isLastPillar) {
        // Assessment complete, save to localStorage temporarily
        localStorage.setItem("assessmentAnswers", JSON.stringify(updatedAnswers))

        // Save assessment to Supabase and navigate to results
        saveAssessmentToSupabase(updatedAnswers, userInfo)
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

  // Function to save assessment to Supabase
  const saveAssessmentToSupabase = async (
    assessmentAnswers: Record<string, { questionId: string; optionId: string; score: number }>,
    user: UserInfo,
  ) => {
    try {
      // Calculate pillar scores
      const pillarScores: Record<string, number> = {}
      const pillarQuestionCounts: Record<string, number> = {}

      // Calculate total score for each pillar
      Object.entries(assessmentAnswers).forEach(([key, answer]) => {
        const pillarName = key.split("-")[0]

        if (!pillarScores[pillarName]) {
          pillarScores[pillarName] = 0
          pillarQuestionCounts[pillarName] = 0
        }

        pillarScores[pillarName] += answer.score
        pillarQuestionCounts[pillarName]++
      })

      // Calculate average score for each pillar
      Object.keys(pillarScores).forEach((pillar) => {
        pillarScores[pillar] = pillarScores[pillar] / pillarQuestionCounts[pillar]
      })

      // Calculate overall score (average of pillar scores)
      const overallScore =
        Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.values(pillarScores).length

      // Create assessment record
      const assessment = await createAssessment(user.id, overallScore)

      // Save pillar scores
      await savePillarScores(assessment.id, pillarScores)

      // Format answers for saving
      const formattedAnswers: Record<string, { questionId: string; optionId: string }> = {}
      Object.entries(assessmentAnswers).forEach(([key, answer]) => {
        formattedAnswers[key] = {
          questionId: answer.questionId,
          optionId: answer.optionId,
        }
      })

      // Save individual answers
      await saveAnswers(assessment.id, formattedAnswers)

      // Store assessment ID for results page
      localStorage.setItem("currentAssessmentId", assessment.id)

      // Navigate to results page
      router.push("/assessment/results")
    } catch (error) {
      console.error("Error saving assessment:", error)
      toast({
        title: "Error saving assessment",
        description: "There was a problem saving your assessment. Please try again.",
        variant: "destructive",
      })
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-nairawise-dark">Financial Assessment</h1>
        </div>
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
