import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { rootDomain } from "@/utils/qryptic/domains";
import type { User } from "@prisma/client";

type AuthUser = Pick<User, "id">;

const createUser = async (email: string, image?: string, name?: string | null) => {
  return prisma.user.create({
    data: {
      email,
      image,
      name,
      isEmailVerified: true,
      googleAuth: true,
    },
  });
};

type Credentials = {
  email: string;
  password: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      name: "google",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          response_type: "code",
        },
      },
    }),
    Credentials({
      name: "credentials",
      authorize: async (credentials: Partial<Record<string, unknown>>) => {
        const { email, password } = credentials as Credentials;
        const user: {
          id: string;
          email: string;
          name: string | null;
          image: string | null;
          hashedPassword: string | null;
        } | null = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: { id: true, email: true, name: true, image: true, hashedPassword: true },
        });
        if (!user) return null;
        // if (!user.credentialsAuth || !user.hashedPassword) return null
        if (!user.hashedPassword) return null;
        const isValid = await bcrypt.compare(password, user.hashedPassword);
        if (!isValid) return null;
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (account?.provider === "google") {
        // get email and check if it exists in the database
        const email = profile?.email?.toLowerCase().trim() as string;
        const user = await prisma.user.findUnique({ where: { email } });

        // create account if it doesn't exist in the database
        if (!user) {
          const newUser = await createUser(email, profile?.picture, profile?.name);
          if (!newUser) return false;
          // schedule welcome email and allow sign in
          // create welcome email
          return true;
        }

        // if account exists, check if they are allowed to sign in
        if (!user.googleAuth) return false;
      }

      // otherwise, allow sign in
      return true;
    },
    jwt: async ({ trigger, profile, account, token, user }) => {
      // if (trigger === "update") {
      //   const refreshedUser: AuthUser | null = await prisma.user.findUnique({
      //     where: { id: token.userId as string },
      //     select: { id: true, defaultTeam: true },
      //   });
      //   if (!refreshedUser) return {};
      //   // only need to update default team because that is the only thing we store in the token
      //   // other than users id, we won't use name, email, or image
      //   token.defaultTeam = refreshedUser.defaultTeam;
      //   return token;
      // }

      // handle initial sign in
      if (account) {
        if (account.provider === "google") {
          // need to get the users id
          const userInDb: AuthUser | null = await prisma.user.findUnique({
            where: { email: profile?.email?.toLowerCase().trim() as string },
            select: { id: true },
          });
          if (!userInDb) return {};
          const { id: userId } = userInDb;
          return { userId };
        }
        // if not google, then it's credentials
        // get users from db and attach details to token
        const userInDb: AuthUser | null = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true },
        });
        if (!userInDb) return {};
        const { id: userId } = userInDb;
        return { userId };
      }

      // handle subsequent sign ins
      return token;
    },
    session: async ({ token, session }) => {
      // attach users id to session
      if (token) {
        session.userId = token.userId as string;
      }
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? `.${rootDomain}` : ".localhost.com",
      },
    },
    // pkceCodeVerifier: {
    //   name: "authjs.pkce.code_verifier",
    //   options: {
    //     sameSite: "lax",
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     path: "/",
    //     domain: process.env.NODE_ENV === "production" ? `.${rootDomain}` : ".localhost.com", // omit for localhost
    //   },
    // },
  },
  pages: { error: "/login", signIn: "/login" },
});
