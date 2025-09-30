import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function GET() {
  try {
    // Test the connection by retrieving account info
    const account = await stripe.accounts.retrieve()
    
    return NextResponse.json({
      success: true,
      livemode: account.details_submitted,
      account_id: account.id,
      country: account.country,
      message: account.details_submitted ? 'LIVE MODE ACTIVE' : 'TEST MODE ACTIVE'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

export async function POST() {
  try {
    // Test creating a customer
    const customer = await stripe.customers.create({
      email: 'test@tailgatescooters.com',
      name: 'Test Customer'
    })
    
    return NextResponse.json({
      success: true,
      customer_id: customer.id,
      livemode: customer.livemode,
      message: customer.livemode ? 'LIVE CUSTOMER CREATED' : 'TEST CUSTOMER CREATED'
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
