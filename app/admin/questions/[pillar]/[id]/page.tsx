"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { questions as defaultQuestions } from "@/lib/questions"

export default function EditQuestionPage({ params }: { params: { pillar: string; id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { pillar, id } = params
  const questionIndex = Number.parseInt(id)

  const [questions, setQuestions] = useState<Record<string, any>>(defaultQuestions)
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<string[]>(["", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load questions from localStorage if they exist
    const savedQuestions = localStorage.getItem("adminQuestions")
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    }

    // Set current question and options
    if (questions[pillar] && questions[pillar][questionIndex]) {
      const currentQuestion = questions[pillar][questionIndex]
      setQuestion(currentQuestion.question)
      setOptions([...currentQuestion.options])
    }
  }, [pillar, questionIndex, questions])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSave = () => {
    setIsLoading(true)

    // Validate
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Question text is required",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (options.some((option) => !option.trim())) {
      toast({
        title: "Error",
        description: "All answer options are required",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Update question
    const updatedQuestions = { ...questions }
    updatedQuestions[pillar][questionIndex] = {
      question,
      options,
    }

    // Save to localStorage
    localStorage.setItem("adminQuestions", JSON.stringify(updatedQuestions))

    // Show success message
    toast({
      title: "Success",
      description: "Question updated successfully",
    })

    setIsLoading(false)
    router.push("/admin/questions")
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      // Remove question
      const updatedQuestions = { ...questions }
      updatedQuestions[pillar].splice(questionIndex, 1)

      // Save to localStorage
      localStorage.setItem("adminQuestions", JSON.stringify(updatedQuestions))

      // Show success message
      toast({
        title: "Success",
        description: "Question deleted successfully",
      })

      router.push("/admin/questions")
    }
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pillar">Pillar</Label>
          <Input id="pillar" value={pillarTitles[pillar] || pillar} disabled />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question">Question Text</Label>
          <Textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter the question text"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-4">
          <Label>Answer Options (from lowest to highest score)</Label>
          {options.map((option, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
              <Input
                id={`option-${index}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Enter option ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Question
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin/questions")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
