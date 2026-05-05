import EventDetailContent from "@/components/event-detail-content";
import { getSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) => {
  const { eventId } = await params;
  const session = await getSession();
  if (!session.data?.user.id) {
    redirect("/login");
  }
  return (
    <EventDetailContent userId={session.data?.user.id} eventId={eventId} />
  );
};

export default EventDetailsPage;
