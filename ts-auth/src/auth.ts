import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import { SendEmail } from "./emails/otp";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "authuser",
  password: "authpass",
  database: "ts_auth",
});

// Test connection on startup
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  console.log(
    `Sending email to ${to} with subject ${subject} with html: ${html}`,
  );
}

export const auth = betterAuth({
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60 * 15,
  },
  baseURL: "http://localhost:3000",
  database: pool,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await SendEmail({
            toEmail: email,
            validationCode: otp,
            subject: "[Deneb] OTP Sign In",
          });
        } else if (type === "email-verification") {
          await SendEmail({
            toEmail: email,
            validationCode: otp,
            subject: "[Deneb] Verify Your Email",
          });
        } else if (type === "forget-password") {
          await SendEmail({
            toEmail: email,
            validationCode: otp,
            subject: "[Deneb] Reset Your Password",
          });
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: false,
      overrideDefaultEmailVerification: false,
    }),
  ],
});
