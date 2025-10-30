import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import Link from "next/link";

export default async function SeriesChecklist({ params }: { params: { collectibleid: string } }) {

  const supabase = await createClient();

  const { data: series } = await supabase.from("series").select(`*`)
    .eq("collectibleid", params.collectibleid)

  return (
    <main>
      <h1>series checklist page</h1>
      <div>
        {series?.map((series) =>
          <div key={series.seriesid}>
            <Button><Link href={`/checklist/${series.collectibleid}/${series.seriesid}`}>{series.seriesname}</Link></Button>
          </div>
        )}
      </div>
    </main>
  )
}