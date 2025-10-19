// app/api/webhook/stripe/route.ts
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createOrder } from '@/lib/actions/order.actions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// GET handler for testing/verification
export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is running',
    note: 'This endpoint only accepts POST requests from Stripe'
  })
}

// POST handler for actual webhooks
export async function POST(request: Request) {
  const body = await request.text()

  const sig = request.headers.get('stripe-signature') as string
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return NextResponse.json({ message: 'Webhook error', error: err }, { status: 400 })
  }

  // Get the ID and type
  const eventType = event.type

  // CREATE ORDER
  if (eventType === 'checkout.session.completed') {
    const { id, amount_total, metadata } = event.data.object

    const order = {
      stripeId: id,
      eventId: metadata?.eventId || '',
      buyerId: metadata?.buyerId || '',
      totalAmount: amount_total ? (amount_total / 100).toString() : '0',
      createdAt: new Date(),
    }

    try {
      const newOrder = await createOrder(order)
      return NextResponse.json({ message: 'OK', order: newOrder })
    } catch (error) {
      console.error('Error creating order:', error)
      return NextResponse.json({ message: 'Error creating order', error }, { status: 500 })
    }
  }

  return new Response('', { status: 200 })
}