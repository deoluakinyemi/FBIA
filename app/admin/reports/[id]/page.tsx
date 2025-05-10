"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadarChart } from "@/components/radar-chart"
import { getAssessmentDetails } from "@/lib/supabase/assessment-service"
import { sendAssessmentEmail } from "@/app/actions/email-actions"
import { useToast } from "@/hooks/use-toast"

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [assessment, setAssessment] = useState<any>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await getAssessmentDetails(params.id)
        if (!data) {
          setError("Assessment not found")
          setLoading(false)
          return
        }

        setAssessment(data)

        // Extract pillar scores
        const pillarScoresMap: Record<string, number> = {}
        data.pillarScores.forEach((score: any) => {
          pillarScoresMap[score.pillars.slug] = score.score
        })
        setScores(pillarScoresMap)

        setLoading(false)
      } catch (err) {
        console.error("Error loading assessment:", err)
        setError("Failed to load assessment details")
        setLoading(false)
      }
    }

    loadAssessment()
  }, [params.id])

  const handleSendEmail = async () => {
    if (!assessment?.id) return

    setSendingEmail(true)
    try {
      const result = await sendAssessmentEmail(assessment.id)

      if (result.success) {
        toast({
          title: "Email Sent",
          description: `Assessment results sent to ${assessment.users?.email}`,
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send email",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF report
    alert("This would download a PDF report in a production environment")
  }

  if (loading) {
    return <div className="py-8 text-center">Loading assessment details...</div>
  }

  if (error) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="py-8">
        <Card>
          <CardHeader>
            <CardTitle>Assessment Not Found</CardTitle>
            <CardDescription>The requested assessment could not be found.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/admin/reports">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/admin/reports">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Reports
          </Button>
        </Link>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
          <Button onClick={handleSendEmail} disabled={sendingEmail || !assessment.users?.email}>
            <Mail className="mr-2 h-4 w-4" /> {sendingEmail ? "Sending..." : "Email Report"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessment Report</CardTitle>
          <CardDescription>
            Completed on {new Date(assessment.completed_at).toLocaleDateString()} by{" "}
            {assessment.users?.name || "Unknown"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">User Information</h3>
              <dl className="grid grid-cols-2 gap-2">
                <dt className="text-sm font-medium text-muted-foreground">Name:</dt>
                <dd>{assessment.users?.name || "N/A"}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Email:</dt>
                <dd>{assessment.users?.email || "N/A"}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Phone:</dt>
                <dd>{assessment.users?.phone || "N/A"}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Marketing Consent:</dt>
                <dd>{assessment.users?.marketing_consent ? "Yes" : "No"}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Date:</dt>
                <dd>{new Date(assessment.completed_at).toLocaleDateString()}</dd>
                <dt className="text-sm font-medium text-muted-foreground">Overall Score:</dt>
                <dd>{Math.round(assessment.overall_score * 10)}/10</dd>
              </dl>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Assessment Summary</h3>
              <p className="text-sm text-muted-foreground mb-2">
                This assessment evaluates financial health across 8 key pillars, with scores from 0-10.
              </p>
              <div className="text-sm">
                <span className="font-medium">Overall Rating: </span>
                {assessment.overall_score >= 0.8
                  ? "Excellent"
                  : assessment.overall_score >= 0.6
                    ? "Good"
                    : assessment.overall_score >= 0.4
                      ? "Fair"
                      : "Needs Improvement"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pillar-scores">Pillar Scores</TabsTrigger>
          <TabsTrigger value="answers">Detailed Answers</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
              <CardDescription>Visual representation of scores across all pillars</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-4">
              <div className="w-full max-w-md aspect-square">
                <RadarChart scores={scores} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pillar-scores" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pillar Scores</CardTitle>
              <CardDescription>Detailed breakdown of scores for each financial pillar</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <TableCell>{Math.round(score.score * 10)}/10</TableCell>
                      <TableCell>
                        {score.score >= 0.8
                          ? "Excellent"
                          : score.score >= 0.6
                            ? "Good"
                            : score.score >= 0.4
                              ? "Fair"
                              : "Needs Improvement"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="answers" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Answers</CardTitle>
              <CardDescription>All responses provided during the assessment</CardDescription>
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
                  {assessment.answers.map((answer: any) => (
                    <TableRow key={answer.id}>
                      <TableCell className="font-medium">{answer.questions.question}</TableCell>
                      <TableCell>{answer.options.option_text}</TableCell>
                      <TableCell>{answer.options.score}/4</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
