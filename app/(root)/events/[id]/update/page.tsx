import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

const UpdateEvent = async ({ params }: UpdateEventProps) => {
  const { id } = params; // Destructure `id` from `params`
  const { userId } = await auth();

  // Check if user is authenticated
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the event
  const event = await getEventById(id);

  // Check if event exists
  if (!event) {
    return (
      <div className="wrapper my-8">
        <h1 className="h1-bold text-center">Event Not Found</h1>
        <p className="text-center mt-4">The event you&apos;re trying to update doesn&apos;t exist.</p>
      </div>
    );
  }

  // Optional: Check if user owns this event
  if (event.organizer._id !== userId) {
    redirect("/");
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
          userId={userId}
        />
      </div>
    </>
  );
};

export default UpdateEvent;