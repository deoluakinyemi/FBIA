import Link from "next/link"
import Image from "next/image"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeAssessmentButton } from "@/components/resume-assessment-button"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-nairawise-dark to-nairawise-medium py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-white mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Take Control of Your Financial Future</h1>
              <p className="text-lg md:text-xl mb-8 text-white/90">
                Our comprehensive financial assessment helps you understand your current financial health and provides
                personalized recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/assessment/start">
                  <Button
                    size="lg"
                    className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold text-lg px-8 py-6 shadow-lg transition-all hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                  >
                    Start Your Assessment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {/* Resume Assessment Button */}
                <ResumeAssessmentButton />
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <Image
                src="/images/financial-advisor-meeting.png"
                alt="Financial Planning Meeting"
                width={500}
                height={350}
                className="rounded-lg shadow-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-nairawise-dark">How Our Assessment Helps You</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-nairawise-cream p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-nairawise-dark rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-nairawise-dark">Evaluate Your Current Status</h3>
              <p className="text-gray-700">
                Understand where you stand financially across multiple dimensions of your financial life.
              </p>
            </div>
            <div className="bg-nairawise-cream p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-nairawise-dark rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-nairawise-dark">Get Personalized Insights</h3>
              <p className="text-gray-700">
                Receive tailored recommendations based on your specific financial situation and goals.
              </p>
            </div>
            <div className="bg-nairawise-cream p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-nairawise-dark rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-nairawise-dark">Track Your Progress</h3>
              <p className="text-gray-700">
                Monitor your improvement over time and stay on track to achieve your financial goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-nairawise-cream">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-nairawise-dark">Ready to Improve Your Financial Health?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-700">
            Take our comprehensive assessment today and get a clear picture of your financial situation with actionable
            steps to improve.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Link href="/assessment/start">
              <Button
                size="lg"
                className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold text-lg px-8 py-6 shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                Start Assessment Now
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* Resume Assessment Button */}
            <ResumeAssessmentButton />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-nairawise-dark">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/testimonial-woman.png"
                  alt="Sarah Johnson"
                  width={48}
                  height={48}
                  className="rounded-full object-cover h-12 w-12 mr-4"
                />
                <div>
                  <h3 className="font-bold text-nairawise-dark">Sarah Johnson</h3>
                  <p className="text-sm text-gray-600">Small Business Owner</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The financial assessment provided me with clear insights into my business finances. The recommendations
                were practical and helped me make better financial decisions."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center mb-4">
                <Image
                  src="/images/testimonial-man.png"
                  alt="Michael Okonkwo"
                  width={48}
                  height={48}
                  className="rounded-full object-cover h-12 w-12 mr-4"
                />
                <div>
                  <h3 className="font-bold text-nairawise-dark">Michael Okonkwo</h3>
                  <p className="text-sm text-gray-600">Young Professional</p>
                </div>
              </div>
              <p className="text-gray-700">
                "I was struggling with managing my finances after graduation. This assessment helped me create a solid
                plan for saving and investing while paying off my student loans."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-nairawise-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-6">Take the First Step Towards Financial Freedom</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <Link href="/assessment/start">
              <Button
                size="lg"
                className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                Start Your Assessment
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* Resume Assessment Button */}
            <ResumeAssessmentButton />
          </div>
        </div>
      </section>
    </main>
  )
}
