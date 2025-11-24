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
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      router.push("/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-700">Set a New Password</CardTitle>
          <CardDescription className="text-gray-700">Please enter your new password below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700">New Password</Label>
              <Input
                id="password"
                type="password"
                className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full !bg-purple-500 !text-white hover:!bg-purple-600 !normal-case self-end !border-violet-500 !border !border-solid" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save new password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}