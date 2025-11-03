import { BlogPost } from "@/components/blog/blog-post";
import { Button } from "@mui/material";

export default async function Blog() {

  return (
    <main>
      <Button href="/blog/newpost">New Post</Button>
      <BlogPost></BlogPost>
    </main>
  )
}