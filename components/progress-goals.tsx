"use client"

import { useState } from "react"
import { Check, Edit, Plus, Trash2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createProgressGoal, deleteProgressGoal, updateProgressGoal } from "@/lib/supabase/progress-service"

interface ProgressGoalsProps {
  userId: string
  goals: any[]
  pillars: any[]
  onGoalsUpdated: () => void
}

export function ProgressGoals({ userId, goals, pillars, onGoalsUpdated }: ProgressGoalsProps) {
  const { toast } = useToast()
  const [isAddingGoal, setIsAddingGoal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    pillar_id: "",
    target_score: 8,
    target_date: "",
  })
  const [editingGoal, setEditingGoal] = useState<string | null>(null)
  const [editedGoal, setEditedGoal] = useState<any>({})

  const handleAddGoal = async () => {
    try {
      if (!newGoal.title) {
        toast({
          title: "Error",
          description: "Please enter a goal title",
          variant: "destructive",
        })
        return
      }

      await createProgressGoal(userId, {
        title: newGoal.title,
        pillar_id: newGoal.pillar_id || null,
        target_score: newGoal.target_score / 10, // Convert to 0-1 scale
        target_date: newGoal.target_date || null,
      })

      setNewGoal({
        title: "",
        pillar_id: "",
        target_score: 8,
        target_date: "",
      })
      setIsAddingGoal(false)
      onGoalsUpdated()

      toast({
        title: "Goal Added",
        description: "Your progress goal has been added successfully",
      })
    } catch (error) {
      console.error("Error adding goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal.id)
    setEditedGoal({
      title: goal.title,
      pillar_id: goal.pillar_id,
      target_score: Math.round(goal.target_score * 10), // Convert to 0-10 scale
      target_date: goal.target_date,
      completed: goal.completed,
    })
  }

  const handleSaveEdit = async (goalId: string) => {
    try {
      await updateProgressGoal(goalId, {
        title: editedGoal.title,
        pillar_id: editedGoal.pillar_id,
        target_score: editedGoal.target_score / 10, // Convert to 0-1 scale
        target_date: editedGoal.target_date,
        completed: editedGoal.completed,
        completed_at: editedGoal.completed ? new Date().toISOString() : null,
      })

      setEditingGoal(null)
      onGoalsUpdated()

      toast({
        title: "Goal Updated",
        description: "Your progress goal has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating goal:", error)
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteProgressGoal(goalId)
        onGoalsUpdated()

        toast({
          title: "Goal Deleted",
          description: "Your progress goal has been deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting goal:", error)
        toast({
          title: "Error",
          description: "Failed to delete goal. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleComplete = async (goal: any) => {
    try {
      const completed = !goal.completed
      await updateProgressGoal(goal.id, {
        completed,
        completed_at: completed ? new Date().toISOString() : null,
      })
      onGoalsUpdated()

      toast({
        title: completed ? "Goal Completed" : "Goal Reopened",
        description: completed ? "Congratulations on achieving your goal!" : "Your goal has been reopened",
      })
    } catch (error) {
      console.error("Error updating goal:", error)
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Financial Goals</h3>
        <Button size="sm" onClick={() => setIsAddingGoal(true)} disabled={isAddingGoal}>
          <Plus className="mr-1 h-4 w-4" /> Add Goal
        </Button>
      </div>

      {isAddingGoal && (
        <Card>
          <CardHeader>
            <CardTitle>New Financial Goal</CardTitle>
            <CardDescription>Set a target to improve your financial health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                placeholder="e.g., Improve my savings habits"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-pillar">Financial Pillar (Optional)</Label>
              <Select value={newGoal.pillar_id} onValueChange={(value) => setNewGoal({ ...newGoal, pillar_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a financial pillar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pillars</SelectItem>
                  {pillars.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      {pillar.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-score">Target Score (1-10)</Label>
              <Input
                id="goal-score"
                type="number"
                min="1"
                max="10"
                value={newGoal.target_score}
                onChange={(e) => setNewGoal({ ...newGoal, target_score: Number.parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-date">Target Date (Optional)</Label>
              <Input
                id="goal-date"
                type="date"
                value={newGoal.target_date}
                onChange={(e) => setNewGoal({ ...newGoal, target_date: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGoal}>Add Goal</Button>
          </CardFooter>
        </Card>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No goals set yet. Add your first financial goal to track your progress.
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className={goal.completed ? "bg-muted/50" : ""}>
              {editingGoal === goal.id ? (
                <>
                  <CardHeader>
                    <Input
                      value={editedGoal.title}
                      onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                      className="font-medium text-lg"
                    />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Financial Pillar</Label>
                      <Select
                        value={editedGoal.pillar_id || ""}
                        onValueChange={(value) => setEditedGoal({ ...editedGoal, pillar_id: value || null })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a financial pillar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pillars</SelectItem>
                          {pillars.map((pillar) => (
                            <SelectItem key={pillar.id} value={pillar.id}>
                              {pillar.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Target Score (1-10)</Label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={editedGoal.target_score}
                        onChange={(e) =>
                          setEditedGoal({ ...editedGoal, target_score: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Target Date</Label>
                      <Input
                        type="date"
                        value={editedGoal.target_date || ""}
                        onChange={(e) => setEditedGoal({ ...editedGoal, target_date: e.target.value || null })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`complete-${goal.id}`}
                        checked={editedGoal.completed}
                        onChange={(e) => setEditedGoal({ ...editedGoal, completed: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`complete-${goal.id}`}>Mark as completed</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setEditingGoal(null)}>
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={() => handleSaveEdit(goal.id)}>
                      <Check className="mr-1 h-4 w-4" /> Save
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className={goal.completed ? "line-through text-muted-foreground" : ""}>
                          {goal.title}
                        </CardTitle>
                        <CardDescription>
                          {goal.pillars ? `Pillar: ${goal.pillars.name}` : "All Pillars"}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Target Score:</span>
                        <span className="font-medium">{Math.round(goal.target_score * 10)}/10</span>
                      </div>
                      {goal.target_date && (
                        <div className="flex justify-between text-sm">
                          <span>Target Date:</span>
                          <span className="font-medium">{new Date(goal.target_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {goal.completed && goal.completed_at && (
                        <div className="flex justify-between text-sm">
                          <span>Completed:</span>
                          <span className="font-medium">{new Date(goal.completed_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={goal.completed ? "outline" : "default"}
                      className="w-full"
                      onClick={() => handleToggleComplete(goal)}
                    >
                      {goal.completed ? (
                        <>
                          <X className="mr-1 h-4 w-4" /> Reopen Goal
                        </>
                      ) : (
                        <>
                          <Check className="mr-1 h-4 w-4" /> Mark as Complete
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
