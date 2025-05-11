import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
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
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching assessment:", error)
      return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in get assessment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
