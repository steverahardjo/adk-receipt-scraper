import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins/email-otp";
import { SendEmail } from "./emails/otp";
import { Pool } from "pg";
import dotenv from "dotenv";
import { jwt } from "better-auth/plugins";

dotenv.config({ path: ".env" });

const pool = new Pool({
  host: "localhost",
  port: parseInt(process.env.DB_PORT!),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test connection on startup
pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

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
      overrideDefaultEmailVerification: false,
    }),
    jwt(),
  ],
});
