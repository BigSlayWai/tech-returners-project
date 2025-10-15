import axios from 'axios';
import { NextResponse } from 'next/server';

const COFFEE_API_URL = 'https://coffee.alexflipnote.dev/random';

// Generate mock events
const generateMockEvents = async (count: number) => {
  const events = [];

  for (let i = 0; i < count; i++) {
    try {
      // Fetch a random coffee image
      const response = await axios.get(COFFEE_API_URL);

      // Create a mock event
      events.push({
        id: `event-${i + 1}`,
        title: `Coffee Event ${i + 1}`,
        description: `Join us for Coffee Event ${i + 1}, where you'll enjoy amazing coffee and great company.`,
        price: (Math.random() * 50 + 10).toFixed(2), // Random price between $10 and $60
        image: response.data.file, // Coffee image URL
      });
    } catch (error) {
      console.error('Error fetching coffee image:', error.message);
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