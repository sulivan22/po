import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { markPaymentExpired, markPaymentPaid } from "@/lib/repositories";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe no configurado." }, { status: 500 });
  }

  const stripe = getStripe();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Firma ausente." }, { status: 400 });
  }

  const body = await request.text();
  const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await markPaymentPaid({
      stripeSessionId: session.id,
      amountTotal: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      customerEmail: session.customer_email ?? undefined
    });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await markPaymentExpired(session.id);
  }

  return NextResponse.json({ received: true });
}
