import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-1 flex-col items-start gap-6">
        <CardHeader className="flex flex-col w-full items-start gap-4">
          <CardTitle className="text-4xl text-foreground font-semibold tracking-tight">
            Event Planner
          </CardTitle>
          <Badge
            variant="secondary"
            className="w-fit text-(--custom-accent) font-semibold">
            NextJS • TypeScript • Tailwind CSS • Neon Auth • Neon Postgres
          </Badge>
          <CardDescription className="text-lg text-(--muted-foreground) max-w-3xl">
            Manage events, send invite links, track RSVPs, and keep track of
            your plans all in one place with this intuitive event planner. The
            event planner app helps you stay organized and connected with your
            guests. Start planning your next event today!
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        <Button asChild>
          <Link href="/dashboard">Open Dashboard</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/auth/sign-in">Sign In</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/auth/sign-up">Create Account</Link>
        </Button>
      </div>
    </div>
  );
}
