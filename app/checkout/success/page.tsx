'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, Package, Calendar, MapPin } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [verifying, setVerifying] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // In a real app, verify the session with your backend
    const timer = setTimeout(() => {
      setVerifying(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-lg mb-4">Confirming your order...</div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>
            Your scooter lease has been successfully processed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
              <div className="bg-sky-50 rounded-lg p-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <Package className="w-5 h-5 text-sky-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Delivery Preparation</p>
                  <p className="text-sm text-gray-600">We'll prepare your scooter for delivery</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-sky-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Delivery Confirmation</p>
                  <p className="text-sm text-gray-600">You'll receive an email with delivery details</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-sky-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-medium">Scooter Delivery</p>
                  <p className="text-sm text-gray-600">We'll deliver to your specified location</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Order confirmation has been sent to</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/subscriptions" className="flex-1">
              <Button variant="outline" className="w-full">
                View My Subscriptions
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
