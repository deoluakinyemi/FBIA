"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { generatePDFReport } from "@/app/actions/pdf-actions"
import { useToast } from "@/hooks/use-toast"

interface PDFDownloadButtonProps {
  assessmentId: string
  userName?: string
}

export function PDFDownloadButton({ assessmentId, userName }: PDFDownloadButtonProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      const result = await generatePDFReport(assessmentId)

      if (!result.success || !result.pdf) {
        throw new Error(result.error || "Failed to generate PDF")
      }

      // Convert base64 to blob
      const byteCharacters = atob(result.pdf)
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512)

        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const blob = new Blob(byteArrays, { type: "application/pdf" })

      // Create download link
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `financial-assessment-${userName || "report"}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "PDF Generated",
        description: "Your assessment report has been downloaded",
      })
    } catch (error) {
      console.error("Error downloading PDF:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to download PDF report",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isGenerating} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </Button>
  )
}
