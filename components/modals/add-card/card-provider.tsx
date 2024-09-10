import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "next/navigation";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogBody,
  DialogDescription,
} from "@/components/ui/dialog";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const fetchClientSecret = async (slug: string) => {
  const res = await fetch(`/api/cards/setup-intent/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.clientSecret;
};

type CardProviderProps = {
  isOpen: boolean;
  hasPaymentMethod: boolean;
  setIsOpen: (open: boolean) => void;
};

export const CardProvider = ({ isOpen, setIsOpen, hasPaymentMethod }: CardProviderProps) => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;
    fetchClientSecret(slug as string).then((data) => setClientSecret(data));
  }, [slug]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasPaymentMethod ? "Add a new card" : "Add a card"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>This card will be used for future payments.</DialogDescription>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
