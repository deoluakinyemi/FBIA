import { createClientClient } from "./client"

// Define types for draft assessment
export interface DraftAnswer {
  questionId: string
  optionId: string
  score: number
}

export interface DraftAssessment {
  id?: string
  userId: string
  currentPillarIndex: number
  currentQuestionIndex: number
  answers: Record<string, DraftAnswer>
  lastUpdated: string
  createdAt?: string
}

// Save draft assessment progress
export async function saveDraftAssessment(draftData: Omit<DraftAssessment, "id" | "lastUpdated" | "createdAt">) {
  const supabase = createClientClient()

  // Check if there's an existing draft for this user
  const { data: existingDraft } = await supabase
    .from("draft_assessments")
    .select("id")
    .eq("user_id", draftData.userId)
    .maybeSingle()

  const now = new Date().toISOString()

  if (existingDraft) {
    // Update existing draft
    const { data, error } = await supabase
      .from("draft_assessments")
      .update({
        current_pillar_index: draftData.currentPillarIndex,
        current_question_index: draftData.currentQuestionIndex,
        answers: draftData.answers,
        last_updated: now,
      })
      .eq("id", existingDraft.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating draft assessment:", error)
      throw error
    }

    return data
  } else {
    // Create new draft
    const { data, error } = await supabase
      .from("draft_assessments")
      .insert({
        user_id: draftData.userId,
        current_pillar_index: draftData.currentPillarIndex,
        current_question_index: draftData.currentQuestionIndex,
        answers: draftData.answers,
        last_updated: now,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating draft assessment:", error)
      throw error
    }

    return data
  }
}

// Get draft assessment for a user
export async function getDraftAssessment(userId: string): Promise<DraftAssessment | null> {
  const supabase = createClientClient()

  const { data, error } = await supabase.from("draft_assessments").select("*").eq("user_id", userId).maybeSingle()

  if (error) {
    console.error("Error fetching draft assessment:", error)
    throw error
  }

  if (!data) return null

  return {
    id: data.id,
    userId: data.user_id,
    currentPillarIndex: data.current_pillar_index,
    currentQuestionIndex: data.current_question_index,
    answers: data.answers,
    lastUpdated: data.last_updated,
    createdAt: data.created_at,
  }
}

// Delete draft assessment for a user
export async function deleteDraftAssessment(userId: string) {
  const supabase = createClientClient()

  const { error } = await supabase.from("draft_assessments").delete().eq("user_id", userId)

  if (error) {
    console.error("Error deleting draft assessment:", error)
    throw error
  }

  return { success: true }
}

// Delete expired draft assessments (older than specified days)
export async function deleteExpiredDraftAssessments(days = 30) {
  const supabase = createClientClient()

  // Calculate the cutoff date
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  const cutoffDateString = cutoffDate.toISOString()

  // Delete drafts older than the cutoff date
  const { data, error, count } = await supabase
    .from("draft_assessments")
    .delete()
    .lt("last_updated", cutoffDateString)
    .select("id")

  if (error) {
    console.error("Error deleting expired drafts:", error)
    throw error
  }

  return {
    success: true,
    count: count || 0,
    deletedDrafts: data || [],
  }
}
