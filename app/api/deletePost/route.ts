import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function DELETE(req: NextRequest) {

  const supabase = await createClient();
  const { blogid, userid } = await req.json();

  await supabase.from("comment").delete().eq("blogpostid", blogid);
  await supabase.from("likedpost").delete().eq("blogid", blogid);
  await supabase
    .from("blogpost")
    .delete()
    .eq("blogpostid", blogid)
    .eq("userid", userid);

  return NextResponse.json({ success: true });
}
