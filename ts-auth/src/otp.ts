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
  validationCode: string;
}

export const OtpEmail = ({ validationCode = "123456" }: OtpEmailProps) => (
  <Html>
    <Head />
    <Preview>Your authentication code: {validationCode}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verify your identity</Heading>
        <Text style={text}>
          Please use the following one-time password (OTP) to complete your login.
          This code will expire in 10 minutes.
        </Text>

        <Section style={codeContainer}>
          <Text style={codeText}>{validationCode}</Text>
        </Section>

        <Text style={footer}>
          If you didn't request this code, you can safely ignore this email.
          Verification codes are sensitive—never share them with anyone.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OtpEmail;

// --- Styles ---

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "560px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "24px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const text = {
  color: "#4a4a4a",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px auto 14px",
  verticalAlign: "middle",
  width: "280px",
};

const codeText = {
  color: "#000",
  display: "inline-block",
  fontFamily: "monospace",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px", // Makes it easy to highlight/copy individual chars
  lineHeight: "40px",
  paddingBottom: "8px",
  paddingTop: "8px",
  margin: "0 auto",
  width: "100%",
  textAlign: "center" as const,
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "24px",
  marginTop: "12px",
};
