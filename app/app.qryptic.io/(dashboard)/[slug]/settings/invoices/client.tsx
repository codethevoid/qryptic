"use client";

import { TeamSettings, useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, File, MailX, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/layout/loader";

type InvoiceStatus = TeamSettings["invoices"][0]["status"];

type BadgeVariant = "success" | "warning" | "error";

const badgeVariantMap: Record<InvoiceStatus, BadgeVariant> = {
  paid: "success",
  open: "warning",
  void: "error",
};

export const InvoicesClient = () => {
  const { data: team, isLoading, error } = useTeamSettings();

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading team settings</div>;

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <p className="font-semibold">Invoices for {team?.name}</p>
        <p className="text-sm text-muted-foreground">View and download your invoices</p>
      </div>
      {team?.invoices.length === 0 ? (
        <InvoicesEmptyState />
      ) : (
        <div className="w-full rounded-lg border">
          {team?.invoices.map((invoice, i) => (
            <div
              key={invoice.id}
              className={cn(
                "grid grid-cols-[1fr_1fr_30px] gap-6 px-3 py-2.5",
                i !== 0 && "border-t",
              )}
            >
              <div className="space-y-0.5">
                <p className="text-[13px]">{format(invoice.date, "MMMM d, yyyy")}</p>
                <div className="flex items-center space-x-2">
                  <p className="truncate text-[13px] text-muted-foreground">{invoice.number}</p>
                  <Badge
                    className="px-2 py-0 text-[11px] capitalize"
                    variant={badgeVariantMap[invoice.status]}
                  >
                    {invoice.status === "open" ? "unpaid" : invoice.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-[13px]">Amount due</p>
                <p className="text-[13px] text-muted-foreground">
                  {(invoice.amount / 100).toLocaleString("en-us", {
                    style: "currency",
                    currency: "usd",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="place-self-center">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuItem
                      className="space-x-2"
                      onSelect={() => {
                        window?.open(invoice.invoicePdf, "_blank");
                      }}
                    >
                      <Download size={13} />
                      <span className="text-[13px]">Download invoice</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InvoicesEmptyState = () => {
  return (
    <div className="flex h-52 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white shadow-sm dark:from-accent/10 dark:to-accent">
          <File size={15} />
        </div>
        <div className="space-y-0.5">
          <p className="text-center text-sm font-medium">No invoices found</p>
          <p className="text-center text-[13px] text-muted-foreground">
            Your invoices will appear here
          </p>
        </div>
      </div>
    </div>
  );
};
