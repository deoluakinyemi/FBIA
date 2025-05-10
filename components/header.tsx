import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
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
          <div className="flex items-center space-x-4">
            <Link
              href="/assessment/start"
              className="hidden md:inline-flex bg-nairawise-dark text-white hover:bg-nairawise-dark/90 px-4 py-2 rounded-md font-medium"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
