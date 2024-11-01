import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";

export const GET = withSession(async ({ user }) => {
  return NextResponse.json(user);
});
