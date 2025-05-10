"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Default footer data
const defaultSettings = {
  address: "123 Financial District, Lagos, Nigeria",
  phone: "+234 123 456 7890",
  email: "info@nairawise.com",
  facebook_url: "https://facebook.com",
  twitter_url: "https://twitter.com",
  instagram_url: "https://instagram.com",
  linkedin_url: "https://linkedin.com",
  copyright_text: "NairaWise. All rights reserved.",
  newsletter_enabled: true,
  newsletter_text: "Subscribe to our newsletter for financial tips and updates.",
}

const defaultQuickLinks = [
  { id: "1", title: "Home", url: "/", display_order: 1 },
  { id: "2", title: "Take Assessment", url: "/assessment/start", display_order: 2 },
  { id: "3", title: "Dashboard", url: "/dashboard", display_order: 3 },
  { id: "4", title: "Resources", url: "/resources", display_order: 4 },
  { id: "5", title: "About Us", url: "/about", display_order: 5 },
]

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState(defaultSettings)
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch footer data from API
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Try to fetch settings from API
        const settingsResponse = await fetch("/api/footer/settings")
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json()
          setSettings(settingsData)
        }

        // Try to fetch quick links from API
        const linksResponse = await fetch("/api/footer/links")
        if (linksResponse.ok) {
          const linksData = await linksResponse.json()
          if (Array.isArray(linksData) && linksData.length > 0) {
            setQuickLinks(linksData)
          }
        }
      } catch (error) {
        console.error("Error fetching footer data:", error)
        // Keep using default data on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  return (
    <footer className="bg-nairawise-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/nairawise-logo.png"
                  alt="NairaWise"
                  width={50}
                  height={50}
                  className="bg-white rounded-full p-1"
                />
                <span className="text-xl font-bold text-nairawise-gold">NairaWise</span>
              </div>
            </Link>
            <p className="text-sm text-gray-300 mt-2">
              Empowering financial wisdom through personalized assessments and expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-nairawise-gold font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-gray-300 hover:text-nairawise-gold transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-nairawise-gold font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-nairawise-gold shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-nairawise-gold shrink-0" />
                <span className="text-sm text-gray-300">{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-nairawise-gold shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-sm text-gray-300 hover:text-nairawise-gold transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {settings.newsletter_enabled && (
            <div>
              <h3 className="text-nairawise-gold font-semibold text-lg mb-4">Stay Updated</h3>
              <p className="text-sm text-gray-300 mb-4">{settings.newsletter_text}</p>
              <div className="flex flex-col space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-nairawise-gold/50 text-white placeholder:text-gray-400"
                />
                <Button className="bg-nairawise-gold hover:bg-nairawise-gold/90 text-nairawise-dark">Subscribe</Button>
              </div>
            </div>
          )}
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-12 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-nairawise-gold/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={settings.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-nairawise-gold/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-nairawise-gold/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={settings.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-nairawise-gold/20 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              &copy; {currentYear} {settings.copyright_text}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
