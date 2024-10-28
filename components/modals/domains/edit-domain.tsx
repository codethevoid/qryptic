import { useEffect, useState } from "react";
import {
  CompactDialogDescription,
  CompactDialogHeader,
  CompactDialogTitle,
  Dialog,
  DialogContent,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { AddDomainFormValues, addDomainSchema } from "@/lib/validation/domains/add";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, Sparkles } from "lucide-react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { toast } from "sonner";
import { type Domain } from "@/lib/hooks/swr/use-domains";

const editDomain = async (name: string, destination: string | undefined, slug: string) => {
  try {
    // PATCH /api/domains/:slug/edit
    // body = { destination, name }
    const res = await fetch(`/api/domains/${slug}/edit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, name }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { message: "Domain edited successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to edit domain" };
  }
};

type EditDomainProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  domain: Domain | null;
  mutateDomains: () => Promise<void>;
};

export const EditDomain = ({ isOpen, setIsOpen, domain, mutateDomains }: EditDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { team } = useTeam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDomainFormValues>({
    resolver: zodResolver(addDomainSchema),
    defaultValues: {
      name: domain?.name,
      destination: domain?.destination || "",
    },
  });

  const handleEdit = async (values: AddDomainFormValues) => {
    setIsLoading(true);
    const { error } = await editDomain(values.name, values.destination, team?.slug as string);
    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }
    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain edited successfully");
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        name: domain?.name,
        destination: domain?.destination || "",
      });
      setIsLoading(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Edit domain</CompactDialogTitle>
          <CompactDialogDescription>Edit {domain?.name}</CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div className="space-y-1.5">
            <Label htmlFor="domain-name">Domain</Label>
            <Input
              id="domain-name"
              disabled
              placeholder="links.example.com"
              {...register("name")}
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span>
                <Label htmlFor="domain-destination">Default destination</Label>
              </span>
              {team?.plan.isFree && <ProTooltip />}
            </div>
            <Input
              id="default-destination"
              placeholder="example.com"
              disabled={team?.plan.isFree}
              {...register("destination")}
            />
            {errors.destination && (
              <p className="text-xs text-red-600">{errors.destination.message}</p>
            )}
            <div className="flex space-x-1.5">
              <Info size={13} className="relative top-[2px] shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Redirect users who visit the root of your domain, access non-existent paths, or
                attempt to open expired links, to a specific URL.
              </p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit(handleEdit)}
            disabled={isLoading}
            className="w-[74px]"
          >
            {isLoading ? <ButtonSpinner /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger tabIndex={-1}>
        <Badge variant="colorful" className="cursor-auto space-x-1.5 hover:bg-teal-500/20">
          <Sparkles size={13} />
          <span>Pro</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>Upgrade to pro to access this feature</TooltipContent>
    </Tooltip>
  );
};
