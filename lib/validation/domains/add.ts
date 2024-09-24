import { z } from "zod";

// const domain regex
const domainRegex =
  /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/\S*)?(\?[^\s#]*)?(#[^\s]*)?$/;

export const addDomainSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please enter a domain name" })
    .regex(domainRegex, { message: "Please enter a valid domain name" }),
  destination: z
    .string()
    .regex(urlRegex, { message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
});

export type AddDomainFormValues = z.infer<typeof addDomainSchema>;
