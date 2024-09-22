import { Domain } from "@prisma/client";
import {
  CircleArrowOutUpRight,
  CircleCheck,
  CornerDownRight,
  Fingerprint,
  Globe,
  Info,
  LoaderCircle,
  MoreHorizontal,
  Pencil,
  RotateCw,
  Target,
  Trash,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { RemoveDomain } from "@/components/modals/domains/remove-domain";
import { TransferDomain } from "@/components/modals/domains/transfer-domain";

const revalidationInterval = process.env.NODE_ENV === "production" ? 8000 : 100000;

type DomainWithLinkCount = Domain & { _count: { links: number } };

type DomainsTableProps = {
  domains: DomainWithLinkCount[];
  mutateDomains: () => Promise<void>;
};

const getDomainConfig = async (domain: string, slug: string) => {
  try {
    const res = await fetch(`/api/domains/${slug}/config`, {
      method: "POST",
      body: JSON.stringify({ name: domain }),
    });
    return await res.json();
  } catch (e) {
    console.error(e);
    return { misconfigured: true };
  }
};

const verifyDomain = async (domain: string, slug: string) => {
  try {
    const res = await fetch(`/api/domains/${slug}/verify`, {
      method: "POST",
      body: JSON.stringify({ name: domain }),
    });
    return await res.json();
  } catch (e) {
    console.error(e);
    return { verified: false };
  }
};

export const DomainsTable = ({ domains, mutateDomains }: DomainsTableProps) => {
  const [isCheckingConfig, setIsCheckingConfig] = useState<Record<string, boolean>>({});
  const [domainStatus, setDomainStatus] = useState<any>({});
  const [iRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainWithLinkCount | null>(null);
  const { slug } = useParams();

  const checkDomainStatus = async (domain: string) => {
    setIsCheckingConfig((prev) => ({ ...prev, [domain]: true }));
    const config = await getDomainConfig(domain, slug as string);
    const verification = await verifyDomain(domain, slug as string);
    setDomainStatus((prev: any) => ({ ...prev, [domain]: { config, verification } }));
    setIsCheckingConfig((prev) => ({ ...prev, [domain]: false }));
  };

  useEffect(() => {
    // run on component mount
    domains.forEach((domain) => checkDomainStatus(domain.name));
    // run every 8 seconds
    const interval = setInterval(() => {
      domains.forEach((domain) => checkDomainStatus(domain.name));
    }, revalidationInterval);
    return () => clearInterval(interval);
  }, [domains]);
  console.log(domainStatus);

  return (
    <>
      <div className="space-y-5">
        {domains
          .sort((a, b) => (b.isDefault ? 1 : -1))
          .map((domain, i) => (
            <div
              className={`space-y-4 rounded-lg border p-4 shadow-sm transition-all`}
              key={domain.id}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
                        <Globe size={13} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium">{domain.name}</p>
                        {domain.isDefault && <DefaultDomain />}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2.5 pl-3.5">
                      <CornerDownRight size={14} className="text-muted-foreground" />
                      <p className="pl-1 text-[13px] text-muted-foreground">
                        {domain.destination
                          ? `Redirects to ${domain.destination}`
                          : "No destination configured"}
                      </p>
                    </div>
                  </div>
                  <div className="flex h-8 items-center space-x-2.5 self-start">
                    {domainStatus[domain.name] && !isCheckingConfig[domain.name] && (
                      <>
                        {domainStatus[domain.name]?.config?.misconfigured ? (
                          <Badge variant="error" className="space-x-1.5">
                            <XCircle size={13} />
                            <span>Invalid config</span>
                          </Badge>
                        ) : domainStatus[domain.name]?.verification?.error?.code ===
                          "missing_txt_record" ? (
                          <Badge variant="warning" className="space-x-1.5">
                            <Fingerprint size={13} />
                            <span>Pending verification</span>
                          </Badge>
                        ) : (
                          <Badge variant="primary" className="space-x-1.5">
                            <CircleCheck size={13} />
                            <span>Valid config</span>
                          </Badge>
                        )}
                      </>
                    )}
                    {isCheckingConfig[domain.name] && (
                      <Badge variant="neutral" className="space-x-1.5">
                        <LoaderCircle size={13} className="animate-spin" />
                        <span>Validating</span>
                      </Badge>
                    )}
                    <div className="flex">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-7 space-x-1.5 rounded-r-none border-r-0 text-muted-foreground"
                            variant="outline"
                            size="icon"
                            disabled={isCheckingConfig[domain.name]}
                            onClick={() => checkDomainStatus(domain.name)}
                          >
                            <RotateCw
                              size={13}
                              className={isCheckingConfig[domain.name] ? "animate-spin" : undefined}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Revalidate</TooltipContent>
                      </Tooltip>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            className="h-7 rounded-l-none text-muted-foreground"
                            variant="outline"
                          >
                            <MoreHorizontal size={13} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className="w-[160px]"
                          align="end"
                          onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                          <DropdownMenuItem className="space-x-2">
                            <Pencil size={13} />
                            <span className="text-[13px]">Edit domain</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled={domain.isDefault} className="space-x-2">
                            <Target size={13} />
                            <span className="text-[13px]">Set as default</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="space-x-2"
                            onSelect={() => {
                              setSelectedDomain(domain);
                              setIsTransferOpen(true);
                            }}
                          >
                            <CircleArrowOutUpRight size={13} />
                            <span className="text-[13px]">Transfer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setSelectedDomain(domain);
                              setIsRemoveOpen(true);
                            }}
                            className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
                          >
                            <Trash size={13} />
                            <span className="text-[13px]">Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
              {domainStatus[domain.name]?.config?.misconfigured ? (
                <ConfigureDns domain={domain} />
              ) : domainStatus[domain.name]?.verification?.error?.code === "missing_txt_record" ? (
                <VerificationDns
                  message={domainStatus[domain.name]?.verification?.error?.message}
                />
              ) : null}
            </div>
          ))}
      </div>
      <RemoveDomain
        mutateDomains={mutateDomains}
        isOpen={iRemoveOpen}
        setIsOpen={setIsRemoveOpen}
        domainName={selectedDomain?.name}
      />
      <TransferDomain
        mutateDomains={mutateDomains}
        isOpen={isTransferOpen}
        setIsOpen={setIsTransferOpen}
        domainName={selectedDomain?.name}
      />
    </>
  );
};

