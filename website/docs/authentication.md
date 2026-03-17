# Authentication Feature

## Overview
Email-based authentication system using Better Auth with Magic Link (OTP) support for the Personal Finance Tracker. Users can sign up/sign in either with a magic link sent to their email or with traditional email/password.

## Implementation Date
March 17, 2026

## Tech Stack
- **Authentication Framework**: Better Auth
- **Magic Link Plugin**: `better-auth/plugins/magicLink`
- **Frontend**: React + TanStack Start
- **UI Components**: shadcn/ui (Button, Input, Label, Card)
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React

## Files Created

### Server Configuration
- `src/lib/auth.ts` - Better Auth server instance with magic link plugin

### Client Configuration
- `src/lib/auth-client.ts` - Better Auth client

### API Routes
- `src/routes/api/auth/[...all].ts` - API route handler for auth endpoints

### Pages
- `src/routes/auth/signin.tsx` - Sign in page with magic link and email/password options
- `src/routes/auth/signup.tsx` - Sign up page with magic link and password registration

### Components Updated
- `src/components/Header.tsx` - Added authentication state display and sign in/up links
- `src/routes/__root.tsx` - Added Toaster for notifications

## Features

### Sign Up Options

#### 1. Magic Link Sign-Up (Recommended)
1. User enters their email address
2. Clicks "Sign Up with Magic Link"
3. Receives an email with a secure magic link
4. Clicks the link to automatically create an account and sign in
5. No password required

#### 2. Email/Password Sign-Up
1. User enters name, email, and password
2. Password must meet requirements:
   - At least 8 characters
   - One uppercase letter (A-Z)
   - One number (0-9)
   - One special character (!@#$%^&*, etc.)
3. User must confirm password matches
4. Account is created and user is signed in

### Sign In Options

#### 1. Magic Link Sign-In (Recommended)
1. User enters their email address
2. Clicks "Send Magic Link"
3. Receives an email with a secure one-time link
4. Clicks the link to automatically sign in
5. No password required

#### 2. Email/Password Sign-In
1. User enters email and password
2. Traditional authentication flow

### Session Management
- Session persisted for 7 days
- Session auto-refresh every 24 hours
- User info displayed in header when authenticated

## Magic Link Benefits

| Feature | Description |
|---------|-------------|
| **No Password Memory** | Users don't need to remember passwords |
| **Phishing-Resistant** | Links are one-time use and expire quickly |
| **Email Verification** | Automatically verifies email ownership |
| **Simplified UX** | One-click sign-in after initial setup |
| **Secure** | Uses cryptographically secure tokens |

## Environment Variables Required

```env
# Better Auth - Required
BETTER_AUTH_SECRET=<generate-32-char-secret>
BETTER_AUTH_URL=http://localhost:3000
VITE_BETTER_AUTH_URL=http://localhost:3000

# Database - SQLite for development
DATABASE_URL=file:./dev.db

# For production email sending:
# RESEND_API_KEY=your-resend-api-key
# SMTP_HOST=your-smtp-host
# SMTP_PORT=587
# SMTP_USER=your-smtp-user
# SMTP_PASS=your-smtp-password
```

## Usage Examples

### Accessing Session in Components
```tsx
import { authClient } from '#/lib/auth-client'

function MyComponent() {
  const { data: session } = authClient.useSession()
  
  if (session?.user) {
    return <p>Welcome, {session.user.name}!</p>
  }
  return <p>Please sign in</p>
}
```

### Programmatic Sign Out
```tsx
import { signOut } from '#/lib/auth-client'

await signOut()
```

### Sending Magic Link
```tsx
import { authClient } from '#/lib/auth-client'

const { data, error } = await authClient.signIn.magicLink(
  { email: "user@example.com" },
  {
    onSuccess: () => {
      toast.success("Magic link sent!")
    },
    onError: (ctx) => {
      toast.error(ctx.error.message)
    },
  }
)
```

## Email Integration (Production)

For production, integrate with an email service to send magic links:

### Using Resend (Recommended)
```ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

magicLink({
  async sendMagicLink(data) {
    await resend.emails.send({
      from: 'Expense Tracker <noreply@yourdomain.com>',
      to: data.email,
      subject: 'Your Magic Link to Sign In',
      html: `
        <h1>Sign in to Expense Tracker</h1>
        <p>Click the link below to sign in:</p>
        <a href="${data.url}">Sign In</a>
        <p>This link expires in 10 minutes.</p>
      `,
    })
  },
})
```

### Using SMTP (Nodemailer)
```ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

magicLink({
  async sendMagicLink(data) {
    await transporter.sendMail({
      from: 'Expense Tracker <noreply@yourdomain.com>',
      to: data.email,
      subject: 'Your Magic Link to Sign In',
      html: `
        <h1>Sign in to Expense Tracker</h1>
        <p>Click the link below to sign in:</p>
        <a href="${data.url}">Sign In</a>
        <p>This link expires in 10 minutes.</p>
      `,
    })
  },
})
```

## Browser Support

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome | Windows, macOS, Android, iOS | ✅ Full |
| Safari | macOS, iOS | ✅ Full |
| Firefox | Windows, macOS, Linux | ✅ Full |
| Edge | Windows, macOS | ✅ Full |

## Testing Checklist
- [ ] Sign up with magic link
- [ ] Sign up with email/password (valid credentials)
- [ ] Sign up with weak password (should fail)
- [ ] Sign up with mismatched passwords (should fail)
- [ ] Sign in with magic link
- [ ] Sign in with email/password (correct credentials)
- [ ] Sign in with email/password (incorrect credentials - should fail)
- [ ] Session persists after page refresh
- [ ] Sign out functionality
- [ ] Header shows correct auth state

## Security Considerations

1. **HTTPS Required**: Magic links require HTTPS in production
2. **Secret Key**: `BETTER_AUTH_SECRET` must be a cryptographically secure random string (min 32 chars)
3. **Link Expiration**: Magic links expire after 10 minutes by default
4. **One-Time Use**: Each magic link can only be used once
5. **Rate Limiting**: Built-in rate limiting prevents abuse

## Future Enhancements
- Email templates with branding
- OAuth providers (Google, GitHub) as additional options
- Two-factor authentication for sensitive operations
- Protected route guards
- Session management page (view active sessions, revoke)
- Account settings page

## Troubleshooting

### Magic link not arriving
- Check spam folder
- Verify email address is correct
- In development, check console logs for the magic link URL
- For production, verify email service credentials

### "Invalid magic link" error
- Link may have expired (10 minute timeout)
- Link may have already been used
- Request a new magic link

### Sign up fails
- Check password requirements are met
- Ensure passwords match
- Check email isn't already registered
