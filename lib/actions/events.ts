"use server";

import { redirect } from "next/navigation";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";
import { parse } from "path";
import { FUNCTIONS_CONFIG_MANIFEST } from "next/dist/shared/lib/constants";
import { RsvpStatus } from "../generated/prisma/enums";
import { log } from "console";
import { revalidatePath } from "next/cache";

function parseCreateEvent(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (title.length < 3 || title.length > 120) {
    throw new Error("Title must be between 3 and 120 characters");
  }

  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "").trim();
  return {
    title,
    description: description.length ? description.slice(0, 2000) : null,
    location: location.length ? location.slice(0, 200) : null,
    eventDate: eventDate.length ? eventDate : null,
  };
}

const RSVP_STATUSES = ["going", "not_going", "maybe"] as const;

function isRsvpStatus(status: string): status is RsvpStatus {
  return (RSVP_STATUSES as readonly string[]).includes(status);
}

function parseRsvp(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 120) {
    throw new Error("Name must be between 2 and 120 characters");
  }
  const email = String(formData.get("email") ?? "").trim();
  if (email.length < 3 || email.length > 320 || !email.includes("@")) {
    throw new Error("Email must be valid and between 3 and 320 characters");
  }
  const status = String(formData.get("status") ?? "").trim();
  if (!isRsvpStatus(status)) {
    throw new Error("Invalid RSVP status");
  }
  return { name, email, status };
}

export const createEventAction = async (formData: FormData) => {
  const session = await getSession();
  const userId = session.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const input = parseCreateEvent(formData);
  let created;
  try {
    created = await prisma.event.create({
      data: {
        ownerUserId: userId,
        title: input.title,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate ? new Date(input.eventDate) : null,
      },
    });
  } catch (err) {
    console.error(err);
    return;
  }
  redirect(`/events/${created.id}`); // Redirect to the event details page after creation
};

export const deleteEventAction = async (eventId: string) => {
  //FEATURE TO BE ADDED!!
  const session = await getSession();
  const userId = session.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const owns = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });

  if (!owns) {
    throw new Error("Error not found.");
  }

  await prisma.event.delete({
    where: { id: eventId },
  });

  redirect("/dashboard");
};

export const createInviteLinkAction = async (eventId: string) => {
  const session = await getSession();
  const userId = session.data?.user.id;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const owns = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { id: true },
  });

  if (!owns) {
    throw new Error("Event not found");
  }

  const token = crypto.randomUUID().replace(/-/g, "");

  await prisma.eventInvite.upsert({
    where: { eventId },
    create: { eventId, token },
    update: { token },
  });

  revalidatePath(`/events/${eventId}`);
};

export const submitOrUpdateRsvpAction = async (
  token: string,
  formData: FormData,
) => {
  const input = parseRsvp(formData);

  const invite = await prisma.eventInvite.findFirst({
    where: { token },
    select: {
      id: true,
      event: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!invite) {
    throw new Error("Invite link is invalid");
  }

  const eventId = invite.event.id;
  const emailNormalized = input.email.toLowerCase();

  await prisma.eventRsvp.upsert({
    where: {
      eventId_emailNormalized: {
        eventId,
        emailNormalized,
      },
    },

    create: {
      eventId,
      inviteId: invite.id,
      name: input.name,
      email: input.email,
      emailNormalized,
      status: input.status as RsvpStatus,
    },
    update: {
      name: input.name,
      status: input.status as RsvpStatus,
      respondedAt: new Date(),
    },
  });

  redirect(`/invite/${token}?submitted=1`);
};
