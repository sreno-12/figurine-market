import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import dayjs from 'dayjs';
import Comments from "./comments";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

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

  const { data: likedPosts } = await supabase
    .from("likedpost")
    .select("*")
    .eq("userid", user?.id)

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

    const likedByUser = likedPosts?.some(like => like.blogid === post.blogpostid && like.liked);


    return {
      ...post,
      userTitle,
      liked: likedByUser,
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {postsWithAuthors?.map((post) => (
        <article
          key={post.blogpostid}
          className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300"
        >
          <header className="mb-4">
            <h2 className="text-2xl font-semibold text-purple-800 mb-1">{post.title}</h2>
            <div className="text-sm text-gray-500">
              By <span className="font-medium text-purple-600">{post.userTitle}</span> •{" "}
              {dayjs(post.datetimeposted).format("MMM D, YYYY h:mm A")}
            </div>
          </header>

          <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>

          <form action={changeLike} className="flex items-center gap-2">
            <input type="hidden" name="blogid" value={post.blogpostid} />
            <Button
              type="submit"
              className="!bg-purple-400 !text-white hover:!bg-purple-600 !normal-case flex items-center gap-1 px-3 py-1"
            >
              <ThumbUpIcon className={`w-5 h-5 ${post.liked ? "text-purple-600" : "text-white"}`} />
              <span>{post.likes}</span>
            </Button>
          </form>

          <hr className="my-4 border-purple-100" />
          <Comments comments={post.comment} postId={post.blogpostid} />
        </article>
      ))}
    </div>
  );
}
