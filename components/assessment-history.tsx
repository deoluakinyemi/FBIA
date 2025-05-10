"use client"

import Link from "next/link"
import { Calendar, ChevronRight, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PDFDownloadButton } from "@/components/pdf-download-button"

interface AssessmentHistoryProps {
  assessments: any[]
}

export function AssessmentHistory({ assessments }: AssessmentHistoryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Assessment History</h3>

      {assessments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No assessments completed yet. Take your first assessment to start tracking your progress.
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <Card key={assessment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Assessment Report</CardTitle>
                    <CardDescription className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(assessment.completed_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold">{Math.round(assessment.overall_score * 10)}/10</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {assessment.pillarScores.slice(0, 4).map((score: any) => (
                    <div key={score.id} className="flex justify-between text-sm">
                      <span>{score.pillars?.name || "Pillar"}:</span>
                      <span className="font-medium">{Math.round(score.score * 10)}/10</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <PDFDownloadButton assessmentId={assessment.id} />
                <Link href={`/assessment/results/${assessment.id}`}>
                  <Button variant="outline">
                    <FileText className="mr-1 h-4 w-4" /> View Full Report
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}

          <div className="text-center">
            <Link href="/assessment/start">
              <Button>
                Take Another Assessment <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
