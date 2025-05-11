import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("app_settings").select("*").single()

    if (error) {
      // If no settings exist, return default settings
      if (error.code === "PGRST116") {
        return NextResponse.json({
          site_name: "NairaWise Financial Assessment",
          contact_email: "contact@nairawise.com",
          support_phone: "+234 800 123 4567",
          enable_email_notifications: true,
          default_assessment_language: "en",
          privacy_policy: "Default privacy policy text...",
          terms_of_service: "Default terms of service text...",
          maintenance_mode: false,
          maintenance_message: "We're currently performing maintenance. Please check back later.",
        })
      }

      console.error("Error fetching app settings:", error)
      return NextResponse.json({ error: "Failed to fetch app settings" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in app settings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const settings = await request.json()
    const supabase = createServerClient()

    // Check if settings exist
    const { data: existingSettings, error: checkError } = await supabase.from("app_settings").select("id").single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking app settings:", checkError)
      return NextResponse.json({ error: "Failed to check app settings" }, { status: 500 })
    }

    let result

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("app_settings")
        .update(settings)
        .eq("id", existingSettings.id)
        .select()
        .single()

      if (error) {
        console.error("Error updating app settings:", error)
        return NextResponse.json({ error: "Failed to update app settings" }, { status: 500 })
      }

      result = data
    } else {
      // Insert new settings
      const { data, error } = await supabase.from("app_settings").insert([settings]).select().single()

      if (error) {
        console.error("Error creating app settings:", error)
        return NextResponse.json({ error: "Failed to create app settings" }, { status: 500 })
      }

      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in update app settings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
