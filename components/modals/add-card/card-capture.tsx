import { useElements, useStripe } from "@stripe/react-stripe-js";
import { CardElement } from "@stripe/react-stripe-js";
import { DialogBody, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { addCard } from "@/actions/cards/add-card";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { mutate } from "swr";
import { Label } from "@/components/ui/label";

type CardCaptureProps = {
  clientSecret: string;
  setIsOpen: (open: boolean) => void;
};

export const CardCapture = ({ clientSecret, setIsOpen }: CardCaptureProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const { data: team } = useTeamSettings();

  const onSubmit = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    const cardElement = elements.getElement("card");
    if (!cardElement) return;

    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (error) {
      setIsLoading(false);
      return setError(error.message as string);
    }

    const { error: resError } = await addCard(
      team?.slug as string,
      setupIntent.payment_method as string,
    );
    if (resError) return setIsLoading(false);
    await mutate(`/api/teams/${team?.slug}`);
    await mutate(`/api/teams/${team?.slug}/settings`);
    await mutate(`/api/cards/setup-intent/${team?.slug}`);
    toast.success("Card added successfully");
    setIsOpen(false);
    setIsLoading(false);
  };

  return (
    <>
      <DialogBody>
        <div className="space-y-1.5">
          <Label>Card details</Label>
          <CardElement
            options={{
              style: {
                base: {
                  color: resolvedTheme === "dark" ? "#fff" : "#000",
                  iconColor: resolvedTheme === "dark" ? "#fff" : "#000",
                  fontSize: "13px",
                  "::placeholder": {
                    color: resolvedTheme === "light" ? "#71717A" : "#A1A1AA",
                    fontSize: "13px",
                  },
                },
              },
              classes: {
                base: "h-[36px] shadow-sm rounded-lg hover:cursor-text font-normal border bg-transparent px-3 py-[9px] text-[13px] placeholder:text-muted-foreground placeholder:text-[13px] outline-none disabled:cursor-not-allowed disabled:opacity-50",
                focus: "ring-2 ring-ring transition",
              },
            }}
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <p className="text-[13px] text-muted-foreground">
          This card will be used for all future payments. You can change it at any time.
        </p>
      </DialogBody>
      <DialogFooter>
        <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          size="sm"
          className="w-[85px]"
          disabled={isLoading || !stripe || !elements}
          onClick={onSubmit}
        >
          {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Add card"}
        </Button>
      </DialogFooter>
    </>
  );
};
