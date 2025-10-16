"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Lens } from "@/components/ui/lens"; // Import the Lens component

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        const data = await response.json();
        setEvents(data.events || data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 bg-dotted-pattern bg-cover py-12 md:py-24">
        <div className="wrapper grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
          <div className="flex flex-col justify-center gap-6 md:gap-8">
            <h1 className="text-4xl font-bold text-[hsl(var(--foreground))] leading-tight">
              Welcome To Tech Returners
            </h1>
            <p className="text-lg text-[hsl(var(--muted-foreground))]">
              Discover our events and join the journey to upskill and grow.
            </p>
            <Button size="lg" asChild className="btn-primary w-full sm:w-auto">
              <Link href="#events" scroll={false}>Explore Now</Link>
            </Button>
          </div>

          <div className="w-full">
            <Image 
              src="/assets/images/stockhero.png"
              alt="hero"
              width={1000}
              height={1000}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-12 md:py-24 bg-gray-50">
        <div className="wrapper">
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Upcoming Tech Events in London
          </h2>

          {loading ? (
            <p className="text-gray-500">Loading events...</p>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {event.description || "No description available."}
                    </p>

                    {/* Price */}
                    <p className="text-gray-800 font-bold mt-2">${event.price}</p>
                  </div>

                  {/* Image with Lens */}
                  <Lens zoomFactor={1.5} lensSize={200} ariaLabel="Zoomed Coffee Image">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-md mb-4"
                    />
                  </Lens>

                  {/* Link Button */}
                  <Button
                    asChild
                    variant="secondary"
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link href="#" target="_blank" rel="noopener noreferrer">
                      View Event →
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </section>
    </>
  );
}