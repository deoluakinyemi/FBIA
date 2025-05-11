import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in users API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userData = await request.json()
    const supabase = createServerClient()

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || null,
          marketing_consent: userData.marketing_consent || false,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in create user API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
