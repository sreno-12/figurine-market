import { BlogPost } from "@/components/blog/blog-post";
import { Button } from "@mui/material";

export default async function Blog() {

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-end">
        <Button href="/blog/newpost" className="!bg-purple-500 !text-white hover:!bg-purple-600 !normal-case self-end">
          New Post
        </Button>
      </div>
      <BlogPost></BlogPost>
    </div >
  )
}