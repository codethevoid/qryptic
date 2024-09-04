"use server";

import { auth } from "@/auth";
import { keywords } from "@/utils/keywords";

export const createTeam = async (name: string) => {
  const token = await auth();
  if (!token) throw new Error("Unauthorized");
};
