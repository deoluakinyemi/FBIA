"use client"

import { useState } from "react"

interface ResourceCategoryTabsProps {
  categories: string[]
  onSelectCategory: (category: string) => void
}

export function ResourceCategoryTabs({ categories, onSelectCategory }: ResourceCategoryTabsProps) {
  const [activeCategory, setActiveCategory] = useState("All")

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)
    onSelectCategory(category)
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button
        onClick={() => handleCategoryClick("All")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeCategory === "All" ? "bg-nairawise-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryClick(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeCategory === category ? "bg-nairawise-dark text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
