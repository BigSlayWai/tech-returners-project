"use client"

import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions"
import { useUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
// Import the IEvent interface
import { IEvent } from "@/lib/database/models/event.model"

type UpdateEventProps = {
  params: {
    id: string
  }
}

const UpdateEvent = ({ params: { id } }: UpdateEventProps) => {
  const { user, isLoaded } = useUser()
  // Properly type your state with IEvent | null
  const [event, setEvent] = useState<IEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch the event data
    const fetchEvent = async () => {
      if (isLoaded) {
        try {
          const eventData = await getEventById(id)
          setEvent(eventData)
        } catch (error) {
          console.error("Error fetching event:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchEvent()
  }, [id, isLoaded])

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect("/sign-in")
  }

  // Get userId from user object
  const userId = user?.id || ""

  if (loading) {
    return <div className="wrapper my-8 text-center">Loading...</div>
  }

  if (!event) {
    return <div className="wrapper my-8 text-center">Event not found</div>
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
      </section>

      <div className="wrapper my-8">
        <EventForm 
          type="Update" 
          event={event} 
          eventId={event._id.toString()} 
          userId={userId}
        />
      </div>
    </>
  )
}

export default UpdateEvent