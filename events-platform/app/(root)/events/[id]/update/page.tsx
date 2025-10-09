"use client";

import EventForm from "@/components/shared/EventForm";
import { useAuth } from "@clerk/nextjs";
import { getEventById } from "@/lib/actions/event.actions";
import { useEffect, useState } from "react";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = ({ params: { id } }: UpdateEventProps) => {
  const { userId } = useAuth(); // Use `useAuth` to retrieve `userId`
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const fetchedEvent = await getEventById(id);
      setEvent(fetchedEvent);
    };

    fetchEvent();
  }, [id]);

  if (!event) {
    return <p>Loading...</p>;
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
          eventId={event._id}
          userId={userId as string}
        />
      </div>
    </>
  );
};

export default UpdateEvent;