/*
 * DNS CONFIGURATION
 */

const extractSubdomain = (domain: string): string | null => {
  const subdomainRegex = /^([a-zA-Z0-9-]+)\.[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
  const match = domain.match(subdomainRegex);
  return match ? match[1] : null;
};

const ConfigureDns = ({ domain }: { domain: DomainWithLinkCount }) => {
  return (
    <div className="w-full space-y-2">
      <p className="text-13.5">Set the following record on your DNS provider to continue:</p>
      <div className="flex min-w-fit space-x-8 overflow-x-auto rounded-lg border bg-zinc-50 p-4 scrollbar-hide dark:bg-zinc-950">
        <div className="space-y-2.5">
          <p className="text-[13px] tracking-wide text-muted-foreground">Type</p>
          <p className={`font-mono text-xs`}>{domain.isSubdomain ? "CNAME" : "A"}</p>
        </div>
        <div className="space-y-2.5">
          <p className="text-[13px] text-muted-foreground">Name</p>
          <p className={`font-mono text-xs`}>
            {domain.isSubdomain ? extractSubdomain(domain.name) : "@"}
          </p>
        </div>
        <div className="space-y-2.5">
          <p className="text-[13px] text-muted-foreground">Value</p>
          <p className={`font-mono text-xs`}>
            {domain.isSubdomain ? "cname.qryptic.io" : "76.76.21.21"}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 rounded-lg border bg-zinc-50 px-4 py-2 dark:bg-zinc-950">
        <Info size={13} className="text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">
          It could take some time for changes to propagate.
        </p>
      </div>
    </div>
  );
};

/*
 * TXT RECORD VERIFICATION
 */

const extractTxtRecord = (message: string) => {
  const txt = message.match(/"([^"]+)"/);
  return txt ? txt[1] : "";
};

const VerificationDns = ({ message }: { message: string }) => {
  return (
    <div className="w-full space-y-2">
      <p className="text-13.5">Set the following record on your DNS provider to continue:</p>
      <div className="flex space-x-8 overflow-x-auto rounded-lg border bg-zinc-50 p-4 scrollbar-hide dark:bg-zinc-950">
        <div className="space-y-2.5">
          <p className="text-[13px] text-muted-foreground">Type</p>
          <p className={`font-mono text-xs tracking-wide`}>TXT</p>
        </div>
        <div className="space-y-2.5">
          <p className="text-[13px] text-muted-foreground">Name</p>
          <p className={`font-mono text-xs`}>_vercel</p>
        </div>
        <div className="relative w-full min-w-fit select-text space-y-2.5">
          <p className="text-[13px] text-muted-foreground">Value</p>
          <p className={`w-full overflow-auto text-nowrap font-mono text-xs`}>
            {extractTxtRecord(message)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 rounded-lg border bg-zinc-50 px-4 py-2 dark:bg-zinc-950">
        <Info size={13} className="text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">
          It could take some time for changes to propagate.
        </p>
      </div>
    </div>
  );
};

const DefaultDomain = () => {
  return (
    <Tooltip>
      <TooltipTrigger className="cursor-auto">
        {/*<div className="flex h-[19px] w-[19px] items-center justify-center rounded-full border border-foreground/20 bg-foreground/10 text-foreground">*/}
        <Target size={13} className="relative top-[1px] text-deepBlue-500 dark:text-deepBlue-400" />
        {/*</div>*/}
      </TooltipTrigger>
      <TooltipContent className="max-w-[200px] text-center">
        This is the default domain for your team.
      </TooltipContent>
    </Tooltip>
  );
};
