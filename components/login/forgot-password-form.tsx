"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@mui/material";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">Check Your Email</CardTitle>
            <CardDescription className="text-gray-700">Password reset instructions sent</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center text-gray-500">
              If you registered using email/password, you will receive a reset email shortly.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-700">Reset Your Password</CardTitle>
            <CardDescription className="text-gray-700">Enter your email and we'll send a reset link</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full !bg-purple-500 !text-white hover:!bg-purple-600 !normal-case self-end !border-violet-500 !border !border-solid" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
              <p className="text-sm text-center mt-2 text-gray-500">
                Remember your password? <Link href="/auth/login" className="underline">Login</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
