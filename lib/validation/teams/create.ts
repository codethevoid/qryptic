import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter a team name" })
    .max(28, { message: "Team name can't be more than 28 characters" }),
});

export type CreateTeamFormValues = z.infer<typeof createTeamSchema>;
