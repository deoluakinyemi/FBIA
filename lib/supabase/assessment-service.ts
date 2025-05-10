import { createClientClient } from "./client"
import { createServerClient } from "./server"
import type { Database } from "./database.types"
import { sendAssessmentResultsEmail as sendEmail } from "@/lib/email-service"

export type Pillar = Database["public"]["Tables"]["pillars"]["Row"]
export type Question = Database["public"]["Tables"]["questions"]["Row"] & {
  options: Database["public"]["Tables"]["options"]["Row"][]
}
export type Assessment = Database["public"]["Tables"]["assessments"]["Row"]
export type PillarScore = Database["public"]["Tables"]["pillar_scores"]["Row"]
export type Answer = Database["public"]["Tables"]["answers"]["Row"]
export type User = Database["public"]["Tables"]["users"]["Row"]

// Function to get all pillars
export async function getPillars() {
  const supabase = createClientClient()
  const { data, error } = await supabase.from("pillars").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching pillars:", error)
    return []
  }

  return data
}

// Function to get questions for a specific pillar
export async function getQuestionsForPillar(pillarId: string) {
  const supabase = createClientClient()
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("pillar_id", pillarId)
    .order("display_order", { ascending: true })

  if (questionsError) {
    console.error("Error fetching questions:", questionsError)
    return []
  }

  // For each question, get its options
  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const { data: options, error: optionsError } = await supabase
        .from("options")
        .select("*")
        .eq("question_id", question.id)
        .order("display_order", { ascending: true })

      if (optionsError) {
        console.error("Error fetching options:", optionsError)
        return { ...question, options: [] }
      }

      return { ...question, options }
    }),
  )

  return questionsWithOptions
}

// Function to get all questions with their options
export async function getAllQuestionsWithOptions() {
  const supabase = createClientClient()
  const { data: pillars, error: pillarsError } = await supabase
    .from("pillars")
    .select("*")
    .order("display_order", { ascending: true })

  if (pillarsError) {
    console.error("Error fetching pillars:", pillarsError)
    return {}
  }

  const result: Record<string, Question[]> = {}

  for (const pillar of pillars) {
    const questions = await getQuestionsForPillar(pillar.id)
    result[pillar.slug] = questions
  }

  return result
}

// Update the createUser function to include phone and marketing consent
export async function createUser(email: string, name: string, phone?: string, marketingConsent?: boolean) {
  const supabase = createClientClient()
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        name,
        phone: phone || null,
        marketing_consent: marketingConsent || false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

// Function to create a new assessment
export async function createAssessment(userId: string, overallScore: number) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("assessments")
    .insert({
      user_id: userId,
      overall_score: overallScore,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating assessment:", error)
    throw error
  }

  return data
}

// Function to save pillar scores
export async function savePillarScores(assessmentId: string, scores: Record<string, number>) {
  const supabase = createServerClient()

  // Get all pillars
  const { data: pillars, error: pillarsError } = await supabase.from("pillars").select("id, slug")

  if (pillarsError) {
    console.error("Error fetching pillars:", pillarsError)
    throw pillarsError
  }

  // Create pillar score records
  const pillarScores = Object.entries(scores)
    .map(([pillarSlug, score]) => {
      const pillar = pillars?.find((p) => p.slug === pillarSlug)
      if (!pillar) return null

      return {
        assessment_id: assessmentId,
        pillar_id: pillar.id,
        score,
      }
    })
    .filter(Boolean)

  const { error } = await supabase.from("pillar_scores").insert(pillarScores)

  if (error) {
    console.error("Error saving pillar scores:", error)
    throw error
  }

  return { success: true }
}

// Function to save individual answers
export async function saveAnswers(
  assessmentId: string,
  answers: Record<string, { questionId: string; optionId: string }>,
) {
  const supabase = createServerClient()

  const answerRecords = Object.entries(answers).map(([, value]) => ({
    assessment_id: assessmentId,
    question_id: value.questionId,
    option_id: value.optionId,
  }))

  const { error } = await supabase.from("answers").insert(answerRecords)

  if (error) {
    console.error("Error saving answers:", error)
    throw error
  }

  return { success: true }
}

// Function to get recommendations for a score
export async function getRecommendationsForScore(pillarId: string, score: number) {
  const supabase = createClientClient()
  const { data, error } = await supabase
    .from("recommendations")
    .select("*")
    .eq("pillar_id", pillarId)
    .lte("score_range_min", score)
    .gte("score_range_max", score)

  if (error) {
    console.error("Error fetching recommendations:", error)
    return []
  }

  return data
}

// Admin functions

// Function to get all assessments with user info
export async function getAllAssessments() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from("assessments")
    .select(`
      *,
      users (*)
    `)
    .order("completed_at", { ascending: false })

  if (error) {
    console.error("Error fetching assessments:", error)
    return []
  }

  return data
}

// Function to get a specific assessment with all details
export async function getAssessmentDetails(assessmentId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("assessments")
    .select(`
      *,
      users (
        id,
        name,
        email,
        phone,
        marketing_consent
      ),
      pillarScores: pillar_scores (
        id,
        pillar_id,
        score,
        pillars (
          id,
          name,
          slug
        )
      ),
      answers (
        id,
        question_id,
        option_id,
        questions (
          id,
          question,
          pillar_id
        ),
        options (
          id,
          option_text,
          score
        )
      )
    `)
    .eq("id", assessmentId)
    .single()

  if (error) {
    console.error("Error fetching assessment details:", error)
    throw error
  }

  return data
}

// Function to send assessment results email
export async function sendAssessmentResultsEmail(assessmentId: string) {
  try {
    const assessment = await getAssessmentDetails(assessmentId)

    if (!assessment || !assessment.users?.email) {
      throw new Error("Assessment or user email not found")
    }

    await sendEmail(assessment.users.email, assessment.users.name || "User", assessmentId, assessment.overall_score)

    return { success: true }
  } catch (error) {
    console.error("Error sending assessment results email:", error)
    throw error
  }
}
