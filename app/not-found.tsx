import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] py-16 text-center">
      <h1 className="text-6xl font-bold text-nairawise-dark mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-nairawise-dark mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="bg-nairawise-dark text-white px-6 py-3 rounded-md hover:bg-nairawise-dark/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  )
}
