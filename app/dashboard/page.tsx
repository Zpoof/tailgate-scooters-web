'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Bike, Package, User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Subscription } from '@/types'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
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
          .select('*')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active')

  const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Floating Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-full px-8 py-4 shadow-lg min-w-[500px]">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-sky-600">Tailgate Scooters</h1>
            <div className="flex items-center space-x-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="rounded-full">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={signOut} className="rounded-full">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Hey {firstName} 👋</h2>
          <p className="text-gray-600 mt-2">Welcome to Tailgate Scooters</p>
        </div>

        {/* Main Action */}
        <div className="mb-8">
          <Link href="/scooters">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-sky-500/20">
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🛴</div>
                <h3 className="text-2xl font-semibold mb-2">Choose Your Plan</h3>
                <p className="text-gray-600 mb-4">Basic ($1.25/day) or Premium ($1.75/day)</p>
                <Button size="lg">
                  View Plans
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Active Subscriptions */}
        {activeSubscriptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Your Active Leases</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSubscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Active Lease</CardTitle>
                    <CardDescription>
                      {subscription.semester} • ${formatCurrency(subscription.monthly_price / 30)}/day (${formatCurrency(subscription.monthly_price)}/month)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Delivery:</span> {subscription.delivery_date}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {subscription.delivery_address}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{' '}
                        <span className="text-green-600 font-medium">Active</span>
                      </p>
                    </div>
                    <Link href={`/subscriptions/${subscription.id}`}>
                      <Button variant="outline" size="sm" className="mt-4">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/scooters">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Bike className="w-8 h-8 mx-auto mb-3 text-sky-500" />
                <h4 className="font-semibold">Choose Plan</h4>
                <p className="text-sm text-gray-600 mt-1">Basic or Premium</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/subscriptions">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="w-8 h-8 mx-auto mb-3 text-sky-500" />
                <h4 className="font-semibold">My Subscriptions</h4>
                <p className="text-sm text-gray-600 mt-1">Manage your leases</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/profile">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <User className="w-8 h-8 mx-auto mb-3 text-sky-500" />
                <h4 className="font-semibold">Profile</h4>
                <p className="text-sm text-gray-600 mt-1">Update your info</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
