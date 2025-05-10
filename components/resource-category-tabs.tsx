"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface ResourceCategoryTabsProps {
  categories: string[]
  onSelectCategory: (category: string) => void
}

export function ResourceCategoryTabs({ categories, onSelectCategory }: ResourceCategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onSelectCategory(category)
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => handleCategoryClick("All")}
        className={cn(
          "px-4 py-2 rounded-full transition-all",
          activeCategory === "All" ? "bg-nairawise-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={cn(
            "px-4 py-2 rounded-full transition-all",
            activeCategory === category
              ? "bg-nairawise-dark text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200",
          )}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
