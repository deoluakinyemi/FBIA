import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg nairawise-shadow h-full flex flex-col">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Badge className="absolute top-3 right-3 bg-nairawise-gold text-nairawise-dark font-medium">{category}</Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-nairawise-dark">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-nairawise-dark hover:text-nairawise-medium font-medium"
          >
            Read More <ExternalLink size={16} />
          </a>
        ) : (
          <Button
            asChild
            variant="outline"
            className="border-nairawise-dark text-nairawise-dark hover:bg-nairawise-dark hover:text-white"
          >
            <Link href={link}>Read More</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
