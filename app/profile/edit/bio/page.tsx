import { createClient } from "@/lib/supabase/server";
import { Accordion, AccordionDetails, AccordionSummary, Button } from "@mui/material";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
        .select("firstname, lastname, bio, favcollectible, favseries, favfigurine")
        .eq("userid", (await supabase.auth.getUser()).data.user?.id)
        .single(),
    ]);

  return (
    <main className="max-w-7xl mx-auto py-10 px-6">
      <div className="bg-white shadow-md rounded-xl border border-purple-100 p-8">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">
          Edit Profile
        </h1>

        <form method="POST" className="space-y-8">
          <input type="hidden" name="userid" value={user?.id} />

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              Personal Info
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  defaultValue={userprofile?.firstname ?? ""}
                  className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  defaultValue={userprofile?.lastname ?? ""}
                  className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                defaultValue={userprofile?.bio ?? ""}
                className="w-full rounded-md border border-purple-200 p-2 focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-purple-700 mb-3">
              Favorites
            </h2>

            <div className="mb-4">
              <h3 className="font-medium text-purple-700 mb-2">
                Favorite Collectible
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {collectibles?.map((collectible) => (
                  <label
                    key={collectible.collectibleid}
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="collectible"
                      value={collectible.collectibleid}
                      className="accent-purple-700"
                      defaultChecked={
                        userprofile?.favcollectible === collectible.collectibleid
                      }
                    />
                    <span className="text-sm text-purple-700 font-medium">
                      {collectible.collectiblename}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-purple-700 mb-2">
                Favorite Series
              </h3>
              {collectibles?.map((collectible) => (
                <Accordion
                  key={collectible.collectibleid}
                  className="!bg-purple-50 !shadow-none !border !border-purple-200 !rounded-lg !mb-2"
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-purple-700 font-semibold">
                      {collectible.collectiblename}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails className="space-y-1">
                    {collectible.series?.map((series) => (
                      <label
                        key={series.seriesid}
                        className="flex items-center gap-2 p-1 rounded hover:bg-purple-100 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="series"
                          className="accent-purple-700"
                          value={series.seriesid}
                          defaultChecked={
                            userprofile?.favseries === series.seriesid
                          }
                        />
                        <span className="text-sm text-purple-700">
                          {series.seriesname}
                        </span>
                      </label>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>

            <div>
              <h3 className="font-medium text-purple-700 mb-2">
                Favorite Figurine
              </h3>
              {collectibles?.map((collectible) => (
                <Accordion
                  key={collectible.collectibleid}
                  className="!bg-purple-50 !shadow-none !border !border-purple-200 !rounded-lg !mb-2"
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <span className="text-purple-700 font-semibold">
                      {collectible.collectiblename}
                    </span>
                  </AccordionSummary>
                  <AccordionDetails>
                    {collectible.series?.map((series) => (
                      <Accordion
                        key={series.seriesid}
                        className="!bg-purple-100 !shadow-none !border !border-purple-200 !rounded-lg !mb-2"
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <span className="text-purple-700 font-semibold">
                            {series.seriesname}
                          </span>
                        </AccordionSummary>
                        <AccordionDetails className="space-y-1">
                          {series.figurine?.map((figurine) => (
                            <label
                              key={figurine.figurineid}
                              className="flex items-center gap-2 p-1 rounded hover:bg-purple-200 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="figurine"
                                className="accent-purple-700"
                                value={figurine.figurineid}
                                defaultChecked={
                                  userprofile?.favfigurine ===
                                  figurine.figurineid
                                }
                              />
                              <span className="text-sm text-purple-700">
                                {figurine.figurinename}
                              </span>
                            </label>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-4 pt-6 border-t border-purple-100">
            <Button
              type="submit"
              formAction={updateProfile}
              className="buttonPrimary"
            >
              Save Changes
            </Button>
            <Button href="/profile" className="buttonSecondary">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
