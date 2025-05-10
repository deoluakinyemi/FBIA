import { createClient } from "./client"
import { createServerClient } from "./server"
import type { Database } from "./database.types"

export type ProgressGoal = Database["public"]["Tables"]["progress_goals"]["Row"]
export type DashboardSettings = Database["public"]["Tables"]["user_dashboard_settings"]["Row"]

// Get user dashboard settings
export async function getUserDashboardSettings(userId: string) {
  const supabase = createClient()

  // Check if settings exist
  const { data: existingSettings, error: checkError } = await supabase
    .from("user_dashboard_settings")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (checkError && checkError.code !== "PGRST116") {
    console.error("Error checking dashboard settings:", checkError)
    throw checkError
  }

  // If settings don't exist, create default settings
  if (!existingSettings) {
    const { data: newSettings, error: createError } = await supabase
      .from("user_dashboard_settings")
      .insert([
        {
          user_id: userId,
          show_progress_chart: true,
          show_recommendations: true,
          default_view: "overview",
        },
      ])
      .select()
      .single()

    if (createError) {
      console.error("Error creating dashboard settings:", createError)
      throw createError
    }

    return newSettings
  }

  return existingSettings
}

// Update user dashboard settings
export async function updateUserDashboardSettings(
  userId: string,
  settings: Partial<Omit<DashboardSettings, "id" | "user_id" | "created_at" | "updated_at">>,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_dashboard_settings")
    .update(settings)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error("Error updating dashboard settings:", error)
    throw error
  }

  return data
}

// Get user progress goals
export async function getUserProgressGoals(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("progress_goals")
    .select(`
      *,
      pillars (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching progress goals:", error)
    throw error
  }

  return data
}

// Create a new progress goal
export async function createProgressGoal(
  userId: string,
  goal: Omit<ProgressGoal, "id" | "user_id" | "completed" | "completed_at" | "created_at" | "updated_at">,
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("progress_goals")
    .insert([
      {
        user_id: userId,
        ...goal,
        completed: false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating progress goal:", error)
    throw error
  }

  return data
}

// Update a progress goal
export async function updateProgressGoal(
  goalId: string,
  updates: Partial<Omit<ProgressGoal, "id" | "user_id" | "created_at" | "updated_at">>,
) {
  const supabase = createClient()

  const { data, error } = await supabase.from("progress_goals").update(updates).eq("id", goalId).select().single()

  if (error) {
    console.error("Error updating progress goal:", error)
    throw error
  }

  return data
}

// Delete a progress goal
export async function deleteProgressGoal(goalId: string) {
  const supabase = createClient()

  const { error } = await supabase.from("progress_goals").delete().eq("id", goalId)

  if (error) {
    console.error("Error deleting progress goal:", error)
    throw error
  }

  return true
}

// Get assessment history for a user
export async function getUserAssessmentHistory(userId: string) {
  const supabase = createServerClient()

  const { data: assessments, error: assessmentsError } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false })

  if (assessmentsError) {
    console.error("Error fetching assessment history:", assessmentsError)
    throw assessmentsError
  }

  // For each assessment, get the pillar scores
  const assessmentsWithScores = await Promise.all(
    assessments.map(async (assessment) => {
      const { data: pillarScores, error: scoresError } = await supabase
        .from("pillar_scores")
        .select(`
          *,
          pillars (*)
        `)
        .eq("assessment_id", assessment.id)

      if (scoresError) {
        console.error("Error fetching pillar scores:", scoresError)
        return { ...assessment, pillarScores: [] }
      }

      return { ...assessment, pillarScores }
    }),
  )

  return assessmentsWithScores
}

// Check if a user has completed any assessments
export async function hasUserCompletedAssessments(userId: string) {
  const supabase = createClient()

  const { count, error } = await supabase
    .from("assessments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) {
    console.error("Error checking user assessments:", error)
    throw error
  }

  return count !== null && count > 0
}

// Get progress over time for a specific pillar
export async function getPillarProgressOverTime(userId: string, pillarId: string) {
  const supabase = createServerClient()

  const { data: assessments, error: assessmentsError } = await supabase
    .from("assessments")
    .select("id, completed_at")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true })

  if (assessmentsError) {
    console.error("Error fetching assessments:", assessmentsError)
    throw assessmentsError
  }

  const progressData = await Promise.all(
    assessments.map(async (assessment) => {
      const { data: pillarScore, error: scoreError } = await supabase
        .from("pillar_scores")
        .select("score")
        .eq("assessment_id", assessment.id)
        .eq("pillar_id", pillarId)
        .single()

      if (scoreError) {
        console.error("Error fetching pillar score:", scoreError)
        return { date: assessment.completed_at, score: null }
      }

      return {
        date: assessment.completed_at,
        score: pillarScore.score,
      }
    }),
  )

  return progressData.filter((item) => item.score !== null)
}
