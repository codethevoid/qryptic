import { redirect } from "next/navigation";
import { PaymentSuccessClient } from "./client";

const PaymentSuccessPage = ({ searchParams }: { searchParams: { plan: string } }) => {
  const { plan } = searchParams;
  if (!plan) redirect("/");
  if (plan !== "pro" && plan !== "business") redirect("/");
  return <PaymentSuccessClient plan={plan} />;
};

export default PaymentSuccessPage;
