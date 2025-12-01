import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {

  const supabase = await createClient();

  const { content, blogpostid, replyto } = await request.json();

  const { data: { user } } = await supabase.auth.getUser();

  await supabase.from("comment").insert({
    content,
    blogpostid,
    userid: user?.id,
    datetimeposted: new Date().toISOString(),
    replyto: replyto || null,
  });

  return NextResponse.json({ success: true });

}
