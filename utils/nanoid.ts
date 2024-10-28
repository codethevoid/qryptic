import "server-only";
import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  4,
);
