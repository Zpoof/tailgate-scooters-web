import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      )
    }

    // Get the subscription from database to get Stripe subscription ID
    const { data: subscription, error: fetchError } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, user_id, status')
      .eq('id', subscriptionId)
      .eq('user_id', user.id) // Ensure user owns this subscription
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Check if subscription is already cancelled
    if (subscription.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Subscription is already cancelled' },
        { status: 400 }
      )
    }

    // Cancel the subscription in Stripe
    try {
      const stripeSubscription = await stripe.subscriptions.cancel(
        subscription.stripe_subscription_id
      )

      console.log('Stripe subscription cancelled:', stripeSubscription.id)
    } catch (stripeError: any) {
      console.error('Error cancelling Stripe subscription:', stripeError)
      
      // If Stripe cancellation fails, still update our database
      // This handles cases where the Stripe subscription might already be cancelled
      if (stripeError.code !== 'resource_missing') {
        return NextResponse.json(
          { error: 'Failed to cancel subscription in Stripe' },
          { status: 500 }
        )
      }
    }

    // Update subscription status in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Error updating subscription in database:', updateError)
      return NextResponse.json(
        { error: 'Failed to update subscription status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription cancelled successfully'
    })

  } catch (error: any) {
    console.error('Error in cancel-subscription API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
