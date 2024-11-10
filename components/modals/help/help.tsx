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
  help: z.string().min(1, { message: "Message is required" }),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const Help = ({ isOpen, setIsOpen }: Props) => {
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
    const { help } = values;
    try {
      const res = await fetch("/api/contact/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ help }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      toast.success("Help request submitted");
      setIsOpen(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      toast.error("Error submiting help request");
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
            <CompactDialogTitle>Submit help request</CompactDialogTitle>
            <CompactDialogDescription>
              Let us know what you need help with.
            </CompactDialogDescription>
          </CompactDialogHeader>
          <DialogBody>
            <div className="space-y-1.5">
              <Textarea
                id="help"
                placeholder="Let us know what you need help with."
                {...register("help")}
              />
              {errors.help && <p className="text-xs text-red-600">{errors.help.message}</p>}
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
