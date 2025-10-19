import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createOrder } from '@/lib/actions/order.actions';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

// GET handler for testing
export async function GET() {
  return NextResponse.json({ 
    message: 'Stripe webhook endpoint is accessible',
    note: 'This endpoint is ready to receive Stripe webhook events'
  });
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, stripe-signature',
      'Access-Control-Max-Age': '86400',
    },
  });
}

// POST handler for webhook events
export async function POST(request: Request) {
  console.log('Stripe webhook POST received');
  
  try {
    // Get the request body as text
    const body = await request.text();
    
    // Get the signature from headers
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
    
    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }
    
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    
    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
      console.log('Event verified:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Processing checkout session:', session.id);
      
      // Get metadata
      const eventId = session.metadata?.eventId;
      const buyerId = session.metadata?.buyerId;
      
      if (!eventId || !buyerId) {
        console.error('Missing required metadata:', session.metadata);
        return NextResponse.json({ error: 'Missing required metadata' }, { status: 400 });
      }
      
      // Create the order
      try {
        const order = await createOrder({
          eventId,
          buyerId,
          totalAmount: session.amount_total ? (session.amount_total / 100).toString() : '0',
          stripeId: session.id,
          createdAt: new Date(),
        });
        
        console.log('Order created successfully:', order);
        return NextResponse.json({ success: true, order });
      } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Error creating order' }, { status: 500 });
      }
    }
    
    // Return success for other events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Unexpected error in webhook handler:', error);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}