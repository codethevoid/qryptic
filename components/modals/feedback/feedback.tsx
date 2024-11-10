import { Button } from "@/components/ui/button";
import {
  Dialog,
  CompactDialogHeader,
  CompactDialogDescription,
  CompactDialogTitle,
  DialogContent,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";
import { ReceiptSwissFranc } from "lucide-react";

const schema = z.object({
  feedback: z.string().min(1, { message: "Feedback is required" }),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const Feedback = ({ isOpen, setIsOpen }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    const { feedback } = values;
    try {
      const res = await fetch("/api/contact/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      toast.success("Feedback submitted");
      setIsOpen(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error("Error submiting feedback");
    }
  };

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CompactDialogHeader>
            <CompactDialogTitle>Feedback</CompactDialogTitle>
            <CompactDialogDescription>
              We&apos;d love to hear your feedback on Qryptic.
            </CompactDialogDescription>
          </CompactDialogHeader>
          <DialogBody>
            <div className="space-y-1.5">
              <Textarea
                id="feedback"
                placeholder="Let us know what you think of Qryptic, any issues you're experiencing, or any suggestions or feature requests you may have."
                {...register("feedback")}
              />
              {errors.feedback && <p className="text-xs text-red-600">{errors.feedback.message}</p>}
            </div>
          </DialogBody>
          <DialogFooter>
            <Button size="sm" type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
            <Button size="sm" type="submit" className="w-[56px]" disabled={isLoading}>
              {isLoading ? <ButtonSpinner /> : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
