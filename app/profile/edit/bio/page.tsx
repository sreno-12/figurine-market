import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";

async function updateProfile(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const userid = formData.get("userid");

  const updates = {
    bio: formData.get("bio"),
    firstname: formData.get("firstname"),
    lastname: formData.get("lastname"),
    favcollectible: formData.get("collectible"),
    favseries: formData.get("series"),
    favfigurine: formData.get("figurine"),
  };

  await supabase.from("userprofile").update(updates).eq("userid", userid);

  revalidatePath("/profile");
  redirect("/profile");
}

export default async function EditProfile() {
  const supabase = await createClient();

  const [{ data: { user } }, { data: collectibles }, { data: userprofile }] =
    await Promise.all([
      supabase.auth.getUser(),
      supabase.from("collectible").select(`
        collectibleid,
        collectiblename,
        series (
          seriesid,
          seriesname,
          figurine (
            figurineid,
            figurinename
          )
        )
      `),
      supabase
        .from("userprofile")
        .select("firstname, lastname, bio, favcollectible, favseries, favfigurine").eq("userid", (await supabase.auth.getUser()).data.user?.id)
        .single(),
    ]);

  return (
    <main>
      <form method="POST">
        <input type="hidden" name="userid" value={user?.id} />

        <h2>First Name:</h2>
        <input type="text" name="firstname" defaultValue={userprofile?.firstname ?? ""}></input>

        <h2>Last Name:</h2>
        <input type="text" name="lastname" defaultValue={userprofile?.lastname ?? ""}></input>

        <h2>Bio:</h2>
        <textarea name="bio" defaultValue={userprofile?.bio ?? ""}></textarea>

        <h2>Favorite Collectible:</h2>
        {collectibles?.map((collectible) => (
          <div key={collectible.collectibleid}>
            <h2>{collectible.collectiblename}</h2>
            <input
              type="radio"
              name="collectible"
              value={collectible.collectibleid}
              defaultChecked={
                userprofile?.favcollectible === collectible.collectibleid
              }
            />
          </div>
        ))}

        <h2>Favorite Series:</h2>
        {collectibles?.map((collectible) => (
          <Accordion key={collectible.collectibleid}>
            <AccordionSummary>
              <h2>{collectible.collectiblename}</h2>
            </AccordionSummary>
            <AccordionDetails>
              {collectible.series?.map((series) => (
                <div key={series.seriesid}>
                  <h4>{series.seriesname}</h4>
                  <input
                    type="radio"
                    name="series"
                    value={series.seriesid}
                    defaultChecked={userprofile?.favseries === series.seriesid}
                  />
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

        <h2>Favorite Figurine:</h2>
        {collectibles?.map((collectible) => (
          <Accordion key={collectible.collectibleid}>
            <AccordionSummary>
              <h2>{collectible.collectiblename}</h2>
            </AccordionSummary>
            <AccordionDetails>
              {collectible.series?.map((series) => (
                <Accordion key={series.seriesid}>
                  <AccordionSummary>
                    <h3>{series.seriesname}</h3>
                  </AccordionSummary>
                  <AccordionDetails>
                    {series.figurine?.map((figurine) => (
                      <div key={figurine.figurineid}>
                        <h4>{figurine.figurinename}</h4>
                        <input
                          type="radio"
                          name="figurine"
                          value={figurine.figurineid}
                          defaultChecked={
                            userprofile?.favfigurine === figurine.figurineid
                          }
                        />
                      </div>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}

        <br />
        <Button formAction={updateProfile}>Save</Button>
        <Button asChild>
          <Link href="../profile">Cancel</Link>
        </Button>
      </form>
    </main>
  );
}