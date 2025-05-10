"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { ResourceCard, type ResourceCardProps } from "@/components/resource-card"
import { ResourceCategoryTabs } from "@/components/resource-category-tabs"
import { Input } from "@/components/ui/input"

// Sample resource data
const resourcesData: ResourceCardProps[] = [
  {
    title: "Budgeting 101: Getting Started",
    description:
      "Learn the basics of creating and maintaining a budget that works for your lifestyle and financial goals.",
    imageUrl: "/budgeting-finance-money.png",
    category: "Budgeting",
    link: "/resources/budgeting-101",
  },
  {
    title: "Emergency Fund: Why You Need One",
    description:
      "Discover why an emergency fund is crucial for financial stability and how to build one even on a tight budget.",
    imageUrl: "/emergency-fund-savings.png",
    category: "Savings",
    link: "/resources/emergency-fund",
  },
  {
    title: "Investing for Beginners",
    description:
      "A comprehensive guide to help you understand the basics of investing and how to get started with minimal risk.",
    imageUrl: "/investing-stocks-finance.png",
    category: "Investing",
    link: "/resources/investing-beginners",
  },
  {
    title: "Debt Management Strategies",
    description: "Effective strategies to help you manage and reduce your debt while maintaining financial stability.",
    imageUrl: "/debt-management-finance.png",
    category: "Debt Management",
    link: "/resources/debt-management",
  },
  {
    title: "Retirement Planning Guide",
    description:
      "Start planning for your retirement today with this comprehensive guide to retirement savings and investments.",
    imageUrl: "/placeholder.svg?key=rzaez",
    category: "Retirement",
    link: "/resources/retirement-planning",
  },
  {
    title: "Understanding Credit Scores",
    description:
      "Learn what factors affect your credit score and how to improve it for better financial opportunities.",
    imageUrl: "/credit-score-finance.png",
    category: "Credit",
    link: "/resources/credit-scores",
  },
  {
    title: "Tax Planning Essentials",
    description: "Maximize your tax benefits and avoid common pitfalls with these essential tax planning strategies.",
    imageUrl: "/placeholder.svg?height=400&width=600&query=tax+planning+finance",
    category: "Taxes",
    link: "https://www.irs.gov/individuals/tax-withholding-estimator",
    isExternal: true,
  },
  {
    title: "Home Buying Process",
    description: "A step-by-step guide to the home buying process, from saving for a down payment to closing the deal.",
    imageUrl: "/placeholder.svg?height=400&width=600&query=home+buying+real+estate",
    category: "Real Estate",
    link: "/resources/home-buying",
  },
  {
    title: "Financial Planning for Families",
    description: "Learn how to create a financial plan that addresses the unique needs and goals of your family.",
    imageUrl: "/placeholder.svg?height=400&width=600&query=family+financial+planning",
    category: "Family Finance",
    link: "/resources/family-planning",
  },
]

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Extract unique categories
  const categories = Array.from(new Set(resourcesData.map((resource) => resource.category)))

  // Filter resources based on search query and selected category
  const filteredResources = resourcesData.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-nairawise-dark mb-4">Financial Education Resources</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore our collection of resources designed to help you improve your financial literacy and make informed
          decisions about your money.
        </p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            className="pl-10 border-nairawise-medium focus:border-nairawise-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ResourceCategoryTabs categories={categories} onSelectCategory={setSelectedCategory} />
      </div>

      {filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No resources found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="mt-16 bg-nairawise-dark text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Personalized Financial Guidance?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Take our comprehensive financial assessment to receive tailored recommendations based on your unique financial
          situation.
        </p>
        <a
          href="/assessment/start"
          className="inline-block px-6 py-3 bg-nairawise-gold text-nairawise-dark font-medium rounded-md hover:bg-opacity-90 transition-all"
        >
          Take Financial Assessment
        </a>
      </div>
    </div>
  )
}
