import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

// Define the correct props interface for Next.js 14
interface ProfilePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ProfilePage = async ({ searchParams }: ProfilePageProps) => {
  // Await auth to get userId
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Await searchParams before using
  const resolvedSearchParams = await searchParams;
  
  const ordersPage = Number(resolvedSearchParams?.ordersPage) || 1;
  const eventsPage = Number(resolvedSearchParams?.eventsPage) || 1;

  // Get orders using the updated function (which handles Clerk IDs)
  const orders = await getOrdersByUser({ 
    userId, 
    page: ordersPage 
  });

  // Extract events from orders or provide empty array if no orders
  const orderedEvents = orders?.data?.map((order: IOrder) => order.event) || [];
  
  // Get events organized by the user
  const organizedEvents = await getEventsByUser({ 
    userId, 
    page: eventsPage 
  });

  return (
    <>
      {/* My Tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex text-white">
            <Link href="/#events">
              Explore More Events
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={orderedEvents}
          emptyTitle="No event tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages || 0}
        />
      </section>

      {/* Events Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex text-white">
            <Link href="/events/create">
              Create New Event
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection 
          data={organizedEvents?.data || []}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages || 0}
        />
      </section>
    </>
  )
}

export default ProfilePage