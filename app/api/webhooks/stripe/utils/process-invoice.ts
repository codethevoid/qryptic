import prisma from "@/db/prisma";
import Stripe from "stripe";

export const processInvoice = async (invoice: Stripe.Invoice, customer: string) => {
  // create or update invoice in db
  await prisma.invoice.upsert({
    where: { stripeInvoiceId: invoice.id },
    update: { status: invoice.status as string },
    create: {
      team: { connect: { stripeCustomerId: customer as string } },
      stripeInvoiceId: invoice.id,
      status: invoice.status as string,
      amount: invoice.amount_due,
      invoicePdf: invoice.invoice_pdf,
      date: new Date(invoice.created * 1000),
      number: invoice.number,
    },
  });
};
