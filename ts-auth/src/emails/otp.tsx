import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Font,
} from "@react-email/components";
import * as React from "react";
import { Resend } from "resend";

// 1. Unified Interface
interface OtpEmailProps {
  subject?: string;
  validationCode: string;
  toEmail?: string; // Optional for the component itself
}

// 2. Component must be SYNC (Removed 'async')
export function SignInOtpEmail({ validationCode = "123456" }: OtpEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="JetBrains Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/jetbrainsmono/v18/t63_2pt-pG6nsc1oLYomV-uS_8Z1Z-mS4HML7X_Z.woff2",
            format: "woff2",
          }}
          fontWeight={700}
          fontStyle="normal"
        />
      </Head>
      <Preview>Your Deneb verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Heading style={logo}>DENEB</Heading>
            <Heading style={h1}>Verify your login</Heading>
            <Text style={text}>
              To finish logging in to your account, please enter the following
              verification code. For your security, this code will expire in{" "}
              <strong>10 minutes</strong>.
            </Text>

            <Section style={codeContainer}>
              <Text style={codeText}>{validationCode}</Text>
            </Section>

            <Text style={subtext}>
              If you did not request this code, you can safely ignore this
              email. Verification codes are sensitive and should never be
              shared.
            </Text>

            <Hr style={hr} />

            <Section style={footer}>
              <Text style={footerText}>
                Securely delivered by{" "}
                <Link href="https://deneb.com" style={footerLink}>
                  Deneb
                </Link>
              </Text>
              <Text style={footerLinks}>
                <Link href="https://deneb.com" style={footerLink}>
                  Website
                </Link>
                {" • "}
                <Link href="mailto:support@deneb.com" style={footerLink}>
                  Support
                </Link>
                {" • "}
                <Link href="https://deneb.com/privacy" style={footerLink}>
                  Privacy
                </Link>
              </Text>
              <Text style={copyright}>
                © {new Date().getFullYear()} Deneb Inc. <br />
                San Francisco, CA
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// 3. Sender Function (Async is correct here)
export async function SendEmail({
  subject = "Deneb OTP Sign In",
  validationCode,
  toEmail,
}: {
  subject?: string;
  validationCode: string | number;
  toEmail: string;
}) {
  if (!process.env.RESEND_KEY) {
    console.error("Missing RESEND_KEY in environment variables");
    return;
  }

  const resend = new Resend(process.env.RESEND_KEY);
  const codeString = validationCode.toString();

  try {
    const { data, error } = await resend.emails.send({
      from: "Deneb <onboarding@resend.dev>",
      to: toEmail,
      subject: subject,
      react: <SignInOtpEmail validationCode={codeString} />,
    });

    if (error) {
      console.error("Resend Error details:", error);
      return;
    }

    console.log("Email sent successfully! ID:", data?.id);
  } catch (err) {
    console.error("Runtime Error sending email:", err);
  }
}

// --- Styles (unchanged from your original, kept for completeness) ---
const main: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  fontFamily: '"Inter", sans-serif',
};
const container: React.CSSProperties = {
  margin: "40px auto",
  padding: "0 20px",
  maxWidth: "480px",
};
const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "40px",
  textAlign: "center",
};
const logo: React.CSSProperties = {
  color: "#008080",
  fontSize: "15px",
  fontWeight: 700,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  margin: "0 0 40px",
};
const h1: React.CSSProperties = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: "32px",
  margin: "0 0 16px",
};
const text: React.CSSProperties = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 32px",
};
const codeContainer: React.CSSProperties = {
  background: "#f3f4f6",
  borderRadius: "8px",
  margin: "0 auto 32px",
  width: "100%",
  padding: "24px 0",
};
const codeText: React.CSSProperties = {
  color: "#111827",
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: "32px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  margin: "0",
};
const subtext: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 24px",
};
const hr: React.CSSProperties = {
  borderTop: "1px solid #e5e7eb",
  margin: "32px 0 24px",
};
const footer: React.CSSProperties = { textAlign: "center" };
const footerText: React.CSSProperties = { color: "#6b7280", fontSize: "14px" };
const footerLinks: React.CSSProperties = {
  margin: "8px 0 16px",
  fontSize: "14px",
  color: "#9ca3af",
};
const footerLink: React.CSSProperties = {
  color: "#111827",
  textDecoration: "underline",
  fontWeight: 500,
};
const copyright: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "12px",
  marginTop: "16px",
};
