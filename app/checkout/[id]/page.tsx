'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Scooter } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Phone, Shield } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { formatCurrency, addCurrency } from '@/lib/utils'

export default function CheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [scooter, setScooter] = useState<Scooter | null>(null)
  const [loadingScooter, setLoadingScooter] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const scooterId = params.id as string

  // Form data
  const [formData, setFormData] = useState({
    semester: 'Fall Semester',
    deliveryAddress: '',
    contactNumber: '',
    deliveryDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    deliveryTime: 'morning',
    includeInsurance: false,
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setProcessing(true)

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scooterId,
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setProcessing(false)
    }
  }

  if (loading || loadingScooter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading checkout...</div>
      </div>
    )
  }

  if (!user || !scooter) return null

  const monthlyPrice = scooter.monthly_price
  const insurancePrice = formData.includeInsurance ? 10 : 0
  const securityDeposit = scooter.plan_type === 'premium' ? 150 : 100
  const totalMonthly = addCurrency(monthlyPrice, insurancePrice)
  const totalUpfront = addCurrency(totalMonthly, securityDeposit)

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
            <h1 className="text-lg font-semibold text-sky-600">Checkout</h1>
            <div></div> {/* Spacer for balance */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Semester Selection */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Lease Term</CardTitle>
                  <CardDescription>Choose your semester lease period</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.semester}
                    onValueChange={(value) => setFormData({ ...formData, semester: value })}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="Fall Semester" id="fall" />
                        <Label htmlFor="fall" className="flex-1 cursor-pointer">
                          <span className="font-medium">Fall Semester</span>
                          <span className="text-sm text-gray-500 block">4 months (August - December)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="Spring Semester" id="spring" />
                        <Label htmlFor="spring" className="flex-1 cursor-pointer">
                          <span className="font-medium">Spring Semester</span>
                          <span className="text-sm text-gray-500 block">4 months (January - May)</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="Whole Year" id="year" />
                        <Label htmlFor="year" className="flex-1 cursor-pointer">
                          <span className="font-medium">Whole Year</span>
                          <span className="text-sm text-gray-500 block">8 months (Save 10%)</span>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                  <CardDescription>Where should we deliver your scooter?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Delivery Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Dorm name and room number"
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Contact Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(607) 555-0123"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Delivery Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.deliveryDate}
                        min={format(addDays(new Date(), 3), 'yyyy-MM-dd')}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <RadioGroup
                        value={formData.deliveryTime}
                        onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}
                      >
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="morning" id="morning" />
                          <Label htmlFor="morning" className="text-sm">Morning</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="afternoon" id="afternoon" />
                          <Label htmlFor="afternoon" className="text-sm">Afternoon</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Option */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Optional Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="insurance"
                      checked={formData.includeInsurance}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeInsurance: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="insurance" className="cursor-pointer">
                        <span className="font-medium flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          Scooter Protection Plan
                        </span>
                        <span className="text-sm text-gray-500 block mt-1">
                          Add comprehensive coverage for theft, damage, and accidents for just $10/month
                        </span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                variant="cornell" 
                size="lg" 
                className="w-full"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <span className="text-2xl">🛴</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{scooter.title}</h4>
                    <p className="text-sm text-gray-500">{scooter.brand} {scooter.model}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        scooter.plan_type === 'premium' 
                          ? 'bg-cornell-red text-white' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {scooter.plan_type === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Lease</span>
                    <span>${formatCurrency(monthlyPrice)}/mo</span>
                  </div>
                  {formData.includeInsurance && (
                    <div className="flex justify-between text-sm">
                      <span>Protection Plan</span>
                      <span>${formatCurrency(insurancePrice)}/mo</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Security Deposit</span>
                    <span>${formatCurrency(securityDeposit)}</span>
                  </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Refundable at lease end</span>
                    </div>
                    {scooter.plan_type === 'premium' && (
                      <div className="text-xs text-sky-600">
                        Higher deposit for premium plan
                      </div>
                    )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Due Today</span>
                    <span>${formatCurrency(totalUpfront)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>Then ${formatCurrency(totalMonthly)}/month</span>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    By proceeding, you agree to our rental terms and conditions. 
                    The security deposit is fully refundable upon return of the scooter in good condition.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
