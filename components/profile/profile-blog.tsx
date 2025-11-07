import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "../login/login-form";
import { Button } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";

export async function ProfileBlog() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <LoginForm />;

  const { data: postData } = await supabase
    .from("blogpost")
    .select("*")
    .eq("userid", user.id)
    .order("datetimeposted", { ascending: false });

  const { data: profile } = await supabase
    .from("userprofile")
    .select("firstname, lastname")
    .eq("userid", user.id)
    .single();

  const userTitle =
    profile?.firstname || profile?.lastname
      ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim()
      : "Anonymous";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-purple-700 mb-2">
          Your Blog Posts
        </h1>
        <p className="text-gray-500">Manage your writings and updates below.</p>
      </header>

      {postData?.length ? (
        postData.map((post) => (
          <article
            key={post.blogpostid}
            className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-all duration-200"
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-1">
              {post.title}
            </h2>
            <div className="text-sm text-gray-500 mb-3">
              By <strong>{userTitle}</strong> •{" "}
              {dayjs(post.datetimeposted).format("MM/DD/YYYY h:mm A")}
            </div>
            <p className="text-gray-700 mb-4 whitespace-pre-wrap">
              {post.content}
            </p>
            <div className="text-right">
              <Button
                variant="outlined"
                sx={{
                  color: "#9333ea",
                  borderColor: "#c084fc",
                  "&:hover": { borderColor: "#9333ea", background: "#faf5ff" },
                }}
              >
                <Link href={`/profile/edit/${post.blogpostid}`}>Edit</Link>
              </Button>
            </div>
          </article>
        ))
      ) : (
        <div className="text-gray-500 text-center mt-10">
          You haven’t written any posts yet.
        </div>
      )}
    </div>
  );
}
