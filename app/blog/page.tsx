import { BlogPost } from "@/components/blog/blog-post";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import { redirect } from "next/navigation";

export default async function Blog() {

  async function userHandling() {
    "use server"
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/auth/login")
    else redirect("/blog/newpost")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-end">
        <Button onClick={userHandling} className="!bg-purple-500 !text-white hover:!bg-purple-600 !normal-case self-end">
          New Post
        </Button>
      </div>
      <BlogPost></BlogPost>
    </div >
  )
}