import { Button } from "@mui/material";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updateBlogPost(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const blogid = formData.get("blogid");
  const newtitle = formData.get("blogtitle");
  const newcontent = formData.get("blogcontent");

  await supabase
    .from("blogpost")
    .update({ title: newtitle, content: newcontent })
    .eq("blogpostid", blogid)
    .eq("userid", user?.id);

  revalidatePath("/profile");
  redirect("/profile");
}

async function deleteBlogPost(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const blogid = formData.get("blogid");

  await supabase.from("comment").delete().eq("blogpostid", blogid);
  await supabase.from("likedpost").delete().eq("blogid", blogid);
  await supabase
    .from("blogpost")
    .delete()
    .eq("blogpostid", blogid)
    .eq("userid", user?.id);

  revalidatePath("/profile");
  redirect("/profile");
}

export default async function EditBlogPost({ params }: { params: Promise<{ blogid: string }> }) {
  const { blogid } = await params;
  const supabase = await createClient();

  const [{ data: { user } }, { data: blog }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("blogpost").select("*").eq("blogpostid", blogid).single()
  ]);

  return (
    <main className="max-w-7xl mx-auto py-10 px-6">
      <div className="bg-white shadow-md rounded-xl border border-purple-100 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">
          Edit Blog Post
        </h1>

        <form
          action={deleteBlogPost}
          className="mb-8 p-4 border border-red-200 bg-red-50 rounded-lg"
        >
          <input type="hidden" name="blogid" value={blog.blogpostid} />
          <p className="text-sm text-red-600 mb-3">
            Deleting this post will permanently all content.
          </p>
          <Button
            type="submit"
            className="!bg-red-500 hover:!bg-red-600 !text-white !normal-case"
          >
            Delete Post
          </Button>
        </form>

        <form action={updateBlogPost} className="space-y-6">
          <input type="hidden" name="blogid" value={blog.blogpostid} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="blogtitle"
              defaultValue={blog.title}
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
              defaultValue={blog.content}
              rows={10}
              className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              placeholder="Write your post content here..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-purple-100">
            <Button
              type="submit"
              className="buttonPrimary"
            >
              Save Changes
            </Button>
            <Button href="/profile" className="buttonSecondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
