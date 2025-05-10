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
          company_name: "NairaWise",
          company_description:
            "Empowering Nigerians to make informed financial decisions through education, assessment, and personalized guidance.",
          contact_email: "contact@nairawise.com",
          contact_phone: "+234 123 456 7890",
          address: "Lagos, Nigeria",
          copyright_text: "© 2023 NairaWise. All rights reserved.",
          facebook_url: "https://facebook.com",
          twitter_url: "https://twitter.com",
          instagram_url: "https://instagram.com",
          linkedin_url: "https://linkedin.com",
        },
        { status: 200 },
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Server error fetching footer settings:", error)
    return NextResponse.json(
      {
        company_name: "NairaWise",
        company_description:
          "Empowering Nigerians to make informed financial decisions through education, assessment, and personalized guidance.",
        contact_email: "contact@nairawise.com",
        contact_phone: "+234 123 456 7890",
        address: "Lagos, Nigeria",
        copyright_text: "© 2023 NairaWise. All rights reserved.",
        facebook_url: "https://facebook.com",
        twitter_url: "https://twitter.com",
        instagram_url: "https://instagram.com",
        linkedin_url: "https://linkedin.com",
      },
      { status: 200 },
    )
  }
}
