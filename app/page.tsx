'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Bike, MapPin, Shield, Clock, Download, ArrowRight, Star, Zap, Users } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Extended Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Sports Font */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🛴</span>
              </div>
              <h1 className="font-sports text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                TAILGATE SCOOTERS
              </h1>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#app" className="text-gray-600 hover:text-sky-600 font-medium transition-colors">
                Mobile App
              </Link>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="font-medium">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-medium px-6">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Large Scooter Image */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left lg:pr-8">
              <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full text-sky-700 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Cornell's #1 Scooter Service
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Your Campus
                <span className="block bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
                  Ride Awaits
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Lease premium electric scooters by the semester at Cornell. 
                Affordable, convenient, and perfect for campus life.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg px-8 py-4 h-auto">
                    <Zap className="w-5 h-5 mr-2" />
                    Lease a Scooter
                  </Button>
                </Link>
                <Link href="/scooters">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 h-auto border-2">
                    Browse Fleet
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-sky-500" />
                  <span>500+ Students</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-sky-500" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-sky-500" />
                  <span>Fully Insured</span>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/scooter-hero.svg"
                  alt="Premium Electric Scooter"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-blue-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section id="app" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* App Mockup */}
            <div className="relative flex justify-center lg:justify-start">
              <div className="relative">
                <Image
                  src="/app-mockup.svg"
                  alt="Tailgate Scooters Mobile App"
                  width={300}
                  height={600}
                  className="w-80 h-auto drop-shadow-2xl"
                />
                {/* Floating elements around phone */}
                <div className="absolute -top-4 -right-4 bg-green-100 rounded-full p-3">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-blue-100 rounded-full p-3">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>
            
            {/* App Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-100 to-blue-100 rounded-full text-sky-700 text-sm font-medium mb-6">
                <Download className="w-4 h-4 mr-2" />
                Coming Soon to iOS
              </div>
              
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Manage Your Lease
                <span className="block text-sky-600">On the Go</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Track your scooter, manage payments, request maintenance, and more - all from your phone. 
                The future of campus transportation is in your pocket.
              </p>
              
              {/* App Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-gray-700">Real-time GPS tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-gray-700">Instant support chat</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-gray-700">Maintenance scheduling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                    <Bike className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-gray-700">Usage analytics</span>
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {/* App Store Button */}
                <button className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors">
                  <div className="flex items-center space-x-3">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-lg font-semibold -mt-1">App Store</div>
                    </div>
                  </div>
                </button>
                
                {/* Get Started Web Button */}
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-lg px-8 py-4 h-auto">
                    Get Started Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Tailgate Scooters?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make campus transportation simple, affordable, and reliable for Cornell students.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Semester Leases</h3>
              <p className="text-gray-600">Flexible leasing options for Fall, Spring, or full year</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Campus Delivery</h3>
              <p className="text-gray-600">Free delivery to your dorm or apartment</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Fully Insured</h3>
              <p className="text-gray-600">Optional insurance coverage for peace of mind</p>
            </div>
            
            <div className="text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-br from-sky-100 to-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bike className="w-8 h-8 text-sky-600" />
              </div>
              <h3 className="font-bold text-xl mb-3">Quality Scooters</h3>
              <p className="text-gray-600">Well-maintained, reliable scooters</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Affordable semester leasing for every Cornell student. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-sky-600">$1.25</span>
                  <span className="text-gray-600 text-lg">/day</span>
                </div>
                <p className="text-gray-600">$37.50 per month</p>
                <p className="text-sm text-gray-500">Segway Ninebot E22</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Segway Ninebot E22</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Free campus delivery</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Basic maintenance</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>End-of-semester pickup</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>11 mile range, 12 mph</span>
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button variant="outline" size="lg" className="w-full font-semibold">
                  Choose Basic
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-sky-50 rounded-xl p-8 border-2 border-sky-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold text-sky-600">$1.75</span>
                  <span className="text-gray-600 text-lg">/day</span>
                </div>
                <p className="text-gray-600">$52.50 per month</p>
                <p className="text-sm text-gray-500">Segway Ninebot ES2</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Segway Ninebot ES2</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Free campus delivery</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Priority maintenance & support</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>End-of-semester pickup</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>19 mile range, 15 mph</span>
                </li>
                <li className="flex items-center">
                  <span className="text-sky-600 mr-2">✓</span>
                  <span>Enhanced battery life</span>
          </li>
              </ul>
              <Link href="/auth/signup">
                <Button size="lg" className="w-full font-semibold">
                  Choose Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xl font-bold">🛴</span>
                </div>
                <h3 className="font-sports text-xl font-bold text-white">TAILGATE SCOOTERS</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Cornell's premier scooter leasing service. Making campus transportation simple, 
                affordable, and sustainable for students.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm">📧</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                  <span className="text-sm">📱</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/scooters" className="hover:text-white transition-colors">Browse Scooters</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Get Started</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@tailgatescooters.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Help Center</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Tailgate Scooters. Made with ❤️ for Cornell students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}