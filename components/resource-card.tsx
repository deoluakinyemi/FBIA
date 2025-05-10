"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export interface ResourceCardProps {
  title: string
  description: string
  imageUrl: string
  category: string
  link: string
  isExternal?: boolean
}

export function ResourceCard({ title, description, imageUrl, category, link, isExternal = false }: ResourceCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardContent className="p-5">
        <Badge variant="outline" className="mb-2 bg-nairawise-gold/10 text-nairawise-dark border-nairawise-gold/30">
          {category}
        </Badge>
        <h3 className="mb-2 text-xl font-bold text-nairawise-dark">{title}</h3>
        <p className="text-gray-600 line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-nairawise-dark hover:text-nairawise-medium font-medium"
          >
            Read More <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        ) : (
          <Link href={link} className="text-nairawise-dark hover:text-nairawise-medium font-medium">
            Read More
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
