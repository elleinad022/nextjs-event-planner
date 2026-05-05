import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEventAction } from "@/lib/actions/events";
import Link from "next/link";

const NewEventPage = async () => {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action={createEventAction}>
            <FormField>
              <Label>Title</Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="Business Trip..."
              />
            </FormField>

            <FormField>
              <Label>Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event..."
              />
            </FormField>

            <FormField>
              <Label>Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Optional location"
              />
            </FormField>

            <FormField>
              <Label>Date and Time</Label>
              <Input id="eventDate" name="eventDate" type="datetime-local" />
              <FormMessage>Optional, you can set this later.</FormMessage>
            </FormField>

            <div className="flex items-center gap-2">
              <Button type="submit">Create Event</Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewEventPage;
