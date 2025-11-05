import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  
  const supabase = await createClient();
  const { userid, figurineid, owned } = await req.json();

  const { data } = await supabase
    .from("collectiblefigurine")
    .select("*")
    .eq("userid", String(userid))
    .eq("figurineid", figurineid)
    .maybeSingle();


  if (data) {
    await supabase
      .from("collectiblefigurine")
      .update({ owned })
      .eq("userid", userid)
      .eq("figurineid", figurineid);
  } else {
    await supabase.from("collectiblefigurine").insert({
      userid: userid,
      figurineid: figurineid,
      owned,
    });
  }

  return NextResponse.json({ success: true });
}
