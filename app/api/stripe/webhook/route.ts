import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Create subscription record in database
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: session.metadata?.user_id,
            scooter_id: session.metadata?.scooter_id,
            stripe_subscription_id: session.subscription as string,
            stripe_customer_id: session.customer as string,
            status: 'active',
            semester: session.metadata?.semester,
            monthly_price: Number(session.amount_total) / 100,
            security_deposit: 100,
            delivery_address: session.metadata?.delivery_address,
            contact_number: session.metadata?.contact_number,
            delivery_date: session.metadata?.delivery_date,
            delivery_time: session.metadata?.delivery_time,
          })

        if (error) {
          console.error('Error creating subscription:', error)
        }

        // Mark scooter as unavailable
        await supabase
          .from('scooters')
          .update({ is_available: false })
          .eq('id', session.metadata?.scooter_id)
        
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Record payment transaction
        await supabase
          .from('payment_transactions')
          .insert({
            user_id: invoice.metadata?.user_id,
            subscription_id: invoice.subscription as string,
            amount: Number(invoice.amount_paid) / 100,
            transaction_type: 'monthly_payment',
            status: 'completed',
            description: `Monthly payment for ${invoice.period_start}`,
            stripe_payment_intent_id: invoice.payment_intent as string,
          })
        
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
