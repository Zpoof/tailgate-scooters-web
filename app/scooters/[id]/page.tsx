'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Scooter } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Battery, Gauge, MapPin, Shield, Truck, Calendar } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function ScooterDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [scooter, setScooter] = useState<Scooter | null>(null)
  const [loadingScooter, setLoadingScooter] = useState(true)
  const supabase = createClient()
  const scooterId = params.id as string

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchScooter() {
      try {
        const { data, error } = await supabase
          .from('scooters')
          .select('*')
          .eq('id', scooterId)
          .single()

        if (error) throw error
        setScooter(data)
      } catch (error) {
        console.error('Error fetching scooter:', error)
        router.push('/scooters')
      } finally {
        setLoadingScooter(false)
      }
    }

    if (scooterId) {
      fetchScooter()
    }
  }, [scooterId, supabase, router])

  if (loading || loadingScooter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading scooter details...</div>
      </div>
    )
  }

  if (!user || !scooter) return null

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
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-8 py-4 shadow-lg min-w-[500px]">
          <div className="flex items-center justify-between">
            <Link href="/scooters">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-sky-600">Scooter Details</h1>
            <div></div> {/* Spacer for balance */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div>
            <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🛴</div>
                <p className="text-gray-500">{scooter.brand} {scooter.model}</p>
              </div>
            </div>
            
            {/* Additional Images Placeholder */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg h-24 flex items-center justify-center">
                  <span className="text-2xl">🛴</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{scooter.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {scooter.brand} {scooter.model}
                    </CardDescription>
                  </div>
                  <Badge className={getConditionColor(scooter.condition)}>
                    {scooter.condition}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <span className="text-3xl font-bold text-sky-600">${formatCurrency(scooter.monthly_price)}</span>
                  <span className="text-gray-600 text-lg">/month</span>
                  <p className="text-sm text-gray-500 mt-1">Just ${formatCurrency(scooter.monthly_price / 30)} per day</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{scooter.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Specifications</h3>
                  <div className="space-y-2">
                    {scooter.battery_life && (
                      <div className="flex items-center text-gray-600">
                        <Battery className="w-4 h-4 mr-2" />
                        Battery Life: {scooter.battery_life}
                      </div>
                    )}
                    {scooter.max_speed && (
                      <div className="flex items-center text-gray-600">
                        <Gauge className="w-4 h-4 mr-2" />
                        Max Speed: {scooter.max_speed}
                      </div>
                    )}
                    {scooter.range && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        Range: {scooter.range}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">What's Included</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Truck className="w-4 h-4 mr-2" />
                      Free delivery to your dorm
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Optional insurance coverage
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Flexible semester lease terms
                    </div>
                  </div>
                </div>

                <div className="bg-cornell-lightgray rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Pickup Location:</span> {scooter.location}
                  </p>
                </div>
              </CardContent>

              <CardFooter>
                {scooter.is_available ? (
                  <Link href={`/checkout/${scooter.id}`} className="w-full">
                    <Button size="lg" className="w-full">
                      Lease This Scooter
                    </Button>
                  </Link>
                ) : (
                  <Button variant="secondary" size="lg" className="w-full" disabled>
                    Currently Unavailable
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
