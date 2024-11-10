import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  CompactDialogHeader,
  DialogContent,
  CompactDialogTitle,
  CompactDialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Info, LoaderCircle, Sparkles } from "lucide-react";
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDomainSchema, AddDomainFormValues } from "@/lib/validation/domains/add";
import { toast } from "sonner";

type AddDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  mutateDomains: () => Promise<void>;
};

const addDomain = async (values: AddDomainFormValues, slug: string) => {
  try {
    const res = await fetch(`/api/domains/${slug}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { message: "Domain added successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to create domain" };
  }
};

export const AddDomain = ({ isOpen, setIsOpen, mutateDomains }: AddDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { team } = useTeam();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddDomainFormValues>({
    resolver: zodResolver(addDomainSchema),
  });

  const onSubmit = async (values: AddDomainFormValues) => {
    setIsLoading(true);

    const { error, message } = await addDomain(values, team?.slug as string);

    if (error) {
      toast.error(error);
      setIsLoading(false);
      return;
    }

    // mutate domains
    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success(message);
  };

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Add a domain</CompactDialogTitle>
          <CompactDialogDescription>Add a domain for brand consistency.</CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody className="max-w-[440px]">
          <div className="space-y-1.5">
            <Label htmlFor="domain-name">Domain</Label>
            <Input id="domain-name" placeholder="mywebsite.link" {...register("name")} />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            {/* <div className="flex space-x-1.5">
              <Info size={13} className="relative top-[2px] shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Don&apos;t know what domain to use?{" "}
                <NextLink
                  href="/docs/domains"
                  target="_blank"
                  className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
                >
                  Find out
                </NextLink>
              </p>
            </div> */}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span>
                <Label htmlFor="domain-destination">Default destination</Label>
              </span>
              {team?.plan.isFree && <ProTooltip />}
            </div>
            <Input
              id="domain-destination"
              placeholder="mywebsite.com"
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
          <Button variant="outline" size="sm" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            className="w-[74px]"
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProTooltip = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="colorful" className="cursor-auto space-x-1.5 hover:bg-teal-500/20">
          <Sparkles size={13} />
          <span>Pro</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent sideOffset={6}>Upgrade to pro to access this feature</TooltipContent>
    </Tooltip>
  );
};
