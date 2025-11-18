import "./globals.css";
import { AuthButton } from "@/components/login/auth-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <body className="font-mono bg-gradient-to-br from-purple-50 to-purple-200 min-h-screen text-gray-800">
        <header className="w-full shadow-sm bg-white/60 backdrop-blur-sm border-b border-purple-200">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center py-6 px-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700 tracking-tight">
                Exchange Mart
              </h1>
              <p className="text-lg text-purple-500 mt-1 ml-1">
                Collect • Track • Share
              </p>
            </div>

            <div className="mt-4 sm:mt-0">
              <AuthButton />
            </div>
          </div>

          <nav className="bg-purple-200/50 border-t border-purple-300">
            <ul className="max-w-6xl mx-auto flex flex-wrap justify-center sm:justify-end gap-3 py-3 px-6">
              {[
                { href: "/", label: "Home" },
                { href: "/blog", label: "Blog" },
                { href: "/checklist", label: "Checklist" },
                { href: "/profile", label: "Profile" },
              ].map((link) => (
                <li key={link.href}>
                  <Button
                    asChild
                    variant="outline"
                    className="border-purple-400 text-purple-700 hover:bg-purple-500 hover:text-white transition-colors"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
