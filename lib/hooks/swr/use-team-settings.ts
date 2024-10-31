import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useParams } from "next/navigation";

export type TeamSettings = {
  id: string;
  name: string;
  slug: string;
  image: string;
  company: string;
  emailInvoiceTo: string;
  inviteToken: string;
  subscriptionStatus:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired"
    | "paused";
  subscriptionStart: Date | null;
  subscriptionEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  trialEndsAt: Date | null;
  paymentMethod: {
    type: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
  plan: {
    id: string;
    isLegacy: boolean;
    name: string;
    links: number;
    domains: number;
    seats: number;
    isFree: boolean;
  };
  price: { id: string; price: number; interval: "year" | "month" } | null;
  members: {
    id: string;
    role: string;
    user: { id: string; email: string; name: string; image: string };
  }[];
  invites: { id: string; email: string; role: string }[];
  invoices: {
    id: string;
    amount: number;
    status: "open" | "paid" | "failed" | "void";
    date: Date;
    number: string;
    invoicePdf: string;
  }[];
  usage: { links: number; domains: number; members: number };
};

export const useTeamSettings = () => {
  const { slug } = useParams();
  const { data, isLoading, error, mutate } = useSWR<TeamSettings>(
    `/api/teams/${slug}/settings`,
    fetcher,
  );

  return { data, isLoading, error, mutate };
};
