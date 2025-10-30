import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updateBlogPost(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const blogid = formData.get("blogid");
  const newtitle = formData.get("blogtitle");
  const newcontent = formData.get("blogcontent");

  await supabase
    .from("blogpost")
    .update({ title: newtitle, content: newcontent })
    .eq("blogpostid", blogid)
    .eq("userid", user.id);

  revalidatePath("/profile");
  redirect("/profile");
}

async function deleteBlogPost(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const blogid = formData.get("blogid");

  await supabase
    .from("blogpost")
    .delete()
    .eq("blogpostid", blogid)
    .eq("userid", user.id);

  revalidatePath("/profile");
  redirect("/profile");
}

export default async function EditBlogPost({ params }: { params: { blogid: string } }) {
  const supabase = await createClient();

  const [{ data: { user } }, { data: blog }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from("blogpost").select("*").eq("blogpostid", params.blogid).single()
  ]);

  if (!user) redirect("/login");
  if (!blog || blog.userid !== user.id) redirect("/profile");

  return (
    <main>
      <form action={deleteBlogPost}>
        <input type="hidden" name="blogid" value={blog.blogpostid} />
        <Button type="submit">Delete Post</Button>
      </form>

      <form action={updateBlogPost}>
        <input type="hidden" name="blogid" value={blog.blogpostid} />
        <h1>Title:</h1>
        <input type="text" name="blogtitle" defaultValue={blog.title} />
        <h1>Content:</h1>
        <textarea name="blogcontent" defaultValue={blog.content}></textarea><br />
        <Button type="submit">Save</Button>
        <Button asChild><Link href="/profile">Cancel</Link></Button>
      </form>
    </main>
  );
}
