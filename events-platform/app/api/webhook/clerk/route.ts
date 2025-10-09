import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('WEBHOOK_SECRET is not defined in the environment variables.');
    return new Response('Internal Server Error', { status: 500 });
  }

  const headerPayload = await headers(); // Use await to resolve the promise
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing required Svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err.message || err);
    return new Response('Webhook verification failed', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === 'user.created') {
      const { email_addresses, image_url, first_name, last_name } = evt.data;

      if (!email_addresses || email_addresses.length === 0 || !first_name || !last_name || !id) {
        return new Response('Invalid user.created payload', { status: 400 });
      }

      const user = {
        clerkId: id as string, // Ensure id is a string
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      const newUser = await createUser(user);

      if (newUser) {
        const client = await clerkClient(); // Resolve the promise to get the ClerkClient
        await client.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id,
          },
        });
      }

      return NextResponse.json({ message: 'OK', user: newUser });
    }

    if (eventType === 'user.updated') {
      const { image_url, first_name, last_name } = evt.data;

      const user = {
        firstName: first_name || '',
        lastName: last_name || '',
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json({ message: 'OK', user: updatedUser });
    }

    if (eventType === 'user.deleted') {
      const deletedUser = await deleteUser(id);

      return NextResponse.json({ message: 'OK', user: deletedUser });
    }

    console.warn(`Unhandled event type: ${eventType}`);
    return new Response('Event type not handled', { status: 200 });
  } catch (err) {
    console.error(`Error handling event ${eventType}:`, err);
    return new Response('Internal Server Error', { status: 500 });
  }
}