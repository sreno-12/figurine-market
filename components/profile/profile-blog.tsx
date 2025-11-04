import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "../login/login-form";
import { Button } from "@mui/material";
import Link from "next/link";
import dayjs from "dayjs";

export async function ProfileBlog() {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: postData } = await supabase.from('blogpost').select('*').eq('userid', user?.id);
  const { data: profile } = await supabase.from("userprofile").select("*").eq("userid", user?.id).single()
  let userTitle = "";

  function createUserTitle() {
    if (!profile?.firstname && !profile?.lastname)
      userTitle = "Anonymous"
    userTitle = profile?.firstname + " " + profile?.lastname
  }

  createUserTitle();

  return user ? (
    <div>
      {postData?.map((post) => (
        <div key={post.blogpostid} className="blogPost">
          <div>
            <h2>{post.title}</h2>
            <div>By <strong>{userTitle}</strong> | {dayjs(post.datetimeposted).format('MM/DD/YYYY h:mm A')}</div>
            <p>{post.content}</p>
          </div>
          <Button><Link href={`/profile/edit/${post.blogpostid}`}>Edit</Link></Button>
        </div>
      ))}
    </div>
  ) : (
    <LoginForm></LoginForm>
  );

}