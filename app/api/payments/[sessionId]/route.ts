import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { getPaymentBySessionId, markPaymentPaid } from "@/lib/repositories";
import { getStripe } from "@/lib/stripe";

export async function GET(_: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const session = await auth();
  const userId = session?.user?.email;

  if (!userId) {
    return NextResponse.json({ error: "Debes iniciar sesión." }, { status: 401 });
  }

  const { sessionId } = await params;
  const payment = await getPaymentBySessionId(sessionId);

  if (!payment) {
    return NextResponse.json({ error: "Pago no encontrado." }, { status: 404 });
  }

  if (payment.userId !== userId) {
    return NextResponse.json({ error: "Pago no autorizado." }, { status: 403 });
  }

  if (payment.paymentStatus !== "paid") {
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status === "paid") {
      await markPaymentPaid({
        stripeSessionId: stripeSession.id,
        amountTotal: stripeSession.amount_total ?? payment.amountTotal,
        currency: stripeSession.currency ?? payment.currency,
        customerEmail: stripeSession.customer_email ?? payment.customerEmail
      });
      return NextResponse.json({ ...payment, paymentStatus: "paid", checkoutStatus: "complete" });
    }
  }

  return NextResponse.json(payment);
}
