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
import { useToast } from "@/hooks/use-toast"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [assessment, setAssessment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    // Simulate fetching assessment details
    const fetchAssessment = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data for a specific assessment
        const mockAssessment = {
          id: params.id,
          user_id: "user_1",
          overall_score: 0.78,
          completed_at: new Date().toISOString(),
          users: {
            id: "user_1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+234 800 123 4567",
            marketing_consent: true,
          },
          pillarScores: [
            {
              id: "ps1",
              pillar_id: "p1",
              score: 0.85,
              pillars: { id: "p1", name: "Financial Awareness", slug: "awareness" },
            },
            { id: "ps2", pillar_id: "p2", score: 0.72, pillars: { id: "p2", name: "Goal Setting", slug: "goals" } },
            {
              id: "ps3",
              pillar_id: "p3",
              score: 0.65,
              pillars: { id: "p3", name: "Financial Habits", slug: "habits" },
            },
            { id: "ps4", pillar_id: "p4", score: 0.9, pillars: { id: "p4", name: "Money Mindsets", slug: "mindsets" } },
            { id: "ps5", pillar_id: "p5", score: 0.75, pillars: { id: "p5", name: "Asset Building", slug: "assets" } },
            {
              id: "ps6",
              pillar_id: "p6",
              score: 0.68,
              pillars: { id: "p6", name: "Liability Management", slug: "liabilities" },
            },
            { id: "ps7", pillar_id: "p7", score: 0.82, pillars: { id: "p7", name: "Income Streams", slug: "income" } },
            {
              id: "ps8",
              pillar_id: "p8",
              score: 0.79,
              pillars: { id: "p8", name: "Expense Control", slug: "expenses" },
            },
          ],
          answers: [
            {
              id: "a1",
              question_id: "q1",
              option_id: "o1",
              questions: {
                id: "q1",
                question: "How would you rate your understanding of your current financial situation?",
                pillar_id: "p1",
              },
              options: { id: "o1", option_text: "Good - I have a solid understanding of my finances", score: 3 },
            },
            {
              id: "a2",
              question_id: "q2",
              option_id: "o2",
              questions: { id: "q2", question: "How often do you review your financial statements?", pillar_id: "p1" },
              options: { id: "o2", option_text: "Often (monthly)", score: 3 },
            },
            {
              id: "a3",
              question_id: "q3",
              option_id: "o3",
              questions: { id: "q3", question: "Do you have clearly defined financial goals?", pillar_id: "p2" },
              options: { id: "o3", option_text: "Several clear goals", score: 3 },
            },
            {
              id: "a4",
              question_id: "q4",
              option_id: "o4",
              questions: {
                id: "q4",
                question: "How often do you review and adjust your financial goals?",
                pillar_id: "p2",
              },
              options: { id: "o4", option_text: "Sometimes (every few months)", score: 2 },
            },
            // Add more mock answers for other pillars
          ],
        }

        setAssessment(mockAssessment)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching assessment:", err)
        setError("Failed to load assessment details. Please try again later.")
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [params.id])

  const handleSendEmail = async () => {
    setSendingEmail(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Email Sent",
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

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Generated",
      description: "Assessment PDF has been generated and downloaded",
    })
  }

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading assessment details...</p>
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
  const radarData = assessment.pillarScores.map((score: any) => ({
    name: score.pillars.name,
    value: score.score,
  }))

  // Group answers by pillar
  const answersByPillar: Record<string, any[]> = {}
  assessment.answers.forEach((answer: any) => {
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
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button variant="outline" onClick={handleSendEmail} disabled={sendingEmail}>
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
                <div className="text-5xl font-bold">{(assessment.overall_score * 10).toFixed(1)}</div>
                <div>
                  <Badge
                    className={`text-lg px-3 py-1 ${
                      assessment.overall_score >= 0.8
                        ? "bg-green-100 text-green-800"
                        : assessment.overall_score >= 0.6
                          ? "bg-blue-100 text-blue-800"
                          : assessment.overall_score >= 0.4
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {assessment.overall_score >= 0.8
                      ? "Excellent"
                      : assessment.overall_score >= 0.6
                        ? "Good"
                        : assessment.overall_score >= 0.4
                          ? "Fair"
                          : "Needs Improvement"}
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pillar</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessment.pillarScores.map((score: any) => (
                      <TableRow key={score.id}>
                        <TableCell className="font-medium">{score.pillars.name}</TableCell>
                        <TableCell>{(score.score * 10).toFixed(1)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              score.score >= 0.8
                                ? "bg-green-100 text-green-800"
                                : score.score >= 0.6
                                  ? "bg-blue-100 text-blue-800"
                                  : score.score >= 0.4
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                            }
                          >
                            {score.score >= 0.8
                              ? "Excellent"
                              : score.score >= 0.6
                                ? "Good"
                                : score.score >= 0.4
                                  ? "Fair"
                                  : "Needs Improvement"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Responses</h3>
            <Tabs defaultValue={assessment.pillarScores[0]?.pillars.id}>
              <TabsList className="mb-4 flex flex-wrap">
                {assessment.pillarScores.map((pillarScore: any) => (
                  <TabsTrigger key={pillarScore.pillars.id} value={pillarScore.pillars.id}>
                    {pillarScore.pillars.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {assessment.pillarScores.map((pillarScore: any) => (
                <TabsContent key={pillarScore.pillars.id} value={pillarScore.pillars.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{pillarScore.pillars.name}</CardTitle>
                      <CardDescription>
                        Score: {(pillarScore.score * 10).toFixed(1)} -
                        {pillarScore.score >= 0.8
                          ? " Excellent"
                          : pillarScore.score >= 0.6
                            ? " Good"
                            : pillarScore.score >= 0.4
                              ? " Fair"
                              : " Needs Improvement"}
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
                          {answersByPillar[pillarScore.pillars.id]?.map((answer: any) => (
                            <TableRow key={answer.id}>
                              <TableCell className="font-medium">{answer.questions.question}</TableCell>
                              <TableCell>{answer.options.option_text}</TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    answer.options.score >= 3
                                      ? "bg-green-100 text-green-800"
                                      : answer.options.score >= 2
                                        ? "bg-blue-100 text-blue-800"
                                        : answer.options.score >= 1
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                  }
                                >
                                  {answer.options.score}/4
                                </Badge>
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
