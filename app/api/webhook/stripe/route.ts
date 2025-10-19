import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { createOrder } from "@/lib/actions/order.actions";

export const dynamic = 'force-dynamic'; // Important for webhooks

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers(); // Await headers
  const signature = headersList.get("stripe-signature") as string;

  // Initialize Stripe with your secret key
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error(`Webhook signature verification failed: ${error}`);
    return new NextResponse(`Webhook Error: ${error instanceof Error ? error.message : 'Unknown error'}`, {
      status: 400,
    });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Get customer and event details from the session
    const { eventId, buyerId } = session.metadata || {};
    
    if (!eventId || !buyerId) {
      return new NextResponse('Missing metadata in the session', { status: 400 });
    }

    // Create an order in your database
    try {
      const order = await createOrder({
        eventId,
        buyerId,
        // Convert amount to string to match the expected type
        totalAmount: session.amount_total ? (session.amount_total / 100).toString() : "0",
        createdAt: new Date(),
        stripeId: session.id
      });

      return NextResponse.json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(`Error creating order: ${error}`);
      return new NextResponse(`Error creating order: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        status: 500,
      });
    }
  }

  // Return a response for other events
  return NextResponse.json({ received: true });
}