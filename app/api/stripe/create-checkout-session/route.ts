import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { STRIPE_PRICES } from '@/lib/stripe/prices'

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
    const {
      planType, // 'basic' or 'premium'
      semester,
      deliveryAddress,
      contactNumber,
      deliveryDate,
      deliveryTime,
      includeInsurance,
      lockType, // 'none', 'cable', 'ulock'
    } = body

    // Define plan details with Stripe price IDs
    const planDetails = {
      basic: {
        priceId: STRIPE_PRICES.BASIC_PLAN,
        name: 'Basic Plan - Segway Ninebot E22',
        monthlyPrice: 37.50,
      },
      premium: {
        priceId: STRIPE_PRICES.PREMIUM_PLAN,
        name: 'Premium Plan - Segway Ninebot ES2', 
        monthlyPrice: 52.50,
      }
    }

    const selectedPlan = planDetails[planType as keyof typeof planDetails]
    if (!selectedPlan) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    let stripeCustomerId = user.user_metadata?.stripe_customer_id

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      stripeCustomerId = customer.id

      // Update user profile with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id)
    }

    // Create line items using existing Stripe prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: selectedPlan.priceId,
        quantity: 1,
      },
    ]

    // Add insurance if selected
    if (includeInsurance) {
      lineItems.push({
        price: STRIPE_PRICES.INSURANCE,
        quantity: 1,
      })
    }

    // Add lock if selected
    if (lockType === 'cable') {
      lineItems.push({
        price: STRIPE_PRICES.LOCK,
        quantity: 1,
      })
    } else if (lockType === 'ulock') {
      lineItems.push({
        price: STRIPE_PRICES.U_LOCK,
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/scooters`,
      metadata: {
        user_id: user.id,
        plan_type: planType,
        semester,
        delivery_address: deliveryAddress,
        contact_number: contactNumber,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        include_insurance: includeInsurance.toString(),
        lock_type: lockType,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
