import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { AssessmentData } from "@/types/assessment"

// Original function that other parts of the application depend on
export async function generateAssessmentPDF(assessment: AssessmentData): Promise<Blob> {
  // Create a new PDF document
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(33, 33, 33)
  doc.text("Financial Health Assessment Report", pageWidth / 2, 20, { align: "center" })

  // Add date and user info
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  const dateStr = new Date(assessment.completedAt).toLocaleDateString()
  doc.text(`Generated on: ${dateStr}`, pageWidth / 2, 30, { align: "center" })
  doc.text(`Prepared for: ${assessment.userName}`, pageWidth / 2, 38, { align: "center" })

  // Add overall score
  doc.setFontSize(16)
  doc.setTextColor(33, 33, 33)
  doc.text("Overall Financial Health Score", pageWidth / 2, 50, { align: "center" })

  doc.setFontSize(24)
  const scoreColor = getScoreColor(assessment.overallScore)
  doc.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b)
  doc.text(`${Math.round(assessment.overallScore * 10)}/10`, pageWidth / 2, 60, { align: "center" })

  doc.setFontSize(14)
  doc.text(getScoreText(assessment.overallScore), pageWidth / 2, 68, { align: "center" })

  // Add pillar scores table
  doc.setFontSize(16)
  doc.setTextColor(33, 33, 33)
  doc.text("Financial Pillar Scores", pageWidth / 2, 85, { align: "center" })

  const pillarTitles: Record<string, string> = {
    awareness: "Financial Awareness",
    goals: "Goal Setting",
    habits: "Financial Habits",
    mindsets: "Money Mindsets",
    assets: "Asset Building",
    liabilities: "Liability Management",
    income: "Income Streams",
    expenses: "Expense Control",
  }

  const tableData = Object.entries(assessment.pillarScores).map(([pillar, score]) => {
    return [pillarTitles[pillar] || pillar, `${Math.round(score * 10)}/10`, getScoreText(score)]
  })

  autoTable(doc, {
    startY: 90,
    head: [["Pillar", "Score", "Rating"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 247, 255],
    },
  })

  // Add recommendations section
  const finalY = (doc as any).lastAutoTable.finalY || 150
  doc.setFontSize(16)
  doc.setTextColor(33, 33, 33)
  doc.text("Key Recommendations", pageWidth / 2, finalY + 15, { align: "center" })

  // Get the 3 lowest scoring pillars
  const lowestPillars = Object.entries(assessment.pillarScores)
    .sort(([, scoreA], [, scoreB]) => scoreA - scoreB)
    .slice(0, 3)

  let yPos = finalY + 25
  lowestPillars.forEach(([pillar, score], index) => {
    // Pillar name and score
    doc.setFontSize(14)
    doc.setTextColor(33, 33, 33)
    doc.text(`${index + 1}. ${pillarTitles[pillar] || pillar} (${Math.round(score * 10)}/10)`, 20, yPos)
    yPos += 8

    // Recommendations
    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)

    const recommendations = assessment.recommendations[pillar] || []
    recommendations.slice(0, 2).forEach((rec, i) => {
      doc.text(`• ${rec}`, 25, yPos)
      yPos += 7
    })

    yPos += 5
  })

  // Add footer
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  doc.text("© Financial Health Assessment Tool", pageWidth / 2, 285, { align: "center" })

  // Return the PDF as a blob
  return doc.output("blob")
}

// New function for admin reports
export async function generatePDF(assessment: any): Promise<Buffer> {
  // Create a new PDF document
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.text("Financial Health Assessment Report", 105, 15, { align: "center" })

  // Add date and user info
  doc.setFontSize(12)
  doc.text(`Date: ${new Date(assessment.completed_at).toLocaleDateString()}`, 20, 30)
  doc.text(`Name: ${assessment.users?.name || "Anonymous"}`, 20, 40)
  doc.text(`Email: ${assessment.users?.email || "N/A"}`, 20, 50)

  // Add overall score
  doc.setFontSize(16)
  doc.text("Overall Score", 105, 70, { align: "center" })
  doc.setFontSize(24)
  doc.text(`${assessment.overall_score.toFixed(1)}`, 105, 85, { align: "center" })

  // Add score interpretation
  doc.setFontSize(12)
  let scoreText = ""
  if (assessment.overall_score >= 80) scoreText = "Excellent"
  else if (assessment.overall_score >= 60) scoreText = "Good"
  else if (assessment.overall_score >= 40) scoreText = "Fair"
  else scoreText = "Needs Improvement"

  doc.text(`Score Interpretation: ${scoreText}`, 105, 95, { align: "center" })

  // Add pillar scores
  doc.setFontSize(16)
  doc.text("Pillar Scores", 20, 115)

  // Create table for pillar scores
  const pillarData =
    assessment.pillarScores?.map((score: any) => [
      score.pillars?.name || "Unknown",
      score.score?.toFixed(1) || "N/A",
      getScoreText(score.score || 0),
    ]) || []

  autoTable(doc, {
    startY: 120,
    head: [["Pillar", "Score", "Rating"]],
    body: pillarData,
    theme: "grid",
    headStyles: { fillColor: [0, 128, 0] },
  })

  // Add recommendations section
  const finalY = (doc as any).lastAutoTable.finalY || 120
  doc.setFontSize(16)
  doc.text("Recommendations", 20, finalY + 20)

  doc.setFontSize(12)
  let currentY = finalY + 30

  if (assessment.pillarScores) {
    assessment.pillarScores.forEach((score: any) => {
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }

      doc.setFont(undefined, "bold")
      doc.text(`${score.pillars?.name || "Unknown"}:`, 20, currentY)
      doc.setFont(undefined, "normal")

      const recommendation = getRecommendation(score.pillars?.name || "Unknown", score.score || 0)

      // Handle text wrapping
      const splitText = doc.splitTextToSize(recommendation, 170)
      doc.text(splitText, 20, currentY + 10)

      currentY += 10 + splitText.length * 7
    })
  }

  // Add footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`NairaWise Financial Assessment - Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, {
      align: "center",
    })
  }

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output("arraybuffer"))
  return pdfBuffer
}

// Helper functions
function getScoreText(score: number): string {
  if (score >= 0.8) return "Excellent"
  if (score >= 0.6) return "Good"
  if (score >= 0.4) return "Fair"
  if (score >= 0.2) return "Needs Work"
  return "Critical"
}

function getScoreColor(score: number): { r: number; g: number; b: number } {
  if (score >= 0.8) return { r: 22, g: 163, b: 74 } // green-600
  if (score >= 0.6) return { r: 5, g: 150, b: 105 } // emerald-600
  if (score >= 0.4) return { r: 217, g: 119, b: 6 } // amber-600
  if (score >= 0.2) return { r: 234, g: 88, b: 12 } // orange-600
  return { r: 220, g: 38, b: 38 } // red-600
}

function getRecommendation(pillarName: string, score: number): string {
  if (score >= 80) {
    return `Your ${pillarName} score is excellent. Continue with your current strategies and consider mentoring others in this area.`
  } else if (score >= 60) {
    return `Your ${pillarName} score is good. Focus on refining your approach and addressing minor gaps to reach excellence.`
  } else if (score >= 40) {
    return `Your ${pillarName} score is fair. Identify specific areas for improvement and develop a structured plan to address them.`
  } else {
    return `Your ${pillarName} score needs significant improvement. Consider seeking professional advice and implementing fundamental changes to your approach.`
  }
}
