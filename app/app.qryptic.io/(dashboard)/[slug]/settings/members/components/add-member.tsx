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

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.string(),
});

const roles = [
  {
    value: "owner",
    label: "Owner",
    description: "Full access to the entire team",
  },
  {
    value: "member",
    label: "Member",
    description: "Create and edit links",
  },
];

export const AddMember = () => {
  const [role, setRole] = useState<"owner" | "member" | undefined>(undefined);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const { data: team } = useTeamSettings();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    values: {
      role,
    },
  });

  const onSubmit = async () => {
    console.log("submit", errors);
  };

  console.log(errors);

  return (
    <>
      <Card>
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle>Add a teammate</CardTitle>
            <CardDescription className="text-[13px]">Invite a member to your team</CardDescription>
          </CardHeader>
          <div className="p-6">
            <Button size="sm" variant="outline" className="space-x-2" disabled={team?.plan.isFree}>
              <Link2 size={14} />
              <span>Invite link</span>
            </Button>
          </div>
        </div>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                disabled={team?.plan.isFree}
                {...register("email")}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={role}
                onValueChange={(value: "owner" | "member") => setRole(value)}
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
            <Button size="sm" onClick={handleSubmit(onSubmit)}>
              Invite
            </Button>
          )}
        </CardFooter>
      </Card>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
    </>
  );
};
