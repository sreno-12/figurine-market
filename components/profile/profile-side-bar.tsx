import { createClient } from "@/lib/supabase/server";
import { Button } from "../ui/button";
import Link from "next/link";

export async function ProfileSideBar() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile, error } = await supabase
    .from("userprofile")
    .select(`
      bio,
      collectible: favcollectible ( collectiblename ),
      series: favseries ( seriesname ),
      figurine: favfigurine ( figurinename )
    `)
    .eq("userid", user?.id)
    .single();
    
  return (
    <div>
      <Button><Link href="../../profile/edit/bio">Edit</Link></Button>
      <h2>Bio:</h2>
      <p>{profile?.bio}</p> {/* Typescript wants to read collectible, series, figurine as arrays. profile as any tells typescript to let the code run as is, and not argue */}
      <h2>Favorite Collectible:</h2>
      <div>{(profile as any)?.collectible?.collectiblename}</div>
      <h2>Favorite Series:</h2>
      <div>{(profile as any)?.series?.seriesname}</div>
      <h2>Favorite Figurine:</h2>
      <div>{(profile as any)?.figurine?.figurinename}</div>
    </div>
  );
}
