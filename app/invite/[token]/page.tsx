import EventDetailContent from "@/components/event-detail-content";
import InviteRsvpContent from "@/components/invite-rsvp-content";
import { redirect } from "next/navigation";

const InvitePage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) => {
  const { token } = await params;
  const query = await searchParams;
  return (
    <InviteRsvpContent token={token} submitted={query.submitted === "1"} />
  );
};

export default InvitePage;
