import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";
import Link from "next/link";

export default async function Checklist() {

  const supabase = await createClient();

  const { data: collectibles } = await supabase.from("collectible").select(`
        collectibleid,
        collectiblename
      `)

  return (
    <main>
      <h1>checklist page</h1>
      <div>
        {collectibles?.map((collectible) =>
          <div key={collectible.collectibleid}>
            <Button><Link href={`/checklist/${collectible.collectibleid}`}>{collectible.collectiblename}</Link></Button>
          </div>
        )}
      </div>
    </main>
  )
}