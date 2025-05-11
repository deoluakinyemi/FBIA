import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("assessments")
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("Error fetching assessments:", error)
      return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in assessments API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
