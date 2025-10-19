"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IEvent } from '@/lib/database/models/event.model';
import { checkoutOrder } from '@/lib/actions/order.actions';
import { useRouter } from 'next/navigation';

interface CheckoutProps {
  event: IEvent;
  userId: string;
}

const Checkout = ({ event, userId }: CheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const order = {
        eventId: event._id,
        eventTitle: event.title,
        price: event.price,
        isFree: event.isFree,
        buyerId: userId,
      };

      await checkoutOrder(order);
    } catch (error) {
      console.error('Checkout error:', error);
      // Display error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className="button rounded-full"
      size="lg"
    >
      {isLoading
        ? 'Processing...'
        : event.isFree
        ? 'Get Ticket'
        : `Buy Ticket for $${event.price}`}
    </Button>
  );
};

export default Checkout;