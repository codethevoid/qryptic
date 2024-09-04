import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const secret = process.env.AUTH_SECRET as string;
const tokenName =
  process.env.NODE_ENV === "production" ? "__Secure-authjs.session-token" : "authjs.session-token";

export const getUserToken = async (req: NextRequest) => {
  return getToken({
    req,
    secret,
    salt: tokenName,
    secureCookie: process.env.NODE_ENV === "production",
  });
};
