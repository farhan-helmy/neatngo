import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import neatNgoLogo from "./neatngologo.svg";
import * as React from "react";

interface EmailProps {
    eventName: string;
    attendeeName: string;
    attendeeEmail: string;
    ticketNumber: string;
    qrCodeUrl: string;
    eventDate: string;
    eventLocation: string;
}

export default function EventTicketEmail({
    eventName,
    attendeeName,
    attendeeEmail,
    ticketNumber,
    qrCodeUrl,
    eventDate,
    eventLocation,
}: EmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Your ticket for {eventName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Img
                        src={"https://www.neatngo.com/assets/ngoplaceholder.png"}
                        width="80"
                        height="80"
                        alt="Logo"
                        style={logo}
                    />
                    <Heading style={h1}>Your Event Ticket</Heading>
                    <Section style={ticketContainer}>
                        <Text style={eventTitle}>{eventName}</Text>
                        <Text style={text}>
                            <strong>Attendee:</strong> {attendeeName}
                        </Text>
                        <Text style={text}>
                            <strong>Email:</strong> {attendeeEmail}
                        </Text>
                        <Text style={text}>
                            <strong>Date:</strong> {eventDate}
                        </Text>
                        <Text style={text}>
                            <strong>Location:</strong> {eventLocation}
                        </Text>
                        <Text style={ticketNumberStyle}>Ticket #: {ticketNumber}</Text>
                        <Img
                            src={qrCodeUrl}
                            width="150"
                            height="150"
                            alt="QR Code"
                            style={qrCode}
                        />
                    </Section>
                    <Text style={instructions}>
                        Please present this ticket (printed or on your mobile device) at the event entrance.
                    </Text>
                    <Text style={footer}>
                        &copy; 2024 NeatNGO. All rights reserved.{" "}
                        <Link href="https://neatngo.com" style={link}>
                            neatngo.com
                        </Link>
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
};

const logo = {
    margin: "0 auto",
    marginBottom: "32px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
};

const ticketContainer = {
    border: "2px solid #556cd6",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
};

const eventTitle = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#556cd6",
    textAlign: "center" as const,
    marginBottom: "16px",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "24px",
};

const ticketNumberStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#556cd6",
    textAlign: "center" as const,
    margin: "16px 0",
};

const qrCode = {
    margin: "0 auto",
    display: "block",
};

const instructions = {
    color: "#666",
    fontSize: "14px",
    fontStyle: "italic",
    textAlign: "center" as const,
    margin: "24px 0",
};

const footer = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    textAlign: "center" as const,
    marginTop: "48px",
};

const link = {
    color: "#556cd6",
    textDecoration: "underline",
};