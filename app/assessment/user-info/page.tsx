"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUser } from "@/lib/supabase/assessment-service"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  marketingConsent: z.boolean().default(false),
})

export default function UserInfoPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      marketingConsent: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)

      // Create or update user in Supabase
      const user = await createUser(values.email, values.name, values.phone, values.marketingConsent)

      // Store user info in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: user.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          marketingConsent: values.marketingConsent,
        }),
      )

      // Navigate to assessment
      router.push("/assessment")
    } catch (error) {
      console.error("Error saving user info:", error)
      toast({
        title: "Error",
        description: "There was a problem saving your information. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-nairawise-dark">Your Information</CardTitle>
          <CardDescription>Please provide your details before starting the financial assessment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+234 800 123 4567" {...field} />
                    </FormControl>
                    <FormDescription>We may use this to follow up with personalized advice.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketingConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I agree to receive financial tips and updates via email</FormLabel>
                      <FormDescription>You can unsubscribe at any time.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Continue to Assessment"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-xs text-center text-nairawise-dark/60">
          Your information is securely stored and will only be used for this assessment.
        </CardFooter>
      </Card>
    </div>
  )
}
