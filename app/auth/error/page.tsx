import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-[100svh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Oops! Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
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
