"use client";

import Link from "next/link";
import EventForm from "@/components/shared/EventForm";
import { useUser } from "@clerk/nextjs";

const TipsPanel = () => (
  <aside className="hidden lg:block">
    <div className="sticky top-24 space-y-6">
      <div className="p-6 rounded-lg bg-white/80 dark:bg-gray-800/60 shadow-md">
        <h4 className="text-lg font-semibold mb-2">Quick Tips</h4>
        <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-200">
          <li>- Use a clear title and short description</li>
          <li>- Add a location and exact time</li>
          <li>- Upload an attractive cover image</li>
          <li>- Keep ticket info concise</li>
        </ul>
      </div>

      <div className="p-6 rounded-lg bg-white/80 dark:bg-gray-800/60 shadow-md">
        <h4 className="text-lg font-semibold mb-2">Preview</h4>
        <div className="h-40 bg-gradient-to-br from-primary-50 to-white dark:from-gray-700/40 dark:to-gray-800 rounded-md flex items-center justify-center text-center px-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Preview will appear here. Consider adding a live preview component
            later that reads form state.
          </p>
        </div>
      </div>
    </div>
  </aside>
);

const CreateEvent = () => {
  const { user } = useUser(); // Access the authenticated user
  const userId = user?.publicMetadata?.userId as string | undefined; // Extract userId from public metadata

  if (!userId) {
    return (
      <div className="wrapper my-8">
        <h1 className="h1-bold text-center">Unauthorized</h1>
        <p className="text-center mt-4">You must be signed in to create an event.</p>
      </div>
    );
  }

  return (
    <>
      <header className="bg-gradient-to-r from-primary-50/70 to-white dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="wrapper flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="h2-bold">Create Event</h1>
              <p className="small text-gray-600 dark:text-gray-300 mt-1">
                Create an event and share it with your community.
              </p>
            </div>
            <Link
              href="/"
              className="text-sm px-3 py-2 rounded-full bg-white dark:bg-gray-800/60 shadow-sm hover:opacity-90 transition"
            >
              ← Back to events
            </Link>
          </div>
        </div>
      </header>

      <main className="wrapper my-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-transform hover:translate-y-0.5">
              <h3 className="text-xl font-semibold mb-4">Event details</h3>
              <EventForm userId={userId} type="Create" />
            </div>
          </section>

          <TipsPanel />
        </div>
      </main>
    </>
  );
};

export default CreateEvent;