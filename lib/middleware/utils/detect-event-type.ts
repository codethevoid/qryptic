import { NextRequest } from "next/server";

export const detectEventType = (req: NextRequest) => {
  const qrValue = req.nextUrl.searchParams.get("qr");
  return qrValue === "1" ? "scan" : "click";
};
