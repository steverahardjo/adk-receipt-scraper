import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OtpEmailProps {
  validationCode?: string;
}

export default function SignInOtpEmail({
  validationCode = "123456",
}: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your authentication code: {validationCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Heading style={h1}>Deneb</Heading>

            <Text style={text}>
              Please use the following one-time password (OTP) to complete your
              login. This code will expire in 10 minutes.
            </Text>

            <Section style={codeContainer}>
              <Text style={codeText}>{validationCode}</Text>
            </Section>

            <Text style={footer}>
              If you didn't request this code, you can safely ignore this email.
              Verification codes are sensitive—never share them with anyone.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#ffffff",
  fontFamily:
    "Geologica, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const contentSection: React.CSSProperties = {
  padding: "0 20px",
};

const h1: React.CSSProperties = {
  color: "#008080",
  fontSize: "35px",
  fontWeight: 700,
  textAlign: "center",
  margin: "30px 0",
  lineHeight: "1.2",
};

const text: React.CSSProperties = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left",
};

const codeContainer: React.CSSProperties = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "24px auto",
  width: "280px",
  textAlign: "center",
};

const codeText: React.CSSProperties = {
  color: "#000",
  fontFamily: "monospace",
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "6px",
  lineHeight: "40px",
  padding: "16px 0",
  margin: 0,
  textAlign: "center",
};

const footer: React.CSSProperties = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "20px",
  marginTop: "16px",
};
