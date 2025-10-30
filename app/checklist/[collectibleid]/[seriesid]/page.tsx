import { createClient } from "@/lib/supabase/server";
import { Button, Checkbox } from "@mui/material";

export default async function CollectibleChecklist({ params }: { params: { seriesid: string, collectibleid: string } }) {

  const supabase = await createClient();
  const user = supabase.auth.getUser()

  const { data: figurines } = await supabase.from("figurine").select(`*`)
    .eq("seriesid", params.seriesid)

  return (
    <main>
      <h1>figurine checklist page</h1>
      <div>
        {figurines?.map((figurine) =>
          <div key={figurine.figurineid}>
            <p>{figurine.figurinename}</p>
            <Checkbox/>
          </div>
        )}
      </div>
    </main>
  )
}