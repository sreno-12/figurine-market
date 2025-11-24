import "./globals.css";
import { AuthButton } from "@/components/login/auth-button";
import Link from "next/link";
import { Button } from "@mui/material";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-mono min-h-screen">
        <header className="w-full shadow-sm bg-purple-100 border-b border-purple-300">
          <div className="max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center py-6 px-6">
            <div>
              <h1 className="text-4xl font-extrabold text-purple-700">
                Exchange Mart
              </h1>
              <p className="text-lg text-purple-500 mt-1 ml-1">
                Collect • Track • Share
              </p>
            </div>

            <div className="mt-4">
              <AuthButton />
            </div>
          </div>

          <nav className="bg-purple-200/90 border-t border-purple-300">
            <ul className="max-w-8xl mx-auto flex flex-wrap justify-end gap-3 py-3 px-6">
              <Button className="buttonSecondary" href={"/"}>
                Home
              </Button>
              <Button className="buttonSecondary" href={"/blog"}>
                Blog
              </Button>
              <Button className="buttonSecondary" href={"/checklist"}>
                Checklist
              </Button>
              <Button className="buttonSecondary" href={"/profile"}>
                Profile
              </Button>
            </ul>
          </nav>
        </header>

        <main className="max-w-8xl mx-auto p-6 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
