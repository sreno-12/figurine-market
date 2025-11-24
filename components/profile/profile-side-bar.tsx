import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import Link from "next/link";

export async function ProfileSideBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("userprofile")
    .select(`
      firstname,
      lastname,
      bio,
      collectible: favcollectible ( collectiblename ),
      series: favseries ( seriesname ),
      figurine: favfigurine ( figurinename )
    `)
    .eq("userid", user?.id)
    .single();

  const fullName =
    profile?.firstname || profile?.lastname
      ? `${profile.firstname ?? ""} ${profile.lastname ?? ""}`.trim()
      : `${user?.email}`;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-purple-100 p-6 flex flex-col gap-6">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-purple-200 flex items-center justify-center text-3xl font-bold text-purple-700">
          {fullName[0].toUpperCase() ?? "?"}
        </div>
        <h2 className="text-2xl font-bold text-purple-700 mt-3 mb-3">{fullName}</h2>
        <Button  className="buttonPrimary">
          <Link href="../../profile/edit/bio">Edit Profile</Link>
        </Button>
      </div>

      <section>
        <h3 className="text-purple-700 font-semibold mb-1">Bio</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {profile?.bio || "No bio yet."}
        </p>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-purple-700 font-semibold">Favorite Collectible</h3>
          <p className="text-gray-700">
            {(profile as any)?.collectible?.collectiblename ?? "—"}
          </p>
        </div>
        <div>
          <h3 className="text-purple-700 font-semibold">Favorite Series</h3>
          <p className="text-gray-700">
            {(profile as any)?.series?.seriesname ?? "—"}
          </p>
        </div>
        <div>
          <h3 className="text-purple-700 font-semibold">Favorite Figurine</h3>
          <p className="text-gray-700">
            {(profile as any)?.figurine?.figurinename ?? "—"}
          </p>
        </div>
      </section>
    </div>
  );
}
