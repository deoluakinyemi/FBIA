import { createClientClient } from "./client"
import { createServerClient } from "./server"
import type { Database } from "./database.types"

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

// Function to create a user
export async function createUser(email: string, name: string, phone?: string, marketingConsent?: boolean) {
  const supabase = createClientClient()

  // First check if user exists
  const { data: existingUser, error: findError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .maybeSingle()

  if (findError) {
    console.error("Error finding user:", findError)
    throw findError
  }

  // If user exists, update their info
  if (existingUser) {
    const { data: updatedUser, error: updateError } = await supabase
      .from("users")
      .update({
        name,
        phone: phone || null,
        marketing_consent: marketingConsent || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingUser.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating user:", updateError)
      throw updateError
    }

    return updatedUser
  }

  // If user doesn't exist, create a new one
  const { data: newUser, error: createError } = await supabase
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

  if (createError) {
    console.error("Error creating user:", createError)
    throw createError
  }

  return newUser
}

// Function to create a new assessment
export async function createAssessment(userId: string, overallScore: number) {
  const supabase = createClientClient()

  try {
    // First, ensure we have a valid user in the database
    let validUserId = userId

    // Check if the userId is not a valid UUID (e.g., "user_1747230123251")
    if (userId.startsWith("user_")) {
      // Create a temporary user with this ID as a reference
      const tempEmail = `temp_${userId}@example.com`
      const tempName = `Temporary User ${userId}`

      // Create or get user
      const user = await createUser(tempEmail, tempName)
      validUserId = user.id
    }

    // Now create the assessment with the valid user ID
    const { data, error } = await supabase
      .from("assessments")
      .insert({
        user_id: validUserId,
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
  } catch (error) {
    console.error("Error in createAssessment:", error)
    throw error
  }
}

// Function to save pillar scores
export async function savePillarScores(assessmentId: string, scores: Record<string, number>) {
  const supabase = createClientClient()

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
  const supabase = createClientClient()

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
