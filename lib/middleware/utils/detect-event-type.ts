import { NextRequest } from "next/server";

export const detectEventType = (req: NextRequest) => {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams);
  const qrValue = searchParams.get("qr");
  return qrValue === "1" ? "scan" : "click";
};
