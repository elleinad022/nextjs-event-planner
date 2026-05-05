import Link from "next/link";
import { Button } from "./ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { notFound } from "next/navigation";
import { Form, FormField } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";

const InviteRsvpContent = async ({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) => {
  const row = await prisma.eventInvite.findFirst({
    where: {
      token,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          eventDate: true,
          location: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Card>
        <CardHeader className="space-y-3">
          <Badge variant="secondary" className="w-fit">
            RSVP
          </Badge>
          <CardTitle>{event.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {event.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : "No date set"}
            {event.location ? ` - ${event.location}` : ""}
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="mb-4 rounded-md border border-(--accent) bg-(--accent) p-3 text-sm text-(--accent-foreground)">
              Thanks. Your RSVP has been recorded.
            </p>
          ) : null}
          <Form action={submitRsvpForToken}>
            <FormField>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Your Name" />
            </FormField>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="m@example.com"
              />
            </FormField>
            <FormField>
              <Label htmlFor="status">Attendance</Label>
              <select
                name="status"
                id="status"
                required
                defaultValue="going"
                className="flex h-10 w-full rounded-md border border-(--border) bg-(--surface) px-3">
                <option value="going">Going</option>
                <option value="not-going">Not Going</option>
                <option value="maybe">Maybe</option>
              </select>
            </FormField>
            <Button type="submit">Submit RSVP</Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteRsvpContent;
