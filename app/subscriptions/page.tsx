'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { createClient } from '@/lib/supabase/client'
import { Subscription, Scooter } from '@/types'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, Phone, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'

interface SubscriptionWithScooter extends Subscription {
  scooter?: Scooter
}

export default function SubscriptionsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithScooter[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select(`
            *,
            scooter:scooters(*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setSubscriptions(data || [])
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setLoadingSubscriptions(false)
      }
    }

    fetchSubscriptions()
  }, [user, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return

    try {
      // In a real app, call your backend to cancel the Stripe subscription
      const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionId)

      if (error) throw error

      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub.id === subscriptionId ? { ...sub, status: 'cancelled' } : sub
      ))
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please try again.')
    }
  }

  if (loading || loadingSubscriptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading subscriptions...</div>
      </div>
    )
  }

  if (!user) return null

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')
  const pastSubscriptions = subscriptions.filter(sub => sub.status !== 'active')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-8 py-4 shadow-lg min-w-[500px]">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-sky-600">My Subscriptions</h1>
            <div></div> {/* Spacer for balance */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
          <p className="text-gray-600 mt-2">Manage your scooter leases</p>
        </div>

        {subscriptions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-5xl mb-4">🛴</div>
              <p className="text-gray-500 mb-4">You don't have any subscriptions yet</p>
              <Link href="/scooters">
                <Button variant="cornell">Browse Available Scooters</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Active Subscriptions */}
            {activeSubscriptions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Active Leases</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeSubscriptions.map((subscription) => (
                    <Card key={subscription.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {subscription.scooter?.title || 'Scooter Lease'}
                            </CardTitle>
                            <CardDescription>
                              {subscription.scooter?.brand} {subscription.scooter?.model}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            {subscription.semester} • Started {format(new Date(subscription.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            ${formatCurrency(subscription.monthly_price)}/month
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            {subscription.delivery_address}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-600">
                            {subscription.contact_number}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelSubscription(subscription.id)}
                        >
                          Cancel Lease
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Past Subscriptions */}
            {pastSubscriptions.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Past Leases</h2>
                <div className="space-y-4">
                  {pastSubscriptions.map((subscription) => (
                    <Card key={subscription.id} className="bg-gray-50">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-base">
                              {subscription.scooter?.title || 'Scooter Lease'}
                            </CardTitle>
                            <CardDescription>
                              {subscription.semester} • {format(new Date(subscription.created_at), 'MMM yyyy')}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(subscription.status)}>
                            {subscription.status}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
