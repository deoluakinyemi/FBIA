"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2, PlayCircle } from "lucide-react"
import { getDraftAssessment } from "@/lib/supabase/draft-assessment-service"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export function ResumeAssessmentButton() {
  const [loading, setLoading] = useState(true)
  const [hasDraft, setHasDraft] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkForDraft() {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem("currentUserId")
        if (!userId) {
          setLoading(false)
          return
        }

        // Check if user has a draft assessment
        const draft = await getDraftAssessment(userId)
        if (draft) {
          setHasDraft(true)
          setLastUpdated(draft.lastUpdated)
        }
      } catch (error) {
        console.error("Error checking for draft assessment:", error)
      } finally {
        setLoading(false)
      }
    }

    checkForDraft()
  }, [])

  const handleResume = () => {
    // Store a flag in localStorage to indicate we're resuming a draft
    localStorage.setItem("resumeDraft", "true")

    // Navigate to the assessment page
    router.push("/assessment")

    toast({
      title: "Resuming your assessment",
      description: "Your previous progress has been loaded.",
      duration: 3000,
    })
  }

  if (loading) {
    return (
      <Button variant="outline" disabled className="mt-4 w-full md:w-auto">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Checking for saved progress...
      </Button>
    )
  }

  if (!hasDraft) {
    return null
  }

  return (
    <div className="mt-6 flex flex-col items-center">
      <Button
        onClick={handleResume}
        className="bg-nairawise-medium hover:bg-nairawise-medium/90 text-white font-semibold flex items-center gap-2"
      >
        <PlayCircle className="h-5 w-5" />
        Resume Your Assessment
      </Button>
      {lastUpdated && (
        <p className="text-sm text-gray-600 mt-2">Last saved {formatDistanceToNow(new Date(lastUpdated))} ago</p>
      )}
    </div>
  )
}
