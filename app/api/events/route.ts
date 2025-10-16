import axios from 'axios';
import { NextResponse } from 'next/server';

const COFFEE_API_URL = 'https://coffee.alexflipnote.dev/random';

// Define the type for the Coffee API response
interface CoffeeApiResponse {
  file: string; // The URL of the coffee image
}

// Generate mock events
const generateMockEvents = async (count: number) => {
  const events = [];

  for (let i = 0; i < count; i++) {
    try {
      // Use the Coffee API URL directly as the image source
      const imageUrl = `${COFFEE_API_URL}?random=${i}`; // Add a query parameter to avoid caching

      // Create a mock event
      events.push({
        id: `event-${i + 1}`,
        title: `Coffee Event ${i + 1}`,
        description: `Join us for Coffee Event ${i + 1}, where you'll enjoy amazing coffee and great company.`,
        price: (Math.random() * 50 + 10).toFixed(2), // Random price between $10 and $60
        image: imageUrl, // Use the Coffee API URL directly
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error generating mock event:', error.message);
      } else {
        console.error('Unknown error generating mock event:', error);
      }
    }
  }

  return events;
};

// Add the GET handler for the API route
export async function GET() {
  try {
    const events = await generateMockEvents(10); // Generate 10 mock events
    return NextResponse.json({ events }); // Return the events as JSON
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate events' },
      { status: 500 }
    );
  }
}