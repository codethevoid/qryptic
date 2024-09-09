import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/utils/stripe";
import Stripe from "stripe";
import { paymentSucceeded } from "@/app/api/webhooks/stripe/payment-succeeded";
import { paymentFailed } from "@/app/api/webhooks/stripe/payment-failed";
import { subscriptionUpdated } from "@/app/api/webhooks/stripe/subscription-updated";
import { subscriptionDeleted } from "@/app/api/webhooks/stripe/subscription-deleted";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature") as string;
  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (e) {
    const error = e as Error;
    console.log(error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  switch (event.type) {
    case "invoice.payment_succeeded":
      await paymentSucceeded(event.data.object as Stripe.Invoice);
      break;
    case "invoice.payment_failed":
      await paymentFailed(event.data.object as Stripe.Invoice);
      break;
    case "customer.subscription.updated":
      await subscriptionUpdated(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.deleted":
      await subscriptionDeleted(event.data.object as Stripe.Subscription);
      break;
    case "customer.subscription.trial_will_end":
      console.log("Customer subscription trial will end");
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
};
