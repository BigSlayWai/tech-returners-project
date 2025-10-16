import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, updateUser, deleteUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("WEBHOOK_SECRET is not defined in the environment variables.");
    return new Response("Internal Server Error", { status: 500 });
  }

  // Get raw payload and headers
  const payloadString = await req.text();
  const headerPayload = await headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    // Verify the webhook payload
    evt = wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  try {
    if (eventType === "user.created") {
      const { email_addresses, image_url, first_name, last_name } = evt.data;

      if (!email_addresses || email_addresses.length === 0 || !first_name || !last_name || !id) {
        return new Response("Invalid user.created payload", { status: 400 });
      }

      const user = {
        clerkId: id as string,
        email: email_addresses[0].email_address,
        firstName: first_name,
        lastName: last_name,
        photo: image_url,
      };

      console.log("Creating user with data:", user);

      const newUser = await createUser(user);

      return NextResponse.json({ message: "User created successfully", user: newUser });
    }

    if (eventType === "user.updated") {
      const { image_url, first_name, last_name } = evt.data;

      if (!id) {
        return new Response("Invalid user.updated payload: missing id", { status: 400 });
      }

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url,
      };

      const updatedUser = await updateUser(id, user);

      return NextResponse.json({ message: "User updated successfully", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      if (!id) {
        return new Response("Invalid user.deleted payload: missing id", { status: 400 });
      }

      const deletedUser = await deleteUser(id);

      return NextResponse.json({ message: "User deleted successfully", user: deletedUser });
    }

    console.warn(`Unhandled event type: ${eventType}`);
    return new Response("Event type not handled", { status: 200 });
  } catch (err) {
    console.error(`Error handling event ${eventType}:`, err);
    return new Response("Internal Server Error", { status: 500 });
  }
}