'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Phone, Shield, Battery, Gauge, Star } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { formatCurrency, addCurrency } from '@/lib/utils'

export default function PremiumCheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    semester: 'Fall Semester',
    deliveryAddress: '',
    contactNumber: '',
    deliveryDate: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    deliveryTime: 'morning',
    includeInsurance: true, // Default to true for premium
    includeLock: true,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading checkout...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/auth/login')
    return null
  }

  const dailyPrice = 1.75
  const monthlyPrice = 52.50
  const insurancePrice = formData.includeInsurance ? 9.99 : 0
  const lockPrice = formData.includeLock ? 20 : 0
  const totalMonthly = addCurrency(monthlyPrice, insurancePrice)
  const totalUpfront = addCurrency(totalMonthly, lockPrice)

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
          planType: 'premium',
          ...formData,
          includeLock: formData.includeLock,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setProcessing(false)
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
            <h1 className="text-lg font-semibold text-sky-600">Premium Plan Checkout</h1>
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

              {/* Insurance Protection */}
              <Card className="mb-6 border-sky-200 bg-sky-50">
                <CardHeader>
                  <CardTitle className="text-sky-800">🛡️ Damage Protection Insurance</CardTitle>
                  <CardDescription className="text-sky-700">
                    Highly recommended - covers expensive repairs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3 mb-4">
                    <Checkbox
                      id="insurance"
                      checked={formData.includeInsurance}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeInsurance: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="insurance" className="cursor-pointer">
                        <span className="font-medium flex items-center text-sky-800">
                          <Shield className="w-4 h-4 mr-1" />
                          Add Damage Protection - $9.99/month
                        </span>
                        <div className="text-sm text-sky-700 mt-2 space-y-1">
                          <p>• Covers damage from accidents and normal wear</p>
                          <p>• Wheel replacement: $150 (covered with insurance)</p>
                          <p>• Battery replacement: $300 (covered with insurance)</p>
                          <p className="font-medium">⚠️ Does NOT cover theft or loss</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lock Option */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>🔒 Security Lock</CardTitle>
                  <CardDescription>Protect your scooter from theft</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="lock"
                      checked={formData.includeLock}
                      onCheckedChange={(checked) => 
                        setFormData({ ...formData, includeLock: checked as boolean })
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor="lock" className="cursor-pointer">
                        <span className="font-medium">
                          Add High-Quality Lock - $20 one-time
                        </span>
                        <span className="text-sm text-gray-600 block mt-1">
                          Heavy-duty cable lock to secure your scooter. Highly recommended for theft prevention.
                        </span>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Details */}
              <Card className="mb-6 border-sky-500">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-sky-500" />
                    Premium Plan Details
                  </CardTitle>
                  <CardDescription>Segway Ninebot ES2 - Enhanced performance and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Battery className="w-4 h-4 mr-2 text-sky-500" />
                      <span>19 mile range</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="w-4 h-4 mr-2 text-sky-500" />
                      <span>15 mph max speed</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-sky-500" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Same form content as basic but with premium styling */}
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


              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Continue to Payment'}
              </Button>

              {/* Theft & Loss Policy */}
              <Card className="mt-6 border-gray-200 bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-gray-800">📋 Responsibility & Loss Policy</CardTitle>
                  <CardDescription className="text-gray-600">
                    Important information about scooter responsibility
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <div className="space-y-2">
                    <p>• You are responsible for the scooter during your lease period</p>
                    <p>• If the scooter is lost or stolen, a $400 replacement fee will be charged</p>
                    <p>• This covers our cost to replace the unit</p>
                    <p>• We recommend getting a lock for theft prevention</p>
                    <p>• Insurance covers accidental damage, but not theft or loss</p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24 border-sky-500">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-sky-500" />
                  Premium Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-sky-100 to-sky-200 rounded-lg p-3">
                    <span className="text-2xl">🛴</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Premium Plan</h4>
                    <p className="text-sm text-gray-500">Segway Ninebot ES2</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-sky-500 text-white">
                        Premium Plan
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="text-center mb-3">
                    <span className="text-2xl font-bold text-sky-600">${formatCurrency(dailyPrice)}</span>
                    <span className="text-gray-600">/day</span>
                    <p className="text-sm text-gray-500">${formatCurrency(monthlyPrice)}/month</p>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Monthly Lease</span>
                    <span>${formatCurrency(monthlyPrice)}/mo</span>
                  </div>
                  {formData.includeInsurance && (
                    <div className="flex justify-between text-sm">
                      <span>Enhanced Protection</span>
                      <span>${formatCurrency(insurancePrice)}/mo</span>
                    </div>
                  )}
                    {formData.includeLock && (
                      <div className="flex justify-between text-sm">
                        <span>Security Lock (one-time)</span>
                        <span>${formatCurrency(lockPrice)}</span>
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
                    By proceeding, you agree to our rental terms. You're responsible for the scooter during your lease.
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
