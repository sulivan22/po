import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

import { auth } from "@/auth";
import { Providers } from "@/components/providers";
import { SignOutButton } from "@/components/auth-buttons";
import { getUserRoleByEmail } from "@/lib/repositories";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Porrify - Porras privadas de competiciones deportivas",
  description: "Crea o únete a porras de competiciones deportivas privadas con tus amigos, compañeros o familiares."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = await getUserRoleByEmail(session?.user?.email);

  return (
    <html lang="es">
      <body>
        <Providers>
          <div className="shell">
            <header className="topbar">
              <Link href="/" className="brand">
                <img src="/porrify-logo.jpg" alt="Porrify" width="160" height="40" className="brand-logo" />
              </Link>
              <nav className="nav">
                {session?.user ? <Link href="/dashboard">Dashboard</Link> : null}
                {session?.user && role === "admin" ? <Link href="/admin">Admin</Link> : null}
                {session?.user ? <SignOutButton /> : <Link href="/signin">Acceder</Link>}
              </nav>
            </header>
            <main>{children}</main>
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
