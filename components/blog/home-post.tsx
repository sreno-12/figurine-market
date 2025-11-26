import { createClient } from "@/lib/supabase/server";
import dayjs from 'dayjs';

export async function HomeBlogPost() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: postData }, { data: profiles }] =
    await Promise.all([
      supabase.auth.getUser(),
      supabase.from("blogpost").select(`
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
        )`).order("likes", { ascending: false }),
      supabase.from("userprofile").select("userid, firstname, lastname")
    ])

  const postsWithAuthors = postData?.map(post => {
    const author = profiles?.find(profile => profile.userid === post.userid);
    const userTitle = author ? `${author.firstname} ${author.lastname}` : "Anonymous";

    return {
      ...post,
      userTitle,
    }
  });

  return (
    <div className="grid gap-6 max-w-7xl mx-auto p-6">
      {postsWithAuthors?.map((post) => (
        <div
          key={post.blogpostid}
          className="bg-white p-6 rounded-xl border border-purple-100 shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-2xl font-semibold  text-purple-700">{post.title}</h2>
          <div className="text-sm text-gray-500 mb-2">
            By <span className="font-medium text-purple-500">{post.userTitle}</span> •{" "}
            {dayjs(post.datetimeposted).format("MMM D, YYYY")}
          </div>
          <p className="text-gray-700">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
