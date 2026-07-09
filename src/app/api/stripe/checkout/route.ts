import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { modId?: string };
  if (!body.modId) {
    return NextResponse.json({ error: "modId required" }, { status: 400 });
  }

  const mod = await prisma.mod.findUnique({
    where: { id: body.modId, isPublished: true },
  });

  if (!mod || mod.priceCents <= 0) {
    return NextResponse.json({ error: "Mod not available for purchase" }, { status: 400 });
  }

  const existing = await prisma.purchase.findUnique({
    where: {
      userId_modId: { userId: session.user.id, modId: mod.id },
    },
  });
  if (existing) {
    return NextResponse.json({ error: "Already purchased" }, { status: 409 });
  }

  let user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (!user.stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: session.user.name ?? undefined,
      metadata: { userId: user.id },
    });
    user = await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id },
    });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: user.stripeCustomerId!,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: mod.priceCents,
          product_data: {
            name: mod.title,
            description: mod.shortDescription ?? mod.description.slice(0, 200),
          },
        },
      },
    ],
    metadata: {
      modId: mod.id,
      userId: user.id,
    },
    success_url: `${appUrl}/mods/${mod.slug}?purchased=1`,
    cancel_url: `${appUrl}/mods/${mod.slug}`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
