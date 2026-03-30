import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins/jwt";
import { emailOTP } from "better-auth/plugins/email-otp";
import SignInOtpEmail from "./emails/otp";
import { Pool } from "pg";
import * as dotenv from "dotenv";

pg.make entity user

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

const server = Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api/auth")) {
      return auth.handler(req);
    }

    return new Response("Auth server running");
  },
});

console.log(`Auth server running on http://localhost:${server.port}`);

const auth = betterAuth({
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
          await sendEmail({
            to: email,
            subject: "Your Sign In Code",
            html: SignInOtpEmail({ validationCode: otp }),
          });
        } else if (type === "email-verification") {
          await sendEmail({
            to: email,
            subject: "Verify Your Email",
            html: SignInOtpEmail({ validationCode: otp }),
          });
        } else if (type === "forget-password") {
          await sendEmail({
            to: email,
            subject: "Reset Your Password",
            html: SignInOtpEmail({ validationCode: otp }),
          });
        }
      },
      otpLength: 6,
      expiresIn: 300,
      allowedAttempts: 3,
      disableSignUp: false,
      overrideDefaultEmailVerification: false,
    }),
    jwt(),
  ],
});
