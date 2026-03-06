import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButtons } from "@/components/auth-buttons";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <section className="centered-page">
      <div className="card auth-card">
        <span className="eyebrow">Acceso</span>
        <h1>Acceder a tu cuenta</h1>

        <SignInButtons />
      </div>
    </section>
  );
}
