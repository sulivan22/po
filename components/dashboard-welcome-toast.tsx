"use client";

import { useEffect, useRef } from "react";

import { useToast } from "@/components/toast-provider";

export function DashboardWelcomeToast({ enabled, userName }: { enabled: boolean; userName?: string | null }) {
  const shownRef = useRef(false);
  const { pushToast } = useToast();

  useEffect(() => {
    if (!enabled || shownRef.current) {
      return;
    }

    shownRef.current = true;
    pushToast({
      title: userName ? `Bienvenido, ${userName}.` : "Bienvenido a tu dashboard.",
      tone: "success"
    });
  }, [enabled, pushToast, userName]);

  return null;
}
