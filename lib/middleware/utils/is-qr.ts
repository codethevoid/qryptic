import { NextRequest } from "next/server";

export const isQr = (req: NextRequest) => {
  const searchParams = new URLSearchParams(req.nextUrl.searchParams);
  const qrValue = searchParams.get("qr");
  return qrValue === "1";
};
