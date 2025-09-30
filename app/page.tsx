'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download, ArrowRight, Star, MapPin, Shield, Clock } from 'lucide-react'
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
    <div className="min-h-screen bg-white">
      {/* Floating Top Navigation Bar */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image src="/app-icon-1024.png" alt="Tailgate Scooters" width={32} height={32} className="rounded-lg" />
            <h1 className="font-sports text-lg font-bold text-gray-900">
              TAILGATE SCOOTERS
            </h1>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 mx-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
              About
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
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
          </div>
        </div>
      </nav>

      {/* Main Hero Section - Single Row Layout */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Scooter Image */}
            <div className="relative">
              <div className="relative w-full h-[600px]">
                <Image 
                  src="/scooter.jpg" 
                  alt="Tailgate Scooter" 
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Phone Mockup and Content */}
            <div className="relative">
              {/* Phone Mockup */}
              <div className="relative w-80 h-[600px] mx-auto mb-8">
                <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl">
                  <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Phone Screen Content */}
                    <div className="h-full bg-white flex flex-col">
                      {/* Status Bar */}
                      <div className="h-12 bg-gray-50 flex items-center justify-between px-6 text-xs font-medium">
                        <span>9:41</span>
                        <div className="flex space-x-1">
                          <div className="w-4 h-2 bg-black rounded-sm"></div>
                          <div className="w-4 h-2 bg-black rounded-sm"></div>
                          <div className="w-4 h-2 bg-black rounded-sm"></div>
                        </div>
                      </div>
                      
                      {/* App Header */}
                      <div className="px-6 py-4 border-b">
                        <div className="flex items-center space-x-3">
                          <Image src="/app-icon-1024.png" alt="App Icon" width={40} height={40} className="rounded-lg" />
                          <div>
                            <h3 className="font-bold text-lg">Tailgate Scooters</h3>
                            <p className="text-gray-500 text-sm">Find your ride</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Map Area */}
                      <div className="flex-1 bg-gray-100 relative">
                        <div className="absolute inset-4 bg-green-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <MapPin className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-800">Available Scooters</p>
                            <p className="text-xs text-green-600">Near Cornell University</p>
                          </div>
                        </div>
                        
                        {/* Scooter Pins */}
                        <div className="absolute top-8 left-8 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="absolute top-16 right-12 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-20 left-12 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Bottom Action */}
                      <div className="p-6">
                        <button className="w-full bg-black text-white py-4 rounded-xl font-medium">
                          Find Nearest Scooter
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Below Phone */}
              <div className="text-center space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Buy & Lease Scooters
                    <br />
                    <span className="font-sports text-sky-600">from Cornell Students</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-md mx-auto">
                    The marketplace connecting Cornell students for scooter sales and leases
                  </p>
                </div>

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link href="/auth/signup">
                    <Button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full text-lg font-medium flex items-center space-x-2">
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  {/* Official App Store Button */}
                  <a href="https://apps.apple.com/app/tailgate-scooters" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                      alt="Download on the App Store" 
                      className="h-12 w-auto"
                    />
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center space-x-6 pt-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">4.9 Rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Insured</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Tailgate Scooters?</h2>
            <p className="text-xl text-gray-600">Built by students, for students</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Campus Focused</h3>
              <p className="text-gray-600">Designed specifically for Cornell University and campus life</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">All rentals are insured and users are verified</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Rentals</h3>
              <p className="text-gray-600">Rent by the hour, day, or semester - whatever works for you</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Affordable Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that works for you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 relative">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic Plan</h3>
                <p className="text-gray-600 mb-6">Segway Ninebot E22</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sky-600">$37.50</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">Just $1.25/day</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>11 mile range</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>12 mph max speed</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Campus pickup available</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Basic maintenance included</span>
                  </li>
                </ul>
                
                <Link href="/checkout/basic">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl">
                    Choose Basic
                  </Button>
                </Link>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white border-2 border-sky-600 rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-sky-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h3>
                <p className="text-gray-600 mb-6">Segway Ninebot ES2</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-sky-600">$52.50</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">Just $1.75/day</p>
                
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>19 mile range</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>15 mph max speed</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Priority campus pickup</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Premium maintenance & support</span>
                  </li>
                </ul>
                
                <Link href="/checkout/premium">
                  <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-xl">
                    Choose Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Riding?</h2>
          <p className="text-xl text-gray-600 mb-8">Join hundreds of Cornell students already using Tailgate Scooters</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-full text-lg font-medium">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/scooters">
              <Button variant="outline" className="border-2 border-sky-600 text-sky-600 hover:bg-sky-50 px-8 py-3 rounded-full text-lg font-medium">
                Browse Scooters
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}