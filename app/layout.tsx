import "./globals.css";
import { AuthButton } from "@/components/auth-button";
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
      <body>
        <div className="header">
          <div className="titleWrapper">
            <h1 className="title">Exchange Mart</h1>
            <h2>{<AuthButton />}</h2>
          </div>
          <div className="navBar">
            <nav>
              <Button className="items-center ">
                <Link href="/" passHref>Home </Link>
              </Button>
              <Button className="navButton">
                <Link href="/blog" passHref>Blog </Link>
              </Button>
              <Button className="navButton">
                <Link href="/checklist" passHref>Checklist </Link>
              </Button>
              <Button className="navButton">
                <Link href="/profile" passHref>Profile </Link>
              </Button>
            </nav>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
