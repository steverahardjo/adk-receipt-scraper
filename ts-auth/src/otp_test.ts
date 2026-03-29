import { authClient } from "auth-client";

// Send OTP
const { data, error } = await authClient.emailOtp.sendVerificationOtp({
  email: "user@example.com",
  type: "sign-in", // or "email-verification" or "forget-password"
});

// Sign in with OTP
const { data, error } = await authClient.signIn.emailOtp({
  email: "user@example.com",
  otp: "123456",
  name: "John Doe", // optional (for new users)
});

// Verify email
const { data, error } = await authClient.emailOtp.verifyEmail({
  email: "user@example.com",
  otp: "123456",
});

// Reset password
const { data, error } = await authClient.emailOtp.resetPassword({
  email: "user@example.com",
  otp: "123456",
  password: "newSecurePassword",
});
