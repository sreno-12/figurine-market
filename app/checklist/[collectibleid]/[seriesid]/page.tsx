import { createClient } from "@/lib/supabase/server";
import FigurineCheckbox from "./figurinecheckbox";

export default async function CollectibleChecklist({
  params,
}: {
  params: { seriesid?: string; collectibleid?: string };
}) {
  const { seriesid } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: figurines } = await supabase
    .from("figurine")
    .select(`figurineid, figurinename, imageurl`) // include imageurl if exists
    .eq("seriesid", seriesid);

  const { data: ownedfigurines } = await supabase
    .from("collectiblefigurine")
    .select("figurineid, owned")
    .eq("userid", user?.id);

  const ownedMap: Record<number, boolean> = {};
  ownedfigurines?.forEach((cf) => {
    ownedMap[cf.figurineid] = cf.owned;
  });

  const total = figurines?.length || 0;
  const ownedCount = figurines?.filter(
    (f) => ownedMap[f.figurineid]
  ).length || 0;

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-purple-700 mb-2">
          Figurine Checklist
        </h1>
        <p className="text-purple-500 text-lg">
          Mark your owned figurines below
        </p>
        <div className="mt-3 text-sm text-gray-600">
          {ownedCount} of {total} owned
        </div>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {figurines?.map((figurine) => (
          <div
            key={figurine.figurineid}
            className="bg-white rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >

            <div className="flex-1 flex flex-col justify-between p-4">
              <h2 className="text-lg font-semibold text-purple-800 mb-2 text-center">
                {figurine.figurinename}
              </h2>

              <div className="mt-auto flex justify-center items-center gap-2">
                <FigurineCheckbox
                  figurineid={figurine.figurineid}
                  userid={user?.id}
                  ownedstatus={ownedMap[figurine.figurineid] ?? false}
                />
                <span className="text-sm text-gray-600">
                  {ownedMap[figurine.figurineid] ? "Owned" : "Not Owned"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {figurines?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-8">
            No figurines found in this series.
          </div>
        )}
      </section>

      <div className="mt-10 text-center">
        <a
          href={`/checklist/${seriesid}`}
          className="inline-block text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back to Series
        </a>
      </div>
    </main>
  );
}
