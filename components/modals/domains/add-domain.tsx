import { useState } from "react";
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
import { Info, Sparkles } from "lucide-react";
import NextLink from "next/link";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useForm } from "react-hook-form";

type AddDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

export const AddDomain = ({ isOpen, setIsOpen }: AddDomainProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { team } = useTeam();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Add a domain</CompactDialogTitle>
          <CompactDialogDescription>Add a domain for brand consistency.</CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody className="max-w-[440px]">
          <div className="space-y-1.5">
            <Label>Domain</Label>
            <Input placeholder="mywebsite.link" />
            <div className="flex space-x-1.5">
              <Info size={13} className="relative top-[2px] shrink-0 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Don&apos;t know what domain to use?{" "}
                <NextLink
                  href="/docs/domains"
                  target="_blank"
                  className="text-deepBlue-600 hover:underline dark:text-deepBlue-500"
                >
                  Find out
                </NextLink>
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span>
                <Label>Default destination</Label>
              </span>
              {team?.plan.isFree && <ProTooltip />}
            </div>
            <Input placeholder="mywebsite.com" disabled={team?.plan.isFree} />
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
          <Button size="sm" disabled={isLoading}>
            Confirm
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
