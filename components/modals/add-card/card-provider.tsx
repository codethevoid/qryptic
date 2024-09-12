import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { DialogContent, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { CardCapture } from "@/components/modals/add-card/card-capture";
import { useClientSecret } from "@/lib/hooks/swr/use-client-secret";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

type CardProviderProps = {
  isOpen: boolean;
  hasPaymentMethod: boolean;
  setIsOpen: (open: boolean) => void;
  name: string;
};

export const CardProvider = ({ isOpen, setIsOpen, hasPaymentMethod, name }: CardProviderProps) => {
  const { clientSecret } = useClientSecret();

  const options = { clientSecret };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{hasPaymentMethod ? "Add a new card" : "Add a card"}</DialogTitle>
        </DialogHeader>
        <Elements stripe={stripePromise} options={options}>
          <CardCapture name={name} clientSecret={clientSecret} setIsOpen={setIsOpen} />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};
