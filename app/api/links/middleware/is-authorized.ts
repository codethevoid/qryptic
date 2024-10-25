import { NextRequest } from "next/server";

export const isAuthorized = (req: NextRequest) => {
  const bearer = req.headers.get("authorization");
  const token = bearer?.split(" ")[1];
  return token === process.env.QRYPTIC_API_KEY;
};
