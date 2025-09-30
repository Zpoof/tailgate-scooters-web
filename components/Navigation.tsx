'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { PWADownloadButton } from './PWADownloadButton'

export default function Navigation() {
  const { user, loading } = useAuth()

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg px-12 py-3 w-full max-w-7xl mx-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/">
            <h1 className="font-sports text-lg font-bold text-gray-900 cursor-pointer">
              TAILGATE
            </h1>
          </Link>
        </div>
        
        {/* Navigation Links - Removed as requested */}

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          {!loading && user ? (
            // Logged in user
            <>
              <PWADownloadButton variant="icon" size="sm" />
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2">
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm rounded-full">
                  Profile
                </Button>
              </Link>
            </>
          ) : (
            // Not logged in
            <>
              <PWADownloadButton variant="icon" size="sm" />
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 text-sm rounded-full">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
