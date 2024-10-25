"use server";

import prisma from "@/db/prisma";
import bcrypt from "bcrypt";

export const verifyPassword = async (slug: string, domain: string, password: string) => {
  if (!slug || !password) {
    return { error: "Slug and password are required" };
  }

  const link = await prisma.link.findUnique({
    where: { slug },
    select: { passwordHash: true },
  });

  if (!link) {
    return { error: "Link not found" };
  }

  if (!link.passwordHash) {
    return { error: "Link is not password protected" };
  }

  const isMatch = await bcrypt.compare(password, link.passwordHash);
  if (!isMatch) {
    return { error: "Invalid password" };
  }

  // add password to the URL and rerun through middleware
  // so we can track the event
  const url = `https://${domain}/${slug}?password=${password}`;
  return { url };
};
