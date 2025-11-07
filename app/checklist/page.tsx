import { createClient } from "@/lib/supabase/server";
import { Button } from "@mui/material";

export default async function Checklist() {
  const supabase = await createClient();

  const { data: collectibles } = await supabase.from("collectible").select(`
    collectibleid,
    collectiblename
  `);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">Checklist</h1>
        <p className="text-purple-500 text-lg">
          Track and explore your collection items
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collectibles?.map((collectible) => (
          <div
            key={collectible.collectibleid}
            className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-3">
              {collectible.collectiblename}
            </h2>

            <Button
              href={`/checklist/${collectible.collectibleid}`}
              className="!bg-purple-500 !text-white hover:!bg-purple-600 !normal-case w-full"
            >
              View Series
            </Button>
          </div>
        ))}
      </section>
    </main>
  );
}
