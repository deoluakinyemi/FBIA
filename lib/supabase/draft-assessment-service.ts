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
  try {
    const supabase = createClientClient()

    // Check if there's an existing draft for this user
    const { data: existingDraft, error: fetchError } = await supabase
      .from("draft_assessments")
      .select("id")
      .eq("user_id", draftData.userId)
      .maybeSingle()

    if (fetchError) {
      console.error("Error fetching existing draft:", fetchError)
      return null
    }

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
        return null
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
        return null
      }

      return data
    }
  } catch (err) {
    console.error("Unexpected error in saveDraftAssessment:", err)
    return null
  }
}

// Get draft assessment for a user
export async function getDraftAssessment(userId: string): Promise<DraftAssessment | null> {
  try {
    const supabase = createClientClient()

    const { data, error } = await supabase.from("draft_assessments").select("*").eq("user_id", userId).maybeSingle()

    if (error) {
      console.error("Error fetching draft assessment:", error)
      return null
    }

    if (!data) return null

    return {
      id: data.id,
      userId: data.user_id,
      currentPillarIndex: data.current_pillar_index,
      currentQuestionIndex: data.current_question_index,
      answers: data.answers || {},
      lastUpdated: data.last_updated,
      createdAt: data.created_at,
    }
  } catch (err) {
    console.error("Unexpected error in getDraftAssessment:", err)
    return null
  }
}

// Delete draft assessment for a user
export async function deleteDraftAssessment(userId: string) {
  try {
    const supabase = createClientClient()

    const { error } = await supabase.from("draft_assessments").delete().eq("user_id", userId)

    if (error) {
      console.error("Error deleting draft assessment:", error)
      return { success: false }
    }

    return { success: true }
  } catch (err) {
    console.error("Unexpected error in deleteDraftAssessment:", err)
    return { success: false }
  }
}
