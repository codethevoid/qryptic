import {
  Dialog,
  DialogContent,
  CompactDialogHeader,
  CompactDialogTitle,
  CompactDialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTeams } from "@/lib/hooks/swr/use-teams";
import { useParams } from "next/navigation";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectGroup,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type TransferDomainParams = {
  name: string;
  slug: string;
  transferTo: string;
  transferLinks: boolean;
};

const transferDomain = async ({ name, slug, transferTo, transferLinks }: TransferDomainParams) => {
  try {
    // POST /api/domains/:slug/transfer
    // body {domain: string, transferTo: string, transferLinks: boolean}
    const res = await fetch(`/api/domains/${slug}/transfer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, transferTo, transferLinks }),
    });

    if (!res.ok) {
      const data = await res.json();
      return { error: data.error };
    }

    return { message: "Domain transferred successfully" };
  } catch (e) {
    console.error(e);
    return { error: "Failed to transfer domain" };
  }
};

type TransferDomainProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  domainName?: string;
  mutateDomains: () => Promise<void>;
};

export const TransferDomain = ({
  isOpen,
  setIsOpen,
  domainName,
  mutateDomains,
}: TransferDomainProps) => {
  const { teams } = useTeams();
  const { slug } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);
  const [transferLinks, setTransferLinks] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedTeam(undefined);
      setTransferLinks(true);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleTransfer = async () => {
    if (!selectedTeam) return;
    setIsLoading(true);

    const { error } = await transferDomain({
      name: domainName as string,
      slug: slug as string,
      transferTo: selectedTeam,
      transferLinks,
    });

    if (error) {
      setIsLoading(false);
      toast.error(error);
      return;
    }

    await mutateDomains();
    setIsOpen(false);
    setIsLoading(false);
    toast.success("Domain transferred successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Transfer domain</CompactDialogTitle>
          <CompactDialogDescription>
            Transfer <span className="font-medium text-foreground">{domainName}</span> to another
            team
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div className="space-y-1.5">
            <Label>Transfer to</Label>
            <Select value={selectedTeam} onValueChange={(value) => setSelectedTeam(value)}>
              <SelectTrigger>
                {selectedTeam ? (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5 rounded-full border">
                      <AvatarImage
                        src={teams?.find((t) => t.slug === selectedTeam)?.image}
                        alt={teams?.find((t) => t.slug === selectedTeam)?.name}
                      />
                      <AvatarFallback className="bg-transparent">
                        <Skeleton className="h-full w-full" />
                      </AvatarFallback>
                    </Avatar>
                    <p className="max-w-[280px] truncate text-[13px] font-medium">
                      {teams?.find((t) => t.slug === selectedTeam)?.name}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select a team</p>
                )}
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                <SelectGroup>
                  {teams
                    ?.filter((t) => t.slug !== slug)
                    .map((team) => (
                      <SelectItem key={team.slug} value={team.slug}>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-5 w-5 rounded-full border">
                            <AvatarImage src={team.image} alt={team.name} />
                            <AvatarFallback className="bg-transparent">
                              <Skeleton className="h-full w-full" />
                            </AvatarFallback>
                          </Avatar>
                          <p className={`max-w-[280px] truncate`}>{team.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="flex space-x-2.5">
              <Checkbox
                id="transfer-links"
                className="relative top-1.5"
                checked={transferLinks}
                onCheckedChange={(value: boolean) => setTransferLinks(value)}
              />
              <div className="space-y-0.5">
                <Label htmlFor="transfer-links">Transfer links and events</Label>
                <p className="text-xs text-muted-foreground">
                  Transfer all links associated with this domain to the new team. Links will be
                  deleted otherwise.
                </p>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button size="sm" disabled={isLoading} onClick={handleTransfer} className="w-[76px]">
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
