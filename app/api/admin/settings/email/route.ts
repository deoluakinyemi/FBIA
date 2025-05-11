import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("email_settings").select("*").single()

    if (error) {
      // If no settings exist, return default settings
      if (error.code === "PGRST116") {
        return NextResponse.json({
          smtp_host: "smtp.example.com",
          smtp_port: "587",
          smtp_user: "user@example.com",
          smtp_password: "password",
          from_email: "no-reply@nairawise.com",
          from_name: "NairaWise Assessment",
          email_footer: "© 2025 NairaWise. All rights reserved.",
          enable_welcome_email: true,
          enable_results_email: true,
        })
      }

      console.error("Error fetching email settings:", error)
      return NextResponse.json({ error: "Failed to fetch email settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in email settings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    const supabase = createServerClient()

    // Check if settings exist
    const { data: existingSettings, error: checkError } = await supabase.from("email_settings").select("id").single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking email settings:", checkError)
      return NextResponse.json({ error: "Failed to check email settings" }, { status: 500 })
    }

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("email_settings")
        .update(settings)
        .eq("id", existingSettings.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating email settings:", error)
        return NextResponse.json({ error: "Failed to update email settings" }, { status: 500 })
      }

      result = data
    } else {
      // Insert new settings
      const { data, error } = await supabase.from("email_settings").insert([settings]).select().single()

      if (error) {
        console.error("Error creating email settings:", error)
        return NextResponse.json({ error: "Failed to create email settings" }, { status: 500 })
      }

      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in update email settings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
