"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser, createAssessment, savePillarScores, saveAnswers } from "@/lib/supabase/assessment-service"

export default function UserInfoPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Get answers from localStorage
      const answersJson = localStorage.getItem("assessmentAnswers")
      if (!answersJson) {
        throw new Error("No assessment data found. Please retake the assessment.")
      }

      const answers = JSON.parse(answersJson) as Record<string, { questionId: string; optionId: string; score: number }>

      // Calculate scores for each pillar
      const pillarScores: Record<string, number> = {}
      const pillarCounts: Record<string, number> = {}

      Object.entries(answers).forEach(([key, answer]) => {
        const [pillar] = key.split("-")

        if (!pillarScores[pillar]) {
          pillarScores[pillar] = 0
          pillarCounts[pillar] = 0
        }

        pillarScores[pillar] += answer.score
        pillarCounts[pillar]++
      })

      // Calculate average score for each pillar (normalized to 0-1)
      Object.keys(pillarScores).forEach((pillar) => {
        pillarScores[pillar] = pillarScores[pillar] / (pillarCounts[pillar] * 4) // Divide by max score per question (4)
      })

      // Calculate overall score
      const overallScore =
        Object.values(pillarScores).reduce((sum, score) => sum + score, 0) / Object.keys(pillarScores).length

      // Save to Supabase
      // 1. Create user
      const user = await createUser(email, name)

      // 2. Create assessment
      const assessment = await createAssessment(user.id, overallScore)

      // 3. Save pillar scores
      await savePillarScores(assessment.id, pillarScores)

      // 4. Save individual answers
      await saveAnswers(assessment.id, answers)

      // Store assessment ID for results page
      localStorage.setItem("currentAssessmentId", assessment.id)

      // Navigate to results
      router.push("/assessment/results")
    } catch (err) {
      console.error("Error submitting assessment:", err)
      setError(err instanceof Error ? err.message : "An error occurred while submitting your assessment.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Almost Done!</CardTitle>
          <CardDescription>
            Please provide your information to receive your personalized financial assessment results.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll use this to send you your results and follow-up recommendations.
              </p>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Get My Results"}{" "}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
