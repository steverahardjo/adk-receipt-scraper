import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";

export const auth = betterAuth({
  database: {
    provider: "sqlite",
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  plugins: [
    magicLink({
      async sendMagicLink(data) {
        console.log(`Magic link for ${data.email}: ${data.url}`);
        // TODO: Integrate with email service (Resend, SendGrid, etc.)
        // await fetch("https://api.resend.com/emails", { ... })
      },
    }),
  ],
});
