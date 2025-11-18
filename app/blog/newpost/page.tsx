import { Button } from "@mui/material";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewBlogPost() {
  async function newBlogPost(formData: FormData) {
    "use server"

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login")
    }

    const title = formData.get("blogtitle")
    const content = formData.get("blogcontent")

    await supabase
      .from("blogpost")
      .insert({
        userid: user?.id,
        title: title,
        content: content
      })

    revalidatePath("/")
    redirect("/blog")
  }

  return (
    <main className="max-w-3xl mx-auto py-10 px-6">
      <div className="bg-white shadow-md rounded-xl border border-purple-100 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          New Blog Post
        </h1>
        <form
          action={newBlogPost}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="blogtitle"
              className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Enter blog title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="blogcontent"
              rows={10}
              className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Write your post content here..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t border-purple-100">
            <Button
              type="submit"
              className="!bg-purple-500 hover:!bg-purple-600 !text-white !normal-case"
            >
              Save Changes
            </Button>
            <Button className="!text-purple-600 hover:!text-purple-800 !normal-case">
              <Link href="/blog">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>

    </main>
  )
}