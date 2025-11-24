import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-6">
      <div className="w-full max-w-3xl">
        <Card className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl  text-purple-700 text-center">Oops! Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <p className="text-sm text-muted-foreground text-center">
              {searchParams.error
                ? `Error code: ${searchParams.error}`
                : "An unspecified error occurred."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
