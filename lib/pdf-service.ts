import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import type { AssessmentData } from "@/types/assessment"

// Function to generate a PDF report from assessment data
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
