import { IEvent } from '@/lib/database/models/event.model';
import { formatDateTime } from '@/lib/utils';
import { auth } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DeleteConfirmation } from './DeleteConfirmation';

type CardProps = {
  event: IEvent,
  hasOrderLink?: boolean,
  hidePrice?: boolean
}

const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { sessionClaims } = await auth();
  const userId = sessionClaims?.userId as string;
  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
      <Link 
        href={`/events/${event._id}`}
        className="flex-grow"
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={400}
            height={200}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          {!hidePrice && (
            <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm">
              {event.isFree ? 'FREE' : `£${event.price}`}
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
            <p className="text-white font-medium">{formatDateTime(event.startDateTime).dateTime}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 p-5 md:p-6">
          <div className="flex items-center justify-between">
            <p className="p-semibold-14 w-min rounded-full bg-grey-500/10 px-4 py-1 text-primary-500 line-clamp-1">
              {event.category.name}
            </p>
          </div>
          
          <h3 className="p-medium-16 md:p-medium-20 line-clamp-2 font-bold text-xl leading-tight">{event.title}</h3>
          
          <div className="flex-between w-full mt-2">
            <div className="flex items-center gap-2">
              <p className="p-medium-14 md:p-medium-16 text-grey-600">
                {event.organizer.firstName} {event.organizer.lastName}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Creator Controls */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all z-10">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}
      
      {/* Order Link */}
      {hasOrderLink && (
        <div className="absolute bottom-4 right-4">
          <Link href={`/orders?eventId=${event._id}`} className="flex gap-2 items-center px-4 py-2 rounded-full bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
            <span>Order Details</span>
            <Image src="/assets/icons/arrow.svg" alt="arrow" width={10} height={10} className="invert" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default Card;