'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, MapPin, Users } from "lucide-react"

export default function ViewEventCard() {
  const [attendees, setAttendees] = useState(42)
  const [hasRSVPd, setHasRSVPd] = useState(false)

  const handleRSVP = () => {
    if (!hasRSVPd) {
      setAttendees(attendees + 1)
      setHasRSVPd(true)
    } else {
      setAttendees(attendees - 1)
      setHasRSVPd(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="p-0">
        <img
          src="/placeholder.svg?height=300&width=800"
          alt="Event header image"
          className="w-full h-[300px] object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <h1 className="text-3xl font-bold mb-4">Web Development Meetup</h1>
        <div className="flex items-center mb-4 text-muted-foreground">
          <CalendarDays className="mr-2 h-4 w-4" />
          <span>Saturday, August 15, 2023 at 2:00 PM</span>
        </div>
        <div className="flex items-center mb-4 text-muted-foreground">
          <MapPin className="mr-2 h-4 w-4" />
          <span>Tech Hub, 123 Main St, Anytown, USA</span>
        </div>
        <div className="flex items-center mb-6 text-muted-foreground">
          <Users className="mr-2 h-4 w-4" />
          <span>{attendees} attendees</span>
        </div>
        <p className="mb-6">
          Join us for an exciting meetup focused on the latest trends in web development. 
          Well cover topics like React, Next.js, and modern CSS techniques. Whether youre 
          a beginner or an experienced developer, theres something for everyone!
        </p>
        <h2 className="text-xl font-semibold mb-2">Event Schedule:</h2>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>2:00 PM - Welcome and introductions</li>
          <li>2:15 PM - Main presentation: Building Modern Web Apps</li>
          <li>3:30 PM - Q&A session</li>
          <li>4:00 PM - Networking and refreshments</li>
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between items-center p-6 bg-muted">
        <p className="text-sm text-muted-foreground">
          {hasRSVPd ? "You're attending this event" : "RSVP to secure your spot!"}
        </p>
        <Button onClick={handleRSVP} variant={hasRSVPd ? "secondary" : "default"}>
          {hasRSVPd ? "Cancel RSVP" : "RSVP"}
        </Button>
      </CardFooter>
    </Card>
  )
}