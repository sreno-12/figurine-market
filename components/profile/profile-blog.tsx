import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "../login-form";
import { Button } from "@mui/material";
import Link from "next/link";

export async function ProfileBlog() {

  const supabase = await createClient();
  const { data: {user} } = await supabase.auth.getUser();

  const { data: postData } = await supabase.from('blogpost').select('*').eq('userid', user?.id);

  return user ? (
    <div>
      {postData?.map((post) => (
        <div key={post.blogpostid} className="blogPost">
          <Button><Link href={`/profile/edit/${post.blogpostid}`}>Edit</Link></Button>
          <div>
            <h1>{post.title}</h1>
            <span>{post.userid}</span>  {/* Want to change this to be user email. Must switch database up*/}
            <span>{post.datetimeposted}</span>
            <p>{post.content}</p>
            <br />
          </div>
        </div>
      ))}
    </div>
  ) : (
    <LoginForm></LoginForm>
  );

}