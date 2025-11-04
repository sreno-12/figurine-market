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
      blogpostid, title, content, likes, datetimeposted, userid,
      comment (
        commentid, content, datetimeposted, userid, replyto
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

  async function changeLike(formData: FormData) {
    "use server";
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const blogid = formData.get("blogid");

    const { data: existingLike } = await supabase
      .from("likedpost")
      .select("*")
      .eq("userid", user?.id)
      .eq("blogid", blogid)
      .maybeSingle();

    let likedState = true;

    if (!existingLike) {
      console.log("new line")
      await supabase.from("likedpost").insert({
        userid: user?.id,
        blogid: blogid,
        liked: true,
        changedat: new Date().toISOString(),
      });
      await supabase.rpc("incrementlike", { postid: blogid });
    } else {
      console.log("update line")
      likedState = !existingLike.liked;

      await supabase
        .from("likedpost")
        .update({ liked: likedState, changedat: new Date().toISOString() })
        .eq("likedpostid", existingLike.likedpostid);

      const rpcName = likedState ? "incrementlike" : "decrementlike";
      await supabase.rpc(rpcName, { postid: blogid });
    }

    revalidatePath("/blog");
  }

  return (
    <div>
      {postsWithAuthors?.map(post => (
        <div key={post.blogpostid} className="blogPost">
          <h2>{post.title}</h2>
          <div>By <strong>{post.userTitle}</strong> | {dayjs(post.datetimeposted).format('MM/DD/YYYY h:mm A')}</div>
          <p>{post.content}</p>
          <form action={changeLike}>
            <input type="hidden" name="blogid" value={post.blogpostid} />
            <Button type="submit">🖒 {post.likes}</Button>
          </form>

          <Comments comments={post.comment} postId={post.blogpostid}></Comments>
        </div>
      ))}
    </div>
  );
}
