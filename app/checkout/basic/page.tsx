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
import { ArrowLeft, Calendar, MapPin, Phone, Shield, Battery, Gauge } from 'lucide-react'
import { format, addDays } from 'date-fns'
import { formatCurrency, addCurrency } from '@/lib/utils'
import Navigation from '@/components/Navigation'

export default function BasicCheckoutPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    semester: 'Fall Semester',
    deliveryAddress: '',
    contactNumber: '',
    deliveryDate: 'asap', // 'asap', 'today', or actual date
    deliveryTime: 'morning',
    includeInsurance: false,
    lockType: 'none', // 'none', 'cable', 'ulock'
  })
  
  const [agreedToLease, setAgreedToLease] = useState(false)
  const [showLeaseAgreement, setShowLeaseAgreement] = useState(false)

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

  const dailyPrice = 1.25
  const monthlyPrice = 37.50
  const insurancePrice = formData.includeInsurance ? 9.99 : 0
  const lockPrice = formData.lockType === 'cable' ? 20 : formData.lockType === 'ulock' ? 30 : 0
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
          planType: 'basic',
          ...formData,
          lockType: formData.lockType,
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
      <Navigation />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Page Header */}
        <div className="mb-8">
          <Link href="/scooters">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Plans
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Basic Plan Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your scooter lease setup</p>
        </div>
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
              <Card 
                className={`mb-6 border-2 cursor-pointer transition-all ${
                  formData.includeInsurance 
                    ? 'border-sky-500 bg-sky-50 shadow-lg ring-2 ring-sky-200' 
                    : 'border-sky-200 bg-sky-25 hover:border-sky-400 hover:shadow-md'
                }`}
                onClick={() => setFormData({ ...formData, includeInsurance: !formData.includeInsurance })}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sky-800 flex items-center text-lg">
                        🛡️ Damage Protection Insurance
                        {formData.includeInsurance && <span className="ml-2 text-green-600 text-xl">✓</span>}
                      </CardTitle>
                      <CardDescription className="text-sky-700 font-medium">
                        Highly recommended - covers expensive repairs
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-sky-600">$9.99/mo</div>
                      <Button 
                        type="button"
                        variant={formData.includeInsurance ? "default" : "outline"}
                        size="sm"
                        className={`mt-1 ${formData.includeInsurance ? "bg-green-600 hover:bg-green-700" : "border-sky-500 text-sky-600 hover:bg-sky-50"}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setFormData({ ...formData, includeInsurance: !formData.includeInsurance })
                        }}
                      >
                        {formData.includeInsurance ? "Added ✓" : "Add Protection"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-sky-700 space-y-1">
                    <p className="flex items-center"><span className="text-green-600 mr-2">✓</span>Wheel replacement: $150 value covered</p>
                    <p className="flex items-center"><span className="text-green-600 mr-2">✓</span>Battery replacement: $300 value covered</p>
                    <p className="flex items-center"><span className="text-green-600 mr-2">✓</span>Accidental damage protection</p>
                    <p className="text-xs text-amber-600 mt-2 font-medium">⚠️ Note: Does NOT cover theft or loss</p>
                  </div>
                </CardContent>
              </Card>

              {/* Security Lock Options */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center text-lg">
                    🔒 Security Lock Options
                  </CardTitle>
                  <CardDescription className="text-green-700 font-medium">
                    Choose your preferred theft protection level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.lockType}
                    onValueChange={(value) => setFormData({ ...formData, lockType: value })}
                  >
                    <div className="space-y-3">
                      {/* No Lock Option */}
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value="none" id="no-lock" />
                        <Label htmlFor="no-lock" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">No Lock</span>
                              <span className="text-sm text-gray-500 block">I'll provide my own security</span>
                            </div>
                            <span className="text-lg font-bold text-gray-600">$0</span>
                          </div>
                        </Label>
                      </div>

                      {/* Cable Lock Option */}
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 border-green-200">
                        <RadioGroupItem value="cable" id="cable-lock" />
                        <Label htmlFor="cable-lock" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-green-800">Cable Lock</span>
                              <span className="text-sm text-green-600 block">Heavy-duty cable lock - good protection</span>
                              <div className="text-xs text-green-700 mt-1 space-y-0.5">
                                <p>• Flexible and lightweight</p>
                                <p>• Quick and easy to use</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">$20</span>
                              <span className="text-xs text-green-600 block">one-time</span>
                            </div>
                          </div>
                        </Label>
                      </div>

                      {/* U-Lock Option */}
                      <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-blue-50 border-blue-300 bg-blue-25">
                        <RadioGroupItem value="ulock" id="u-lock" />
                        <Label htmlFor="u-lock" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-blue-800">U-Lock Security</span>
                                <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-500 text-white font-medium">RECOMMENDED</span>
                              </div>
                              <span className="text-sm text-blue-600 block">Heavy-duty U-lock - maximum protection</span>
                              <div className="text-xs text-blue-700 mt-1 space-y-0.5">
                                <p>• Hardened steel construction</p>
                                <p>• Maximum theft deterrent</p>
                                <p>• Professional-grade security</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-blue-600">$30</span>
                              <span className="text-xs text-blue-600 block">one-time</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                  
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 font-medium">
                      💡 Important: You're responsible for theft/loss ($400 replacement fee). A good lock is highly recommended!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Details */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Basic Plan Details</CardTitle>
                  <CardDescription>Segway Ninebot E22 - Perfect for campus commuting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <Battery className="w-4 h-4 mr-2 text-sky-500" />
                      <span>11 mile range</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="w-4 h-4 mr-2 text-sky-500" />
                      <span>12 mph max speed</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-sky-500" />
                      <span>Basic maintenance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="delivery-options">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Delivery Date
                      </Label>
                      <RadioGroup
                        value={formData.deliveryDate}
                        onValueChange={(value) => setFormData({ ...formData, deliveryDate: value })}
                        className="mt-2"
                      >
                        <div className="space-y-3">
                          {/* ASAP Option */}
                          <div className="flex items-center space-x-3 p-3 border-2 rounded-lg hover:bg-blue-50 border-blue-300 bg-blue-25">
                            <RadioGroupItem value="asap" id="asap" />
                            <Label htmlFor="asap" className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-blue-800">ASAP Delivery</span>
                                  <span className="text-sm text-blue-600 block">Within 2-4 hours (subject to availability)</span>
                                </div>
                                <span className="text-xs px-2 py-1 rounded bg-blue-500 text-white font-medium">FASTEST</span>
                              </div>
                            </Label>
                          </div>

                          {/* Today Option */}
                          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 border-green-200">
                            <RadioGroupItem value="today" id="today" />
                            <Label htmlFor="today" className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-green-800">Today</span>
                                  <span className="text-sm text-green-600 block">Same day delivery by end of day</span>
                                </div>
                                <span className="text-sm font-medium text-green-600">Free</span>
                              </div>
                            </Label>
                          </div>

                          {/* Future Date Option */}
                          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                            <RadioGroupItem value="future" id="future" />
                            <Label htmlFor="future" className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium">Schedule for Later</span>
                                  <span className="text-sm text-gray-500 block">Choose a specific date</span>
                                </div>
                                <span className="text-sm font-medium text-gray-600">Free</span>
                              </div>
                            </Label>
                          </div>
                        </div>
                      </RadioGroup>

                      {/* Date picker for future delivery */}
                      {formData.deliveryDate === 'future' && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <Label htmlFor="specific-date" className="text-sm font-medium">
                            Select Date
                          </Label>
                          <Input
                            id="specific-date"
                            type="date"
                            value={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                            min={format(new Date(), 'yyyy-MM-dd')}
                            onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                            className="mt-1"
                            required
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="time">Preferred Time</Label>
                      <RadioGroup
                        value={formData.deliveryTime}
                        onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}
                      >
                        <div className="flex items-center space-x-2 mt-2">
                          <RadioGroupItem value="morning" id="morning" />
                          <Label htmlFor="morning" className="text-sm">Morning (9 AM - 12 PM)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="afternoon" id="afternoon" />
                          <Label htmlFor="afternoon" className="text-sm">Afternoon (12 PM - 6 PM)</Label>
                        </div>
                        {formData.deliveryDate === 'asap' && (
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="asap" id="asap-time" />
                            <Label htmlFor="asap-time" className="text-sm">ASAP (Any time available)</Label>
                          </div>
                        )}
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>


              {/* Lease Agreement */}
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center">
                    📄 Lease Agreement Required
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    You must read and agree to the lease terms before proceeding
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border text-sm">
                      <h4 className="font-semibold mb-2">Key Terms Summary:</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• <strong>Lease Term:</strong> Full semester (~4 months)</li>
                        <li>• <strong>No Early Cancellation:</strong> Full payment due even if returned early</li>
                        <li>• <strong>Loss/Theft:</strong> $400 replacement charge</li>
                        <li>• <strong>Damage:</strong> Repair costs up to $400</li>
                        <li>• <strong>Liability:</strong> You ride at your own risk</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setShowLeaseAgreement(true)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        📖 Read Full Lease Agreement
                      </Button>
                      
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="lease-agreement"
                          checked={agreedToLease}
                          onCheckedChange={(checked) => setAgreedToLease(checked as boolean)}
                        />
                        <Label htmlFor="lease-agreement" className="cursor-pointer font-medium">
                          I have read and agree to the lease agreement
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={processing || !agreedToLease}
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
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-3">
                    <span className="text-2xl">🛴</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Basic Plan</h4>
                    <p className="text-sm text-gray-500">Segway Ninebot E22</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700">
                        Basic Plan
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
                      <span>Protection Plan</span>
                      <span>${formatCurrency(insurancePrice)}/mo</span>
                    </div>
                  )}
                  {formData.lockType !== 'none' && (
                    <div className="flex justify-between text-sm">
                      <span>
                        {formData.lockType === 'cable' ? 'Cable Lock' : 'U-Lock Security'} (one-time)
                      </span>
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

      {/* Lease Agreement Modal */}
      {showLeaseAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Scooter Lease Agreement</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLeaseAgreement(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-sm leading-relaxed">
{`SCOOTER LEASE AGREEMENT
Semester Scooter Lease

This Scooter Lease Agreement ("Agreement") is made between Tailgate Scooters, Inc. ("Lessor") and the undersigned student ("Lessee").

1. LEASE TERM

• Lease begins on the date the scooter is delivered and runs for approximately 4 months (one semester).
• The lease CANNOT be canceled early. Full semester payment is due even if returned early.
• If starting mid-semester, charges are prorated by month.

2. PAYMENT

• Monthly lease fee: $37.50/month (Basic Plan) or $52.50/month (Premium Plan).
• Payments auto-billed to the payment method on file.
• Lessor may pre-authorize Lessee's payment method for up to $400.

3. LOSS, THEFT, & DAMAGE

• Lessee is responsible for the scooter's condition.
• Loss or Theft: $400 charge.
• Damage: Actual repair cost up to $400.
• Optional Damage Insurance ($9.99/month) covers repairs but not loss/theft.
• Insurance must be purchased at the start of lease and billed monthly.

4. USE & SAFETY

• Lessee agrees to use scooter safely, follow traffic laws, and wear a helmet.
• Scooter may not be used for commercial purposes, racing, or illegal activity.

5. WAIVER & LIABILITY

• Lessee rides at their own risk.
• Lessor is NOT liable for any injury, death, or property damage caused by use of the scooter.

6. RETURN OF SCOOTER

• Lessee must return the scooter in reasonable condition by the end of the semester.
• Failure to return may result in a $400 charge.

7. GOVERNING LAW

• This Agreement shall be governed by the laws of the State of Delaware.

By using this service, you acknowledge that you have read, understood, and agree to be bound by this Agreement.

Tailgate Scooters, Inc.
8 The Green, STE A, Dover, DE 19901, USA
Email: support@tailgate.now`}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="modal-lease-agreement"
                    checked={agreedToLease}
                    onCheckedChange={(checked) => setAgreedToLease(checked as boolean)}
                  />
                  <Label htmlFor="modal-lease-agreement" className="cursor-pointer font-medium">
                    I have read and agree to this lease agreement
                  </Label>
                </div>
                <Button 
                  onClick={() => setShowLeaseAgreement(false)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
