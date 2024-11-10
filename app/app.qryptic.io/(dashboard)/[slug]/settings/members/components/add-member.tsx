import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

const inviteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  // role: z.union([z.literal("owner"), z.literal("member")], { message: "Please select a role" }),
  role: z.preprocess(
    (val) => (val === undefined ? null : val),
    z
      .union([z.literal("owner"), z.literal("member")])
      .nullable()
      .refine((val) => val !== null, {
        message: "Please select a role",
      }),
  ),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

const roles = [
  {
    value: "owner",
    label: "Owner",
    description: "Full access to the entire team",
  },
  {
    value: "member",
    label: "Member",
    description: "Manage links, domains, and tags",
  },
];

type Props = {
  setTab: (tab: "members" | "invites") => void;
  setIsInviteOpen: (open: boolean) => void;
};

export const AddMember = ({ setTab, setIsInviteOpen }: Props) => {
  const [role, setRole] = useState<"owner" | "member" | undefined>(undefined);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: team, mutate } = useTeamSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InviteFormValues>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (values: InviteFormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${team?.slug}/invites/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setIsLoading(false);
        const data = await res.json();
        return toast.error(data.error);
      }

      setIsLoading(false);
      setValue("email", "");
      setRole(undefined);
      await mutate();
      setTab("invites");
      toast.success("Invite sent!");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle>Add a teammate</CardTitle>
            <CardDescription className="text-[13px]">Start collaborating</CardDescription>
          </CardHeader>
          <div className="p-6">
            <Button
              size="sm"
              variant="outline"
              className="space-x-2"
              disabled={team?.plan.isFree}
              onClick={() => setIsInviteOpen(true)}
            >
              <Link2 size={14} />
              <span>Invite link</span>
            </Button>
          </div>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                disabled={team?.plan.isFree}
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value: "owner" | "member") => {
                  setRole(value);
                  setValue("role", value as "owner" | "member");
                }}
                disabled={team?.plan.isFree}
              >
                <SelectTrigger className={cn("font-normal", !role && "text-muted-foreground")}>
                  {role ? role.split("")[0].toUpperCase() + role.slice(1) : "Select role..."}
                </SelectTrigger>
                <SelectContent onCloseAutoFocus={(e) => e.preventDefault()}>
                  {roles.map((item) => (
                    <SelectItem value={item.value} key={item.value}>
                      <div>
                        <p className="text-[13px]">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && <p className="text-xs text-red-600">{errors.role.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          {team?.plan.isFree ? (
            <p className="text-[13px] text-muted-foreground">Upgrade to add team members</p>
          ) : (
            <p className="text-[13px] text-muted-foreground">
              Learn more about{" "}
              <a href="#" className="text-deepBlue-500 hover:underline dark:text-deepBlue-400">
                members
              </a>
            </p>
          )}
          {team?.plan.isFree ? (
            <Button size="sm" onClick={() => setIsUpgradeOpen(true)}>
              Upgrade
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit(onSubmit)}
              className="w-[58px]"
              disabled={isLoading}
            >
              {isLoading ? <ButtonSpinner /> : "Invite"}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
    </>
  );
};
