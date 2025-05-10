"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

interface FooterSettings {
  company_name: string
  company_description: string
  contact_email: string
  contact_phone: string
  address: string
  copyright_text: string
  facebook_url: string
  twitter_url: string
  instagram_url: string
  linkedin_url: string
}

interface QuickLink {
  id: string | number
  title: string
  url: string
  display_order: number
}

// Default values in case the database fetch fails
const defaultSettings: FooterSettings = {
  company_name: "NairaWise",
  company_description:
    "Empowering Nigerians to make informed financial decisions through education, assessment, and personalized guidance.",
  contact_email: "contact@nairawise.com",
  contact_phone: "+234 123 456 7890",
  address: "Lagos, Nigeria",
  copyright_text: "© 2023 NairaWise. All rights reserved.",
  facebook_url: "https://facebook.com",
  twitter_url: "https://twitter.com",
  instagram_url: "https://instagram.com",
  linkedin_url: "https://linkedin.com",
}

// Updated default quick links to remove admin link
const defaultQuickLinks: QuickLink[] = [
  { id: "1", title: "Home", url: "/", display_order: 1 },
  { id: "2", title: "Assessment", url: "/assessment/start", display_order: 2 },
  { id: "3", title: "Resources", url: "/resources", display_order: 3 },
  // Removed Admin link
]

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(defaultQuickLinks)
  const [loading, setLoading] = useState(true)
  const [year] = useState(new Date().getFullYear())

  useEffect(() => {
    async function fetchFooterData() {
      try {
        // Use API endpoints instead of direct Supabase client calls
        const [settingsResponse, linksResponse] = await Promise.all([
          fetch("/api/footer/settings"),
          fetch("/api/footer/links"),
        ])

        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }

        if (linksResponse.ok) {
          const linksData = await linksResponse.json()
          // Filter out any admin links that might come from the database
          const filteredLinks = linksData.filter(
            (link: QuickLink) => !link.url.includes("/admin") && !link.title.toLowerCase().includes("admin"),
          )
          setQuickLinks(filteredLinks)
        }
      } catch (error) {
        console.error("Error in fetchFooterData:", error)
        // Use default values if API calls fail
        setSettings(defaultSettings)
        setQuickLinks(defaultQuickLinks)
      } finally {
        setLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  if (loading) {
    return <div className="bg-nairawise-dark text-white py-8">Loading footer...</div>
  }

  return (
    <footer className="bg-nairawise-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/images/nairawise-logo.png" alt="NairaWise Logo" width={40} height={40} />
              <span className="text-xl font-bold">{settings?.company_name}</span>
            </div>
            <p className="text-gray-300 mb-4">{settings?.company_description}</p>
            <div className="flex space-x-4">
              <a
                href={settings?.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={settings?.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={settings?.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={settings?.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-gray-300 hover:text-white transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
              {/* Removed Admin Dashboard link */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>{settings?.address}</li>
              <li>
                <a href={`mailto:${settings?.contact_email}`} className="hover:text-white transition-colors">
                  {settings?.contact_email}
                </a>
              </li>
              <li>
                <a href={`tel:${settings?.contact_phone}`} className="hover:text-white transition-colors">
                  {settings?.contact_phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for financial tips and updates.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full text-gray-900 rounded-l-md focus:outline-none"
              />
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-r-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>
            &copy; {year} {settings?.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  )
}
