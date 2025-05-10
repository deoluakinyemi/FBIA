"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createUser } from "@/lib/supabase/assessment-service"

export default function StartAssessmentPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    // Phone is optional, but validate format if provided
    if (phone.trim() && !/^[0-9+\-\s()]{7,15}$/.test(phone)) {
      newErrors.phone = "Phone number is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Create user in Supabase
      const user = await createUser(email, name, phone, acceptMarketing)

      // Store user ID in localStorage for the assessment process
      localStorage.setItem("currentUserId", user.id)
      localStorage.setItem("userName", name)
      localStorage.setItem("userEmail", email)
      localStorage.setItem("userPhone", phone || "")

      // Redirect to the assessment
      router.push("/assessment")
    } catch (error) {
      console.error("Error creating user:", error)
      setErrors({ submit: "There was an error saving your information. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card className="nairawise-card nairawise-shadow">
        <CardHeader className="bg-gradient-to-r from-nairawise-dark to-nairawise-medium text-white rounded-t-lg">
          <CardTitle>Before You Begin</CardTitle>
          <CardDescription className="text-white/90">
            Please provide your contact information to start the financial assessment.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-nairawise-dark">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="border-nairawise-medium/30 focus-visible:ring-nairawise-dark"
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-nairawise-dark">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="border-nairawise-medium/30 focus-visible:ring-nairawise-dark"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              <p className="text-xs text-nairawise-dark/70">
                We'll use this to send you your results and follow-up recommendations.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-nairawise-dark">
                Phone Number (Optional)
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="border-nairawise-medium/30 focus-visible:ring-nairawise-dark"
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="marketing"
                checked={acceptMarketing}
                onCheckedChange={(checked) => setAcceptMarketing(checked as boolean)}
                className="border-nairawise-medium data-[state=checked]:bg-nairawise-dark data-[state=checked]:border-nairawise-dark"
              />
              <Label htmlFor="marketing" className="text-sm font-normal text-nairawise-dark">
                I agree to receive follow-up communications about my financial assessment results.
              </Label>
            </div>

            {errors.submit && <p className="text-sm text-destructive">{errors.submit}</p>}
          </CardContent>
          <CardFooter className="bg-nairawise-cream rounded-b-lg">
            <Button
              type="submit"
              className="w-full bg-nairawise-dark hover:bg-nairawise-dark/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Start Assessment"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
