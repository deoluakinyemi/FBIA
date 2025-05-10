"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 z-10">
            <div className="relative h-16 w-16 overflow-hidden">
              <Image
                src="/images/nairawise-logo.png"
                alt="NairaWise"
                width={64}
                height={64}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-2xl font-bold text-nairawise-dark">NairaWise</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="text-nairawise-dark hover:text-nairawise-medium font-medium">
              Home
            </Link>
            <Link href="/assessment/start" className="text-nairawise-dark hover:text-nairawise-medium font-medium">
              Assessment
            </Link>
            <Link href="/dashboard" className="text-nairawise-dark hover:text-nairawise-medium font-medium">
              Dashboard
            </Link>
            <Link href="/resources" className="text-nairawise-dark hover:text-nairawise-medium font-medium">
              Resources
            </Link>
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden md:block">
            <Link href="/assessment/start">
              <Button
                size="lg"
                className="bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold shadow-md transition-all hover:shadow-lg hover:scale-105"
              >
                Start Assessment
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-nairawise-dark p-2 rounded-md"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-24 px-4">
          <nav className="flex flex-col space-y-6 items-center">
            <Link
              href="/"
              className="text-xl font-medium text-nairawise-dark hover:text-nairawise-medium"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/assessment/start"
              className="text-xl font-medium text-nairawise-dark hover:text-nairawise-medium"
              onClick={toggleMenu}
            >
              Assessment
            </Link>
            <Link
              href="/dashboard"
              className="text-xl font-medium text-nairawise-dark hover:text-nairawise-medium"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/resources"
              className="text-xl font-medium text-nairawise-dark hover:text-nairawise-medium"
              onClick={toggleMenu}
            >
              Resources
            </Link>

            <div className="pt-6 w-full">
              <Link href="/assessment/start" onClick={toggleMenu}>
                <Button className="w-full py-6 text-lg bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold shadow-md">
                  Start Assessment
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
