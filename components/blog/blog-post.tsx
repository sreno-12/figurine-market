import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import dayjs from 'dayjs';
import Comments from "./comments";

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
        userid,
        replyto
      )
    `)
    .order("likes", { ascending: false });

  const { data: profiles } = await supabase.from("userprofile").select("userid, firstname, lastname");

  const postsWithAuthors = postData?.map(post => {
    const author = profiles?.find(profile => profile.userid === post.userid);
    const userTitle = author ? `${author.firstname} ${author.lastname}` : "Anonymous";

    const commentsWithAuthors = post.comment?.map(comment => {
      const commenter = profiles?.find(profile => profile.userid === comment.userid);
      return {
        ...comment,
        userTitle: commenter ? `${commenter.firstname} ${commenter.lastname}` : "Anonymous"
      }
    });

    return {
      ...post,
      userTitle,
      comment: commentsWithAuthors
    }
  });

  const getTopLevelComments = (comments: any[]) => comments?.filter(c => c.replyto === null);

  const getReplies = (comments: any[], parentId: any) => comments?.filter(c => c.replyto === parentId);

  async function addLike(formData: FormData) {
    "use server"
    const supabase = await createClient();
    const blogid = formData.get("blogid");

    await supabase.rpc("incrementlike", { postid: blogid });
    revalidatePath("/blog");
  }

  async function addComment(formData: FormData) {
    "use server"
    const supabase = await createClient();
    const content = formData.get("content");
    const blogpostid = formData.get("blogpostid");
    const replyto = formData.get("replyto");

    if (!content) return;

    await supabase.from("comment").insert({
      content,
      blogpostid,
      userid: (await supabase.auth.getUser()).data.user?.id,
      datetimeposted: new Date().toISOString(),
      replyto: replyto || null,
    });

    revalidatePath("/blog")
  }

  return (
    <div>
      {postsWithAuthors?.map(post => (
        <div key={post.blogpostid} className="blogPost">
          <h2>{post.title}</h2>
          <div>By <strong>{post.userTitle}</strong> | {dayjs(post.datetimeposted).format('MM/DD/YYYY h:mm A')}</div>
          <p>{post.content}</p>
          <form action={addLike}>
            <input type="hidden" name="blogid" value={post.blogpostid} />
            <Button type="submit">🖒 {post.likes}</Button>
          </form>

          <Comments comments={post.comment} postId={post.blogpostid}></Comments>
        </div>
      ))}
    </div>
  );
}
