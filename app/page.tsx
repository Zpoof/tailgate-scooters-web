'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Download, ArrowRight, Star, MapPin, Shield, Clock } from 'lucide-react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'

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
      <Navigation />

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
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Side - Phone Mockup and Content */}
            <div className="relative">

              {/* Content Below Phone */}
              <div className="text-center space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Lease Premium Scooters
                    <br />
                    <span className="font-sports text-sky-600">for Cornell Campus</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-md mx-auto">
                    Professional scooter leasing service designed for Cornell students
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
                  <span className="text-4xl font-bold text-sky-600">$1.25</span>
                  <span className="text-gray-600">/day</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">$37.50/month</p>
                
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
                    <span>Free dorm delivery</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Maintenance included</span>
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
                  <span className="text-4xl font-bold text-sky-600">$1.75</span>
                  <span className="text-gray-600">/day</span>
                </div>
                <p className="text-sm text-gray-500 mb-8">$52.50/month</p>
                
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
                    <span>Priority dorm delivery</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Premium maintenance & 24/7 support</span>
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

      {/* Made with Heart Footer */}
      <footer className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-lg">
            Made with ❤️ for Cornell students
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Tailgate Scooters. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}