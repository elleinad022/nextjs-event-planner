import Link from "next/link";
import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { RsvpStatus as PrismaRsvpStatus } from "@/lib/generated/prisma/enums";
import { Badge } from "./ui/badge";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let notGoingCount = 0;
  let maybeCount = 0;

  for (const rsvp of rsvps) {
    if (rsvp.status === "going") goingCount++;
    else if (rsvp.status === "not_going") notGoingCount++;
    else if (rsvp.status === "maybe") maybeCount++;
  }
  return { goingCount, notGoingCount, maybeCount };
}

const DashboardContent = async ({ userId }: { userId: string }) => {
  const rows = await prisma.event.findMany({
    where: {
      ownerUserId: userId,
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      rsvps: { select: { status: true } },
    },
  });

  const events = rows.map((e) => ({
    id: e.id,
    title: e.title,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
    location: e.location,
    ...countByStatus(e.rsvps),
  }));
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Events:
          </h1>
          <p className="text-sm text-muted-foreground">
            Track attendee responses and manage invite links
          </p>
        </div>

        <Button asChild>
          <Link href={"/events/new"}>Create Event</Link>
        </Button>
      </div>
      {/* List of events */}
      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No events found</CardTitle>
          </CardHeader>
          <CardContent>Create your first event to get started!</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Render events here */}
          {events.map((event) => (
            <Card key={event.id} className="mb-4">
              <CardHeader className="space-y-2">
                <div className="flex justify-between items-center gap-2">
                  <CardTitle className="text-lg ">{event.title}</CardTitle>
                  <Button size="sm" asChild>
                    <Link href={`/events/${event.id}`}>Open</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 text-xs">
                  <Badge>Going: {event.goingCount}</Badge>
                  <Badge variant="secondary">Maybe: {event.maybeCount}</Badge>
                  <Badge variant="outline">
                    Not Going: {event.notGoingCount}{" "}
                  </Badge>
                </div>
                <p>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleString()
                    : "Schedule: TBD"}

                  {event.location ? ` - ${event.location}` : ""}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardContent;
