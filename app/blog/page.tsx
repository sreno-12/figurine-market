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
    <div className="max-w-7xl mx-auto p-6 space-y-2">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-purple-700 mb-2">
          Blog
        </h2>
        <p className="text-purple-500 text-lg">
          Share your thoughts and connect with others in blind box community!
        </p>
      </div>
      <div className="flex justify-end pr-6">
        <Button onClick={userHandling} className="buttonPrimary">
          New Post
        </Button>
      </div>
      <BlogPost></BlogPost>
    </div >
  )
}