import { createClient } from "./client"
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
  const supabase = createClient()
  const { data, error } = await supabase.from("pillars").select("*").order("display_order", { ascending: true })

  if (error) {
    console.error("Error fetching pillars:", error)
    return []
  }

  return data
}

// Function to get questions for a specific pillar
export async function getQuestionsForPillar(pillarId: string) {
  const supabase = createClient()
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
  const supabase = createClient()
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

// Function to create a new user
export async function createUser(email: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("users").insert([{ email, name }]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    throw error
  }

  return data
}

// Function to create a new assessment
export async function createAssessment(userId: string, overallScore: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("assessments")
    .insert([{ user_id: userId, overall_score: overallScore }])
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
  const supabase = createClient()

  // First, get all pillars to map slug to ID
  const { data: pillars, error: pillarsError } = await supabase.from("pillars").select("id, slug")

  if (pillarsError) {
    console.error("Error fetching pillars:", pillarsError)
    throw pillarsError
  }

  const pillarMap = pillars.reduce(
    (acc, pillar) => {
      acc[pillar.slug] = pillar.id
      return acc
    },
    {} as Record<string, string>,
  )

  // Prepare pillar scores for insertion
  const pillarScores = Object.entries(scores).map(([slug, score]) => ({
    assessment_id: assessmentId,
    pillar_id: pillarMap[slug],
    score,
  }))

  const { data, error } = await supabase.from("pillar_scores").insert(pillarScores)

  if (error) {
    console.error("Error saving pillar scores:", error)
    throw error
  }

  return data
}

// Function to save individual answers
export async function saveAnswers(
  assessmentId: string,
  answers: Record<string, { questionId: string; optionId: string }>,
) {
  const supabase = createClient()

  // Prepare answers for insertion
  const answerRecords = Object.values(answers).map(({ questionId, optionId }) => ({
    assessment_id: assessmentId,
    question_id: questionId,
    option_id: optionId,
  }))

  const { data, error } = await supabase.from("answers").insert(answerRecords)

  if (error) {
    console.error("Error saving answers:", error)
    throw error
  }

  return data
}

// Function to get recommendations for a score
export async function getRecommendationsForScore(pillarId: string, score: number) {
  const supabase = createClient()
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

  // Get the assessment with user info
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select(`
      *,
      users (*)
    `)
    .eq("id", assessmentId)
    .single()

  if (assessmentError) {
    console.error("Error fetching assessment:", assessmentError)
    return null
  }

  // Get pillar scores
  const { data: pillarScores, error: pillarScoresError } = await supabase
    .from("pillar_scores")
    .select(`
      *,
      pillars (*)
    `)
    .eq("assessment_id", assessmentId)

  if (pillarScoresError) {
    console.error("Error fetching pillar scores:", pillarScoresError)
    return { ...assessment, pillarScores: [] }
  }

  // Get answers with question and option details
  const { data: answers, error: answersError } = await supabase
    .from("answers")
    .select(`
      *,
      questions (*),
      options (*)
    `)
    .eq("assessment_id", assessmentId)

  if (answersError) {
    console.error("Error fetching answers:", answersError)
    return { ...assessment, pillarScores, answers: [] }
  }

  return { ...assessment, pillarScores, answers }
}
