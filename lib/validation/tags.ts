import { z } from "zod";

export const tagSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter a tag name" })
    .max(20, { message: "Tag name must be no more than 20 characters" }),
  notes: z.string().optional(),
});

export type TagFormValues = z.infer<typeof tagSchema>;
