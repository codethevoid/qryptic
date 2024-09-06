"use server";

import prisma from "@/db/prisma";
import { nanoid } from "@/utils/nanoid";
import type { User } from "@prisma/client";
import { RegisterFormValues } from "@/lib/validation/users/register";
import bcrypt from "bcrypt";
import { sendEmail } from "@/utils/send-email";
import { EmailVerificationEmail } from "@/emails/email-verification";
import { protocol, appDomain } from "@/lib/domains";
import { signIn } from "@/auth";

type RegisterUserResponse = {
  error?: boolean;
  message: string;
};

export const registerUser = async (data: RegisterFormValues): Promise<RegisterUserResponse> => {
  // check if email is already in use
  let { email, password } = data;
  if (!email || !password) return { error: true, message: "Invalid request" };

  email = email.toLowerCase().trim();

  if (await prisma.user.findUnique({ where: { email: email } })) {
    return { error: true, message: "Email is already in use" };
  }

  // create users
  // create email verification token
  const token = nanoid(32);
  const avatar = `https://api.dicebear.com/9.x/lorelei/png?seed=${email}&scale=90&backgroundColor=ffffff`;

  const user: User = await prisma.user.create({
    data: {
      email,
      hashedPassword: await bcrypt.hash(password, 10),
      image: avatar,
      emailToken: token,
      credentialsAuth: true,
    },
  });

  if (!user) return { error: true, message: "Failed to create users" };

  // send email verification email
  await sendEmail({
    from: "Qryptic <support@mailer.qryptic.io>",
    to: email,
    replyTo: "suppport@qryptic.io",
    subject: "Verify your email address",
    react: EmailVerificationEmail(token),
    text: `Welcome to Qryptic! Verify your email address by clicking this link ${protocol}${appDomain}/verify-email?token=${token}`,
  });

  // schedule welcome email to be sent in 30 minutes
  const scheduledAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

  // log users in if users creation is successful
  const options = { email, password, redirect: false };
  await signIn("credentials", options);

  return { error: false, message: "User created successfully" };
};
