import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function SeriesChecklist({
  params,
}: {
  params: { collectibleid?: string };
}) {
  const collectibleid = (await params).collectibleid;
  const supabase = await createClient();

  const { data: series } = await supabase
    .from("series")
    .select(`seriesid, seriesname, collectibleid`)
    .eq("collectibleid", collectibleid);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6">
      <header className="text-center mb-10">
        <h2 className="text-4xl font-bold text-purple-700 mb-2">
          Series Checklist
        </h2>
        <p className="text-purple-500 text-lg">
          Explore the series for this collectible
        </p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {series?.map((item) => (
          <div
            key={item.seriesid}
            className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col"
          >
            <h3 className="text-xl font-semibold text-purple-800 mb-3">
              {item.seriesname}
            </h3>

            <div className="mt-auto">
              <Link
                href={`/checklist/${item.collectibleid}/${item.seriesid}`}
                className="block w-full text-center bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                View Series Details
              </Link>
            </div>
          </div>
        ))}

        {series?.length === 0 && (
          <div className="col-span-full text-center text-gray-500 mt-8">
            No series found for this collectible.
          </div>
        )}
      </section>

      <div className="mt-10 text-center">
        <Link
          href="/checklist"
          className="inline-block text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Back to Checklist
        </Link>
      </div>
    </main>
  );
}