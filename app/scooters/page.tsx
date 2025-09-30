'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Scooter } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Battery, Gauge, MapPin } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function ScootersPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [scooters, setScooters] = useState<Scooter[]>([])
  const [filteredScooters, setFilteredScooters] = useState<Scooter[]>([])
  const [selectedPlan, setSelectedPlan] = useState<'all' | 'basic' | 'premium'>('all')
  const [loadingScooters, setLoadingScooters] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchScooters() {
      try {
        const { data, error } = await supabase
          .from('scooters')
          .select('*')
          .eq('is_available', true)
          .order('created_at', { ascending: false })

        if (error) throw error
        setScooters(data || [])
        setFilteredScooters(data || [])
      } catch (error) {
        console.error('Error fetching scooters:', error)
      } finally {
        setLoadingScooters(false)
      }
    }

    fetchScooters()
  }, [supabase])

  useEffect(() => {
    if (selectedPlan === 'all') {
      setFilteredScooters(scooters)
    } else {
      setFilteredScooters(scooters.filter(scooter => scooter.plan_type === selectedPlan))
    }
  }, [selectedPlan, scooters])

  if (loading || loadingScooters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading scooters...</div>
      </div>
    )
  }

  if (!user) return null

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800'
      case 'Good':
        return 'bg-blue-100 text-blue-800'
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="text-gray-600 mt-2">Select between our Basic and Premium scooter plans</p>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🛴</div>
                <p className="text-sm text-gray-600 font-medium">Segway Ninebot E22</p>
              </div>
            </div>
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-2xl mb-2">Basic Plan</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-sky-600">$1.25</span>
                  <span className="text-gray-600 text-lg">/day</span>
                </div>
                <CardDescription>
                  $37.50 per month
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Battery className="w-4 h-4 mr-2" />
                  11 mile range
                </div>
                <div className="flex items-center text-gray-600">
                  <Gauge className="w-4 h-4 mr-2" />
                  Max speed: 12 mph
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Campus pickup locations
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <h4 className="font-medium mb-2">What's Included:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Free campus delivery</li>
                  <li>• Basic maintenance</li>
                  <li>• No security deposit required</li>
                  <li>• End-of-semester pickup</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout/basic" className="w-full">
                <Button variant="outline" className="w-full">
                  Choose Basic Plan
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-sky-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-sky-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            </div>
            <div className="h-48 bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🛴</div>
                <p className="text-sm text-sky-700 font-medium">Segway Ninebot ES2</p>
              </div>
            </div>
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-2xl mb-2">Premium Plan</CardTitle>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-sky-600">$1.75</span>
                  <span className="text-gray-600 text-lg">/day</span>
                </div>
                <CardDescription>
                  $52.50 per month
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Battery className="w-4 h-4 mr-2" />
                  19 mile range
                </div>
                <div className="flex items-center text-gray-600">
                  <Gauge className="w-4 h-4 mr-2" />
                  Max speed: 15 mph
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  Priority pickup locations
                </div>
              </div>
              
              <div className="bg-sky-50 rounded-lg p-3 text-sm">
                <h4 className="font-medium mb-2">What's Included:</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Free campus delivery</li>
                  <li>• Priority maintenance & support</li>
                  <li>• No security deposit required</li>
                  <li>• Enhanced battery life</li>
                  <li>• End-of-semester pickup</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/checkout/premium" className="w-full">
                <Button className="w-full">
                  Choose Premium Plan
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
