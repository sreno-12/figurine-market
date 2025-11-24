import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10 mt-6">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-purple-700">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="text-gray-700">Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-gray-500">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
