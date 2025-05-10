"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { createServerClient } from "@/lib/supabase/server"
import type { Question, Answer } from "@/types/assessment"

export default function AssessmentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, Answer>>({})
  const [pillars, setPillars] = useState<{ id: string; name: string }[]>([])
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Check if user info exists in session storage
    const storedUserInfo = sessionStorage.getItem("userInfo")
    if (!storedUserInfo) {
      router.push("/assessment/user-info")
      return
    }

    const userInfo = JSON.parse(storedUserInfo)
    setUserId(userInfo.id)

    // Check if assessment is already in progress
    const storedAssessmentId = sessionStorage.getItem("currentAssessmentId")
    const storedAnswers = sessionStorage.getItem("currentAnswers")
    const storedPillarIndex = sessionStorage.getItem("currentPillarIndex")
    const storedQuestionIndex = sessionStorage.getItem("currentQuestionIndex")

    if (storedAssessmentId) {
      setAssessmentId(storedAssessmentId)
    }

    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers))
    }

    if (storedPillarIndex) {
      setCurrentPillarIndex(Number.parseInt(storedPillarIndex))
    }

    if (storedQuestionIndex) {
      setCurrentQuestionIndex(Number.parseInt(storedQuestionIndex))
    }

    loadQuestionsAndPillars()
  }, [router])

  const loadQuestionsAndPillars = async () => {
    try {
      setLoading(true)
      const supabase = createServerClient()

      // Fetch pillars
      const { data: pillarsData, error: pillarsError } = await supabase
        .from("pillars")
        .select("id, name")
        .order("order")

      if (pillarsError) throw pillarsError

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select(
          `
          id, 
          question_text, 
          pillar_id, 
          question_type,
          answers:question_answers(
            id,
            answer_text,
            score
          )
        `,
        )
        .order("order")

      if (questionsError) throw questionsError

      // Transform the data
      const formattedQuestions = questionsData.map((q) => ({
        id: q.id,
        text: q.question_text,
        pillarId: q.pillar_id,
        type: q.question_type,
        answers: q.answers.map((a: any) => ({
          id: a.id,
          text: a.answer_text,
          score: a.score,
        })),
      }))

      setPillars(pillarsData)
      setQuestions(formattedQuestions)
    } catch (error) {
      console.error("Error loading questions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Save current state to session storage whenever it changes
    if (assessmentId) {
      sessionStorage.setItem("currentAssessmentId", assessmentId)
    }
    sessionStorage.setItem("currentAnswers", JSON.stringify(answers))
    sessionStorage.setItem("currentPillarIndex", currentPillarIndex.toString())
    sessionStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString())
  }, [assessmentId, answers, currentPillarIndex, currentQuestionIndex])

  const getCurrentPillarQuestions = () => {
    if (!pillars.length || !questions.length) return []
    const currentPillarId = pillars[currentPillarIndex]?.id
    return questions.filter((q) => q.pillarId === currentPillarId)
  }

  const getCurrentQuestion = () => {
    const pillarQuestions = getCurrentPillarQuestions()
    return pillarQuestions[currentQuestionIndex] || null
  }

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const answer = question.answers.find((a) => a.id === answerId)
    if (!answer) return

    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        answerId,
        score: answer.score,
        pillarId: question.pillarId,
      },
    })
  }

  const handleMultiAnswerSelect = (questionId: string, answerId: string, isChecked: boolean) => {
    const currentAnswers = answers[questionId]?.selectedAnswers || []
    let newSelectedAnswers

    if (isChecked) {
      newSelectedAnswers = [...currentAnswers, answerId]
    } else {
      newSelectedAnswers = currentAnswers.filter((id) => id !== answerId)
    }

    // Calculate average score from all selected answers
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const selectedAnswerObjects = question.answers.filter((a) => newSelectedAnswers.includes(a.id))
    const totalScore = selectedAnswerObjects.reduce((sum, answer) => sum + answer.score, 0)
    const averageScore = newSelectedAnswers.length ? totalScore / newSelectedAnswers.length : 0

    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        selectedAnswers: newSelectedAnswers,
        score: averageScore,
        pillarId: question.pillarId,
      },
    })
  }

  const isAnswered = (questionId: string) => {
    return !!answers[questionId]
  }

  const isMultiAnswerSelected = (questionId: string, answerId: string) => {
    return answers[questionId]?.selectedAnswers?.includes(answerId) || false
  }

  const handleNext = async () => {
    const pillarQuestions = getCurrentPillarQuestions()
    const currentQuestion = getCurrentQuestion()

    if (!currentQuestion) return

    // If current question is not answered, don't proceed
    if (!isAnswered(currentQuestion.id)) {
      alert("Please answer the current question before proceeding.")
      return
    }

    // If there are more questions in the current pillar
    if (currentQuestionIndex < pillarQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      return
    }

    // If this is the last question of the last pillar, submit the assessment
    if (currentPillarIndex === pillars.length - 1) {
      await submitAssessment()
      return
    }

    // Move to the next pillar
    setCurrentPillarIndex(currentPillarIndex + 1)
    setCurrentQuestionIndex(0)
  }

  const handlePrevious = () => {
    // If there are previous questions in the current pillar
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      return
    }

    // If this is the first question of the first pillar, can't go back
    if (currentPillarIndex === 0) {
      return
    }

    // Move to the previous pillar
    setCurrentPillarIndex(currentPillarIndex - 1)
    const prevPillarQuestions = questions.filter((q) => q.pillarId === pillars[currentPillarIndex - 1]?.id)
    setCurrentQuestionIndex(prevPillarQuestions.length - 1)
  }

  const submitAssessment = async () => {
    try {
      if (!userId) {
        console.error("User ID not found")
        return
      }

      const supabase = createServerClient()

      // Calculate pillar scores
      const pillarScores: Record<string, { total: number; count: number }> = {}
      Object.values(answers).forEach((answer) => {
        if (!pillarScores[answer.pillarId]) {
          pillarScores[answer.pillarId] = { total: 0, count: 0 }
        }
        pillarScores[answer.pillarId].total += answer.score
        pillarScores[answer.pillarId].count += 1
      })

      // Calculate overall score (average of pillar scores)
      let overallTotal = 0
      let overallCount = 0

      const pillarScoreData = Object.entries(pillarScores).map(([pillarId, data]) => {
        const averageScore = data.total / data.count
        overallTotal += averageScore
        overallCount += 1
        return {
          pillar_id: pillarId,
          score: averageScore,
        }
      })

      const overallScore = overallCount > 0 ? overallTotal / overallCount : 0

      // Create or update assessment
      let assessmentData
      if (assessmentId) {
        // Update existing assessment
        const { data, error } = await supabase
          .from("assessments")
          .update({
            user_id: userId,
            overall_score: overallScore,
            completed_at: new Date().toISOString(),
          })
          .eq("id", assessmentId)
          .select()
          .single()

        if (error) throw error
        assessmentData = data
      } else {
        // Create new assessment
        const { data, error } = await supabase
          .from("assessments")
          .insert({
            user_id: userId,
            overall_score: overallScore,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error
        assessmentData = data
        setAssessmentId(assessmentData.id)
      }

      // Save pillar scores
      if (assessmentData) {
        // Delete existing pillar scores if updating
        if (assessmentId) {
          await supabase.from("assessment_pillar_scores").delete().eq("assessment_id", assessmentId)
        }

        // Insert pillar scores
        const pillarScoresWithAssessmentId = pillarScoreData.map((score) => ({
          ...score,
          assessment_id: assessmentData.id,
        }))

        const { error: pillarScoreError } = await supabase
          .from("assessment_pillar_scores")
          .insert(pillarScoresWithAssessmentId)

        if (pillarScoreError) throw pillarScoreError

        // Save question answers
        const answerData = Object.values(answers).map((answer) => ({
          assessment_id: assessmentData.id,
          question_id: answer.questionId,
          answer_id: answer.answerId,
          score: answer.score,
        }))

        // Delete existing answers if updating
        if (assessmentId) {
          await supabase.from("assessment_answers").delete().eq("assessment_id", assessmentId)
        }

        const { error: answerError } = await supabase.from("assessment_answers").insert(answerData)

        if (answerError) throw answerError

        // Clear session storage
        sessionStorage.removeItem("currentAssessmentId")
        sessionStorage.removeItem("currentAnswers")
        sessionStorage.removeItem("currentPillarIndex")
        sessionStorage.removeItem("currentQuestionIndex")

        // Redirect to results page
        router.push(`/assessment/results?id=${assessmentData.id}`)
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl">Loading assessment questions...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const pillarQuestions = getCurrentPillarQuestions()
  const currentPillar = pillars[currentPillarIndex]
  const progress = (
    (currentPillarIndex * 100) / pillars.length +
    (currentQuestionIndex * 100) / pillarQuestions.length / pillars.length
  ).toFixed(0)

  if (!currentQuestion || !currentPillar) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-red-600">Error loading questions. Please try again later.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Pillar {currentPillarIndex + 1} of {pillars.length}: {currentPillar.name}
            </span>
            <span>
              Question {currentQuestionIndex + 1} of {pillarQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-nairawise-medium h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold mb-6">{currentQuestion.text}</h2>

            <div className="space-y-4">
              {currentQuestion.type === "single"
                ? // Single choice questions
                  currentQuestion.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        answers[currentQuestion.id]?.answerId === answer.id
                          ? "border-nairawise-medium bg-nairawise-light/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, answer.id)}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                            answers[currentQuestion.id]?.answerId === answer.id
                              ? "border-nairawise-medium bg-nairawise-medium text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[currentQuestion.id]?.answerId === answer.id && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span>{answer.text}</span>
                      </div>
                    </div>
                  ))
                : // Multiple choice questions
                  currentQuestion.answers.map((answer) => (
                    <div
                      key={answer.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        isMultiAnswerSelected(currentQuestion.id, answer.id)
                          ? "border-nairawise-medium bg-nairawise-light/10"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          id={`checkbox-${answer.id}`}
                          checked={isMultiAnswerSelected(currentQuestion.id, answer.id)}
                          onCheckedChange={(checked) =>
                            handleMultiAnswerSelect(currentQuestion.id, answer.id, checked as boolean)
                          }
                          className="mr-3"
                        />
                        <label htmlFor={`checkbox-${answer.id}`} className="cursor-pointer flex-1">
                          {answer.text}
                        </label>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPillarIndex === 0 && currentQuestionIndex === 0}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <Button onClick={handleNext} className="bg-red-600 hover:bg-red-700 text-white flex items-center">
            {currentPillarIndex === pillars.length - 1 && currentQuestionIndex === pillarQuestions.length - 1
              ? "Complete Assessment"
              : "Next"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
