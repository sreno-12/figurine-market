import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import dayjs from 'dayjs';

export async function BlogPost() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: postData } = await supabase
    .from("blogpost")
    .select(`
      blogpostid,
      title,
      content,
      likes,
      datetimeposted,
      userid,
      comment (
        commentid,
        content,
        datetimeposted,
        userid
      )
    `)
    .order("likes", { ascending: false });

  async function addLike(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const blogid = formData.get("blogid");

    await supabase.rpc("incrementlike", { postid: blogid });

    revalidatePath("/blog");
  }

  return (
    <div>
      {postData?.map((post) => (<div key={post.blogpostid} className="blogPost">
        <span>
          <h2>{post.title}</h2>
          <span>{post.userid} </span><span>{dayjs(post.datetimeposted).format('MM/DD/YYYY h:mm A')}</span>
          <p>{post.content}</p>
          <form action={addLike}>
            <input type="hidden" name="blogid" value={post.blogpostid} />
            <Button type="submit">🖒</Button> 
            <span>{post.likes}</span>
          </form>
          {post.comment?.map((comment) => (
            <div key={comment.commentid}>
              <span>{comment.userid} </span>
              <span>{dayjs(comment.datetimeposted).format('MM/DD/YYYY h:mm A')}</span>
              <p>{comment.content}</p>
              <span>
                <Button>Reply</Button>
              </span><br />
            </div>
          ))}
        </span>
      </div>
      ))}
    </div >
  );
}