import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // First, delete related records
    // Delete user's assessments and related data
    const { data: assessments, error: fetchError } = await supabase
      .from("assessments")
      .select("id")
      .eq("user_id", params.id)

    if (fetchError) {
      console.error("Error fetching user assessments:", fetchError)
      return NextResponse.json({ error: "Failed to fetch user assessments" }, { status: 500 })
    }

    // Delete related data for each assessment
    for (const assessment of assessments || []) {
      // Delete pillar scores
      await supabase.from("pillar_scores").delete().eq("assessment_id", assessment.id)

      // Delete answers
      await supabase.from("answers").delete().eq("assessment_id", assessment.id)
    }

    // Delete assessments
    await supabase.from("assessments").delete().eq("user_id", params.id)

    // Delete progress goals
    await supabase.from("progress_goals").delete().eq("user_id", params.id)

    // Delete dashboard settings
    await supabase.from("user_dashboard_settings").delete().eq("user_id", params.id)

    // Finally, delete the user
    const { error } = await supabase.from("users").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting user:", error)
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in get user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const userData = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("users")
      .update({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || null,
        marketing_consent: userData.marketing_consent || false,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in update user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
