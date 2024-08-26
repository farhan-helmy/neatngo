"use client";

import { Layout, LayoutHeader, LayoutBody } from "@/components/custom/layout";
import NeatCrumb from "@/components/custom/NeatCrumb";
import SafeHTML from "@/components/safe-html";
import { CardHeader, CardContent, Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cleanEventType } from "@/helper";
import { Label } from "@/components/ui/label";
import { ChevronLeft, UserCircle, Calendar, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { EventType } from "@/db/schema";
import { ViewAllParticipantDialog } from "./ViewAllParticipantDialog";
import Link from "next/link";

interface Participant {
    id: string;
    email: string;
    attended: boolean;
}

interface Attendee {
    id: string;
    user: {
        firstName: string | null;
        email: string;
    };
    registrationDate: string;
    attended: boolean;
}

interface Event {
    id: string;
    name: string;
    description: string | null;
    eventType: EventType;
    maxAttendees: number | null;
    startDate: string;
    endDate: string;
}

interface ViewEventPageProps {
    event: Event;
    attendees: Attendee[];
    participants: Participant[];
    organizationId: string;
}

export function ViewEventPage({ event, attendees, participants, organizationId }: ViewEventPageProps) {
    return (
        <Layout>
            <LayoutHeader className="flex justify-between items-center">
                <NeatCrumb
                    items={[
                        {
                            label: "Organization",
                            href: `/dashboard/organization/${organizationId}`,
                        },
                        {
                            label: "Events",
                            href: `/dashboard/organization/${organizationId}/events`,
                        },
                        {
                            label: event.name,
                            href: `/dashboard/organization/${organizationId}/events/${event.id}`,
                        },
                    ]}
                />
                <Link href={`/dashboard/organization/${organizationId}/events/${event.id}?action=edit`}>
                    <Button size="sm">Edit Event</Button>
                </Link>
            </LayoutHeader>
            <LayoutBody>
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/dashboard/organization/${organizationId}/events`}>
                                <Button variant="outline" size="icon" className="h-10 w-10">
                                    <ChevronLeft className="h-6 w-6" />
                                </Button>
                            </Link>
                            <h1 className="text-3xl font-bold">{event.name}</h1>
                        </div>
                        <Badge variant="outline" className="text-lg px-3 py-1">
                            {cleanEventType({ eventType: event.eventType })}
                        </Badge>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card className="mb-8">
                                <CardHeader>
                                    <CardTitle className="text-2xl">Event Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose max-w-none">
                                        <SafeHTML html={event.description || "No description provided."} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Event Participants</CardTitle>
                                    <CardDescription>People involved in this event</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {attendees.length > 0 ? (
                                        <div className="space-y-4">
                                            {attendees.map((attendee) => (
                                                <div
                                                    key={attendee.id}
                                                    className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <UserCircle className="h-12 w-12 text-primary" />
                                                        <div>
                                                            <div className="font-semibold">
                                                                {attendee.user.firstName || "Unnamed Participant"}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {attendee.user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm mb-1">
                                                            Registered: {format(new Date(attendee.registrationDate), 'PPp')}
                                                        </div>
                                                        <Badge variant={attendee.attended ? "default" : "secondary"}>
                                                            {attendee.attended ? "Attended" : "Not Attended"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <UserCircle className="h-16 w-16 mb-4" />
                                            <span className="text-lg">No participants yet</span>
                                        </div>
                                    )}
                                    <div className="mt-6 flex justify-center">
                                        <ViewAllParticipantDialog
                                            participants={participants}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Event Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 mr-2 text-primary" />
                                            <div>
                                                <div className="font-semibold">Date & Time</div>
                                                <div className="text-xs">
                                                    <div>{format(new Date(event.startDate), 'PPP')}</div>
                                                    <div>{format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}</div>
                                                </div>

                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 mr-2 text-primary" />
                                            <div>
                                                <div className="font-semibold">Max Attendees</div>
                                                <div className="text-xs">{event.maxAttendees || "Unlimited"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 mr-2 text-primary" />
                                            <div>
                                                <div className="font-semibold">Duration</div>
                                                <div className="text-xs">{format(new Date(event.endDate).getTime() - new Date(event.startDate).getTime(), 'H:mm')} hours</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </LayoutBody>
        </Layout>
    )
}