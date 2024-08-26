"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Users, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { GetEventResult } from "../_lib/type";
import { format } from "date-fns";
import SafeHTML from "@/components/safe-html";
import { User } from "lucia";
import { useLoading } from "@/hooks/useLoading";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { checkUserEmailVerification } from "@/lib/auth";
import { registerUserForEvent, cancelUserRSVP } from "../_lib/actions";
import { toast } from "sonner";

export default function ViewEvent({
  event,
  user,
  userHasRSVPd
}: {
  event: GetEventResult;
  user: User | null;
  userHasRSVPd: boolean;
}) {
  const { isLoading, withLoading } = useLoading();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [verifyEmailDialogOpen, setVerifyEmailDialogOpen] = useState(false);
  const [localUserHasRSVPd, setLocalUserHasRSVPd] = useState(userHasRSVPd);

  const handleRSVP = withLoading(async () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    if (!await checkUserEmailVerification(user.id)) {
      setVerifyEmailDialogOpen(true);
      return;
    }
    // Handle RSVP logic for authenticated users with verified email
    const res = await registerUserForEvent({ eventId: event?.event?.id ?? "", userId: user.id });

    if (res.error) {
      toast.error(res.error);
      return;
    }

    setLocalUserHasRSVPd(true);
    toast.success("You have RSVPd to this event!");
  });

  const handleCancelRSVP = withLoading(async () => {
    if (!user || !event?.event?.id) return;

    const res = await cancelUserRSVP({ eventId: event.event.id, userId: user.id });

    if (res.error) {
      toast.error(res.error);
      return;
    }

    setLocalUserHasRSVPd(false);
    toast.success("Your RSVP has been cancelled.");
  });

  if (!event?.event || event === null) {
    return <div className="text-center pt-24">Event does not exist</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Event Header Image */}
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
          <Image
            src="/assets/neatngologo.svg?height=500&width=1200"
            alt="Event header image"
            className="w-full h-full object-cover"
            layout="fill"
          />
          <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center px-4">
              {event.event.name}
            </h1>
          </div>
          <Badge className="absolute top-4 left-4 text-lg" variant="secondary">
            {event.event.eventType}
          </Badge>
        </div>

        {/* Event Details */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center mb-6 text-muted-foreground">
                <div className="flex items-center mr-6 mb-2 md:mb-0">
                  <CalendarDays className="mr-2 h-5 w-5" />
                  <span>
                    {format(new Date(event.event.startDate), "PPPppp")}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  <span>{event.event.location}</span>
                </div>
              </div>

              <SafeHTML html={event.event.description ?? ""} />
              <h2 className="text-2xl font-semibold mb-4 mt-4">
                About the Organizer:
              </h2>
              <div className="flex items-center mb-4">
                <Image
                  src="/assets/neatngologo.svg?height=100&width=100"
                  alt="TechMeetups logo"
                  className="w-16 h-16 object-contain mr-4"
                  width={100}
                  height={100}
                />
                <div>
                  <h3 className="text-xl font-semibold">
                    {event.event.organization.fullName}
                  </h3>
                </div>
              </div>
              <p className="mb-6">{event.event.organization.about}</p>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-muted p-6 rounded-lg">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Attendees</h3>
                  {event.registrations.length === 0 ? (
                    <p className="text-muted-foreground">
                      Be the first to RSVP!
                    </p>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex -space-x-2 mr-2">
                        {event.registrations
                          .slice(0, Math.min(event.registrations.length, 5))
                          .map((attendee, index) => (
                            <Avatar
                              key={index}
                              className="border-2 border-background"
                            >
                              <AvatarImage
                                src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${attendee.user.subscriptionTier}`}
                                alt="userpic"
                              />
                              <AvatarFallback>N</AvatarFallback>
                            </Avatar>
                          ))}
                      </div>
                      {event.registrations.length > 5 && (
                        <span className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-sm font-semibold">
                          +{event.registrations.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {event.registrations.length}{" "}
                    {event.registrations.length === 1 ? "person" : "people"}{" "}
                    attending
                  </p>
                </div>
                {localUserHasRSVPd ? (
                  <Button onClick={handleCancelRSVP} className="w-full mb-4" variant="destructive" disabled={isLoading}>
                    {isLoading ? "Processing..." : "Cancel RSVP"}
                  </Button>
                ) : (
                  <Button onClick={handleRSVP} className="w-full mb-4" disabled={isLoading}>
                    {isLoading ? "Processing..." : "RSVP"}
                  </Button>
                )}
                <p className="text-sm text-muted-foreground text-center">
                  {localUserHasRSVPd ? "You're all set!" : "RSVP to secure your spot!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">
              &copy; 2024 Neatngo. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy-policy"
                className="text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <AuthDialog
        dialogOpen={authDialogOpen}
        setDialogOpen={setAuthDialogOpen}
        eventId={event.event.id}
      />

      <Dialog open={verifyEmailDialogOpen} onOpenChange={setVerifyEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Verification Required</DialogTitle>
            <DialogDescription>
              Please verify your email address before RSVPing to this event. Check your inbox for a verification email.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setVerifyEmailDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
