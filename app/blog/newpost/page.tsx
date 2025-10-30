import { Button } from "@mui/material";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function Blog() {

  async function newBlogPost(formData: FormData) {

    const supabase = await createClient();

    const title = formData.get("title")
    const content = formData.get("content")

    await supabase
    .from("blogpost")
    .insert({
      title: title,
      content: content
    })

    revalidatePath("/")
    redirect("/blog")
  }

  return (
    <main>
      <form action={newBlogPost}>
        <h1>Title</h1>
        <input type="text" name="title" />
        <h1>Content</h1>
        <textarea name="content"></textarea>
        <Button type="submit">Submit</Button>
        <Button><Link href="../../profile">Cancel</Link></Button>
      </form>

    </main>
  )
}