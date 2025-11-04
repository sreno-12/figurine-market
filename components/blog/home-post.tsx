import { createClient } from "@/lib/supabase/server";
import dayjs from 'dayjs';

export async function HomeBlogPost() {
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

    return {
      ...post,
      userTitle,
    }
  });

  return (
    <div>
      {postsWithAuthors?.map(post => (
        <div key={post.blogpostid} className="blogPost">
          <h2>{post.title}</h2>
          <div>By <strong>{post.userTitle}</strong> | {dayjs(post.datetimeposted).format('MM/DD/YYYY h:mm A')}</div>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
