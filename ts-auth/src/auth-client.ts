import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins/jwt";
import { emailOTP } from "better-auth/plugins/email-otp";
import { OtpEmail } from "./otp";

import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

// Create the pool instance
export const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection on startup
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    // your database config (PostgreSQL, MySQL, SQLite, etc.)
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  plugins: [
    emailOTP({
      // Required: Send OTP to user's email
      async sendVerificationOTP({ email, otp, type }) {
        // Use your email service (Resend, SendGrid, Nodemailer, etc.)
        if (type === "sign-in") {
          await sendEmail({
            to: email,
            subject: "Your Sign In Code",
            html: OtpEmail({ validationCode: otp }),
          });
        } else if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: OtpEmail({ validationCode: otp }),
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Reset Your Password",
            html: OtpEmail({ validationCode: otp }),
          });
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: false,

      // Optional: Override default email verification to use OTP instead of link
      overrideDefaultEmailVerification: false,
    }),
  ],
});
