import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { generatePDF } from "@/lib/pdf-service"

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Get assessment details
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select(`
        *,
        users (
          id,
          name,
          email
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
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching assessment:", error)
      return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(assessment)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="assessment-report-${assessment.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  }
}
