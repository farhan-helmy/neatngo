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
import * as React from "react";

interface EmailProps {
  verificationCode: string;
}

export default function VerificationEmail({ verificationCode }: EmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`https://neatngo.com/assets/neatngologo.svg`}
            width="80"
            height="80"
            alt="Logo"
            style={logo}
          />
          <Heading style={h1}>Verify your email address</Heading>
          <Text style={text}>
            Thank you for signing up! Please use the following verification code to complete your registration:
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </Section>
          <Text style={text}>
            If you didn't request this email, you can safely ignore it.
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

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 0",
  padding: "16px",
};

const code = {
  color: "#000",
  display: "inline-block",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "6px",
  lineHeight: "40px",
  textAlign: "center" as const,
  width: "100%",
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
