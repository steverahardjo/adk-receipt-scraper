import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "#/lib/auth-client";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import { toast } from "sonner";
import { Mail, Check, X } from "lucide-react";

export const Route = createFileRoute("/auth/signup")({
  component: SignUpPage,
});

interface PasswordRequirements {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const passwordRequirements: PasswordRequirements = {
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    hasMinLength: password.length >= 8,
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!allRequirementsMet) {
      toast.error("Password does not meet all requirements");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await authClient.signUp.email(
        {
          name,
          email,
          password,
        },
        {
          onSuccess: (ctx) => {
            toast.success("Account created successfully");
            setUserId(ctx.data?.user.id || null);
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to create account");
          },
        }
      );
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMagicLinkSignUp() {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsMagicLinkLoading(true);

    try {
      const { data, error } = await authClient.signIn.magicLink(
        {
          email,
        },
        {
          onSuccess: () => {
            setMagicLinkSent(true);
            toast.success("Magic link sent to your email");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to send magic link");
          },
        }
      );
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsMagicLinkLoading(false);
    }
  }

  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <X className="h-3.5 w-3.5 text-muted-foreground" />
      )}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>
        {label}
      </span>
    </div>
  );

  return (
    <main className="page-wrap flex min-h-[80vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || magicLinkSent}
            />
          </div>

          {magicLinkSent ? (
            <div className="rounded-lg border bg-green-50 p-4 text-center dark:bg-green-900/20">
              <Mail className="mx-auto mb-2 h-8 w-8 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Check your email for the magic link to complete sign up
              </p>
              <Button
                type="button"
                variant="link"
                className="mt-2"
                onClick={() => setMagicLinkSent(false)}
              >
                Send again
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              className="w-full"
              variant="outline"
              onClick={handleMagicLinkSignUp}
              disabled={isMagicLinkLoading || !email}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isMagicLinkLoading ? "Sending..." : "Sign Up with Magic Link"}
            </Button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with password
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading || magicLinkSent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading || magicLinkSent}
                  autoComplete="new-password"
                />
                <div className="rounded-lg border bg-muted p-3">
                  <p className="mb-2 text-xs font-medium">
                    Password requirements:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    <RequirementItem
                      met={passwordRequirements.hasMinLength}
                      label="At least 8 characters"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasUppercase}
                      label="One uppercase letter"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasNumber}
                      label="One number"
                    />
                    <RequirementItem
                      met={passwordRequirements.hasSpecialChar}
                      label="One special character"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading || magicLinkSent}
                  autoComplete="new-password"
                  className={
                    confirmPassword && !passwordsMatch
                      ? "border-destructive focus-visible:ring-destructive"
                      : undefined
                  }
                />
                {confirmPassword && (
                  <p
                    className={`text-xs ${
                      passwordsMatch ? "text-green-500" : "text-destructive"
                    }`}
                  >
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isLoading || !allRequirementsMet || !passwordsMatch
                }
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/auth/signin"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
