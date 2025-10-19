"use server"

import Stripe from 'stripe';
import { CheckoutOrderParams, CreateOrderParams, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types"
import { redirect } from 'next/navigation';
import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Order from '../database/models/order.model';
import Event from '../database/models/event.model';
import {ObjectId} from 'mongodb';
import User from '../database/models/user.model';

export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: price,
            product_data: {
              name: order.eventTitle
            }
          },
          quantity: 1
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!)
  } catch (error) {
    throw error;
  }
}

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();
    
    let buyerId = order.buyerId;
    
    // Check if we need to handle a MongoDB ObjectId directly or a Clerk ID
    if (typeof buyerId === 'string') {
      if (buyerId.startsWith('user_')) {
        // This is a Clerk ID, we need to find the corresponding user
        const user = await User.findOne({ clerkId: buyerId });
        
        if (!user) {
          console.error(`User not found with Clerk ID: ${buyerId}`);
          throw new Error(`User not found with Clerk ID: ${buyerId}`);
        }
        
        // Use the MongoDB ObjectId
        buyerId = user._id;
      } else {
        // Handle potential validation if needed
        console.log('Using provided buyerId directly:', buyerId);
      }
    }
    
    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.error('Error creating order:', error);
    handleError(error);
  }
}

// GET ORDERS BY EVENT
export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
  try {
    await connectToDatabase()

    if (!eventId) throw new Error('Event ID is required')
    const eventObjectId = new ObjectId(eventId)

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      {
        $unwind: '$buyer',
      },
      {
        $lookup: {
          from: 'events',
          localField: 'event',
          foreignField: '_id',
          as: 'event',
        },
      },
      {
        $unwind: '$event',
      },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: '$event.title',
          eventId: '$event._id',
          buyer: {
            $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
          },
        },
      },
      {
        $match: {
          $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
        },
      },
    ])

    return JSON.parse(JSON.stringify(orders))
  } catch (error) {
    handleError(error)
  }
}

// GET ORDERS BY USER
export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
  try {
    await connectToDatabase();

    // Check if userId is provided
    if (!userId) {
      console.log('No userId provided');
      return { 
        data: [],
        totalPages: 0 
      };
    }

    let buyerId = userId;
    
    // Check if userId is a Clerk ID (starts with 'user_')
    if (typeof userId === 'string' && userId.startsWith('user_')) {
      // This is a Clerk ID, not a MongoDB ObjectId
      console.log('Looking up MongoDB user for Clerk ID:', userId);
      const user = await User.findOne({ clerkId: userId });
      
      if (!user) {
        console.log('No MongoDB user found with Clerk ID:', userId);
        return { 
          data: [],
          totalPages: 0 
        };
      }
      
      buyerId = user._id.toString();
      console.log('Found MongoDB user ID:', buyerId);
    }

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { buyer: buyerId };

    const orders = await Order
      .find(conditions)
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: 'event',
        model: Event,
        populate: {
          path: 'organizer',
          model: User,
          select: '_id firstName lastName',
        },
      });

    const ordersCount = await Order.countDocuments(conditions);

    return { 
      data: JSON.parse(JSON.stringify(orders)), 
      totalPages: Math.ceil(ordersCount / limit) 
    };
  } catch (error) {
    console.error('Error in getOrdersByUser:', error);
    handleError(error);
  }
}