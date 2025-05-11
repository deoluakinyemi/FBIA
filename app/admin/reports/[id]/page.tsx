"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Mail, Printer } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadarChart } from "@/components/radar-chart"
import { PillarScoreCard } from "@/components/pillar-score-card"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  marketing_consent: boolean | null
}

interface Pillar {
  id: string
  name: string
  slug: string
}

interface PillarScore {
  id: string
  pillar_id: string
  score: number
  pillars: Pillar
}

interface Question {
  id: string
  question: string
  pillar_id: string
}

interface Option {
  id: string
  option_text: string
  score: number
}

interface Answer {
  id: string
  question_id: string
  option_id: string
  questions: Question
  options: Option
}

interface Assessment {
  id: string
  user_id: string
  overall_score: number
  completed_at: string
  created_at: string
  users: User
  pillarScores: PillarScore[]
  answers: Answer[]
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    fetchAssessment()
  }, [])

  async function fetchAssessment() {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/assessments/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch assessment")
      }
      const data = await response.json()
      setAssessment(data)
    } catch (err) {
      console.error("Error fetching assessment:", err)
      setError("Failed to load assessment. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  async function sendEmail() {
    setSendingEmail(true)
    try {
      const response = await fetch(`/api/admin/assessments/${params.id}/send-email`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      toast({
        title: "Success",
        description: "Assessment results email sent successfully",
      })
    } catch (err) {
      console.error("Error sending email:", err)
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  function handlePrint() {
    window.print()
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-blue-100 text-blue-800"
    if (score >= 40) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  function getScoreText(score: number) {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Improvement"
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading assessment...</p>
      </div>
    )
  }

  if (error || !assessment) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error || "Assessment not found"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare data for radar chart
  const radarData = assessment.pillarScores.map((score) => ({
    name: score.pillars.name,
    value: score.score,
  }))

  // Group answers by pillar
  const answersByPillar: Record<string, Answer[]> = {}
  assessment.answers.forEach((answer) => {
    const pillarId = answer.questions.pillar_id
    if (!answersByPillar[pillarId]) {
      answersByPillar[pillarId] = []
    }
    answersByPillar[pillarId].push(answer)
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/admin/reports">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(`/api/admin/assessments/${assessment.id}/pdf`, "_blank")}
          >
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" onClick={sendEmail} disabled={sendingEmail}>
            {sendingEmail ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
            ) : (
              <Mail className="mr-2 h-4 w-4" />
            )}
            Send Email
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Report</CardTitle>
          <CardDescription>
            Completed on {new Date(assessment.completed_at).toLocaleDateString()} by{" "}
            {assessment.users?.name || "Anonymous"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">User Information</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Name</TableCell>
                    <TableCell>{assessment.users?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{assessment.users?.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Phone</TableCell>
                    <TableCell>{assessment.users?.phone || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Marketing Consent</TableCell>
                    <TableCell>{assessment.users?.marketing_consent ? "Yes" : "No"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
              <div className="flex items-center space-x-4">
                <div className="text-5xl font-bold">{assessment.overall_score.toFixed(1)}</div>
                <div>
                  <Badge className={`text-lg px-3 py-1 ${getScoreColor(assessment.overall_score)}`}>
                    {getScoreText(assessment.overall_score)}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completed on {new Date(assessment.completed_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Pillar Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex justify-center items-center">
                <div className="w-full max-w-md">
                  <RadarChart data={radarData} />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assessment.pillarScores.map((pillarScore) => (
                    <PillarScoreCard
                      key={pillarScore.id}
                      name={pillarScore.pillars.name}
                      score={pillarScore.score}
                      showDescription={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Responses</h3>
            <Tabs defaultValue={assessment.pillarScores[0]?.pillars.id}>
              <TabsList className="mb-4 flex flex-wrap">
                {assessment.pillarScores.map((pillarScore) => (
                  <TabsTrigger key={pillarScore.pillars.id} value={pillarScore.pillars.id}>
                    {pillarScore.pillars.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {assessment.pillarScores.map((pillarScore) => (
                <TabsContent key={pillarScore.pillars.id} value={pillarScore.pillars.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{pillarScore.pillars.name}</CardTitle>
                      <CardDescription>
                        Score: {pillarScore.score.toFixed(1)} - {getScoreText(pillarScore.score)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Question</TableHead>
                            <TableHead>Answer</TableHead>
                            <TableHead>Score</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {answersByPillar[pillarScore.pillars.id]?.map((answer) => (
                            <TableRow key={answer.id}>
                              <TableCell className="font-medium">{answer.questions.question}</TableCell>
                              <TableCell>{answer.options.option_text}</TableCell>
                              <TableCell>
                                <Badge className={getScoreColor(answer.options.score)}>{answer.options.score}</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
