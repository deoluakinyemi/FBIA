"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { questions as defaultQuestions } from "@/lib/questions"

export default function NewQuestionPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [questions, setQuestions] = useState<Record<string, any>>(defaultQuestions)
  const [selectedPillar, setSelectedPillar] = useState("")
  const [question, setQuestion] = useState("")
  const [options, setOptions] = useState<string[]>(["", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load questions from localStorage if they exist
    const savedQuestions = localStorage.getItem("adminQuestions")
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions))
    }
  }, [])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSave = () => {
    setIsLoading(true)

    // Validate
    if (!selectedPillar) {
      toast({
        title: "Error",
        description: "Please select a pillar",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

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

    // Add new question
    const updatedQuestions = { ...questions }
    updatedQuestions[selectedPillar].push({
      question,
      options,
    })

    // Save to localStorage
    localStorage.setItem("adminQuestions", JSON.stringify(updatedQuestions))

    // Show success message
    toast({
      title: "Success",
      description: "Question added successfully",
    })

    setIsLoading(false)
    router.push("/admin/questions")
  }

  const pillars = Object.keys(questions)

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
        <CardTitle>Add New Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pillar">Pillar</Label>
          <Select value={selectedPillar} onValueChange={setSelectedPillar}>
            <SelectTrigger>
              <SelectValue placeholder="Select a financial pillar" />
            </SelectTrigger>
            <SelectContent>
              {pillars.map((pillar) => (
                <SelectItem key={pillar} value={pillar}>
                  {pillarTitles[pillar] || pillar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.push("/admin/questions")}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Question"}
        </Button>
      </CardFooter>
    </Card>
  )
}
