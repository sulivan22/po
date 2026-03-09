"use client";

import { useToast } from "@/components/toast-provider";

export function InviteFriendButton({
  slug,
  porraName,
  competitionLabel
}: {
  slug: string;
  porraName: string;
  competitionLabel: string;
}) {
  const { pushToast } = useToast();

  async function handleInvite() {
    const url = `${window.location.origin}/porras/join?slug=${encodeURIComponent(slug)}`;
    const title = `Únete a la porra ${porraName}`;
    const text = `Te invito a unirte a mi porra (${competitionLabel}).`;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      pushToast({
        title: "Enlace directo al pago copiado al portapapeles.",
        tone: "success"
      });
    } catch {
      pushToast({
        title: "No se pudo compartir el enlace.",
        tone: "error"
      });
    }
  }

  return (
    <button className="share-button" type="button" onClick={handleInvite}>
      Compartir
    </button>
  );
}
