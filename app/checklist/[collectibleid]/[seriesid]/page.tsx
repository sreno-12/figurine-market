import { createClient } from "@/lib/supabase/server";
import { Button, Checkbox } from "@mui/material";
import FigurineCheckbox from "./figurinecheckbox";

export default async function CollectibleChecklist({ params }: { params: Promise<{ seriesid: string, collectibleid: string }> }) {

  const seriesid = (await params).seriesid
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: figurines } = await supabase.from("figurine").select(`*`)
    .eq("seriesid", seriesid)
  const { data: ownedfigurines } = await supabase.from("collectiblefigurine").select("*").eq("userid", user?.id)

  const ownedMap: Record<number, boolean> = {};
  ownedfigurines?.forEach(cf => {
    ownedMap[cf.figurineid] = cf.owned;
  });

  return (
    <main>
      <h1>figurine checklist page</h1>
      <div>
        {figurines?.map((figurine) =>
          <div key={figurine.figurineid}>
            <p>{figurine.figurinename}</p>
            <FigurineCheckbox
              figurineid={figurine.figurineid}
              userid={user?.id}
              ownedstatus={ownedMap[figurine.figurineid] ?? false}
            ></FigurineCheckbox>
          </div>
        )}
      </div>
    </main>
  )
}