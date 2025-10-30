import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  const { data: {user} } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("userprofile").select("*").eq("userid", user?.id).single()
  let userTitle = "";

  function createUserTitle() {
    if (!profile?.firstname && !profile?.lastname) 
      userTitle = user?.email as any
    userTitle = profile?.firstname + " " + profile?.lastname
  }

  createUserTitle()

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {userTitle}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
