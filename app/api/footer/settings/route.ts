import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase.from("footer_settings").select("*").single()

    if (error) {
      console.error("Error fetching footer settings:", error)
      return NextResponse.json(
        {
          address: "123 Financial District, Lagos, Nigeria",
          phone: "+234 123 456 7890",
          email: "info@nairawise.com",
          facebook_url: "https://facebook.com",
          twitter_url: "https://twitter.com",
          instagram_url: "https://instagram.com",
          linkedin_url: "https://linkedin.com",
          copyright_text: "NairaWise. All rights reserved.",
          newsletter_enabled: true,
          newsletter_text: "Subscribe to our newsletter for financial tips and updates.",
        },
        { status: 200 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Server error fetching footer settings:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
