"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Default footer data in case API fails
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

const defaultLinks = [
  { id: "1", title: "Home", url: "/", display_order: 1 },
  { id: "2", title: "Assessment", url: "/assessment/start", display_order: 2 },
  { id: "3", title: "Dashboard", url: "/dashboard", display_order: 3 },
  { id: "4", title: "Resources", url: "/resources", display_order: 4 },
  { id: "5", title: "About Us", url: "/about", display_order: 5 },
]

export function Footer() {
  const [settings, setSettings] = useState(defaultSettings)
  const [links, setLinks] = useState(defaultLinks)
  const [email, setEmail] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    // Fetch footer settings
    fetch("/api/footer/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setSettings(data)
        }
      })
      .catch((err) => {
        console.error("Error fetching footer settings:", err)
      })

    // Fetch footer links
    fetch("/api/footer/links")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error && Array.isArray(data)) {
          setLinks(data)
        }
      })
      .catch((err) => {
        console.error("Error fetching footer links:", err)
      })
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Subscribe email:", email)
    // Reset form
    setEmail("")
    // Show success message or toast
  }

  return (
    <footer className="bg-nairawise-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand and About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/nairawise-logo.png"
                alt="NairaWise"
                width={40}
                height={40}
                className="bg-white rounded-full p-1"
              />
              <span className="text-xl font-bold">NairaWise</span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering you to make wise financial decisions for a secure and prosperous future.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <div className="bg-nairawise-medium/20 hover:bg-nairawise-medium/40 p-2 rounded-full transition-colors">
                  <Facebook size={20} />
                </div>
              </a>
              <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <div className="bg-nairawise-medium/20 hover:bg-nairawise-medium/40 p-2 rounded-full transition-colors">
                  <Twitter size={20} />
                </div>
              </a>
              <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <div className="bg-nairawise-medium/20 hover:bg-nairawise-medium/40 p-2 rounded-full transition-colors">
                  <Instagram size={20} />
                </div>
              </a>
              <a href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <div className="bg-nairawise-medium/20 hover:bg-nairawise-medium/40 p-2 rounded-full transition-colors">
                  <Linkedin size={20} />
                </div>
              </a>
            </div>
            <Link href="/assessment/start">
              <Button className="w-full bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-bold">
                Start Assessment
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-nairawise-gold pb-2">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-gray-300 hover:text-nairawise-gold transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 border-b border-nairawise-gold pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-nairawise-gold shrink-0 mt-0.5" />
                <span className="text-gray-300">{settings.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-nairawise-gold shrink-0" />
                <span className="text-gray-300">{settings.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-nairawise-gold shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-gray-300 hover:text-nairawise-gold transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          {settings.newsletter_enabled && (
            <div>
              <h3 className="text-lg font-bold mb-4 border-b border-nairawise-gold pb-2">Newsletter</h3>
              <p className="text-gray-300 mb-4">{settings.newsletter_text}</p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Button
                  type="submit"
                  className="w-full bg-nairawise-cta hover:bg-nairawise-cta/90 text-white font-medium"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-6 text-center text-gray-400 text-sm">
          <p>
            &copy; {year} {settings.copyright_text}
          </p>
        </div>
      </div>
    </footer>
  )
}
