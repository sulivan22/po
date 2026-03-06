"use client";

import { signIn, signOut } from "next-auth/react";

export function SignInButtons() {
  function handleSignIn(provider: "google") {
    signIn(provider, { callbackUrl: "/dashboard?welcome=1" });
  }

  return (
    <div className="auth-grid">
      <button className="primary-button" onClick={() => handleSignIn("google")}>
        Continuar con Google
      </button>
    </div>
  );
}

export function SignOutButton() {
  return (
    <button className="ghost-button" onClick={() => signOut({ callbackUrl: "/" })}>
      Cerrar sesión
    </button>
  );
}
